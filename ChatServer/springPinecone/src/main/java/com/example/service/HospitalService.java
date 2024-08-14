package com.example.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);

    private final MongoClient mongoClient;

    @Autowired
    public HospitalService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    public void uploadHospitalData() throws Exception {
        MongoDatabase database = mongoClient.getDatabase("hospital");
        MongoCollection<Document> hospitalCollection = database.getCollection("hospitals");
        MongoCollection<Document> pharmacyCollection = database.getCollection("pharmacies");

        File hospitalInfoFile = new ClassPathResource("csv_files/병원정보.csv").getFile();
        File hospitalDetailFile = new ClassPathResource("csv_files/병원세부.csv").getFile();
        File pharmacyInfoFile = new ClassPathResource("csv_files/약국정보.csv").getFile();

        Map<String, Document> hospitalMap = new HashMap<>();

        // 병원정보 CSV 파일 처리
        try (BufferedReader br = Files.newBufferedReader(Paths.get(hospitalInfoFile.getPath()), StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                String key = record.get(0);

                Document doc = new Document("암호화요양기호", key)
                        .append("요양기관명", record.get(1))
                        .append("종별코드명", record.get(2))
                        .append("주소", record.get(3))
                        .append("전화번호", record.get(4))
                        .append("병원홈페이지", record.get(5).isEmpty() ? null : record.get(5))
                        .append("총의사수", parseIntOrDefault(record.get(6), 0))
                        .append("의과일반의", parseIntOrDefault(record.get(7), 0))
                        .append("의과인턴", parseIntOrDefault(record.get(8), 0))
                        .append("의과레지던트", parseIntOrDefault(record.get(9), 0))
                        .append("의과전문의", parseIntOrDefault(record.get(10), 0))
                        .append("치과일반의", parseIntOrDefault(record.get(11), 0))
                        .append("치과인턴", parseIntOrDefault(record.get(12), 0))
                        .append("치과레지던트", parseIntOrDefault(record.get(13), 0))
                        .append("치과전문의", parseIntOrDefault(record.get(14), 0))
                        .append("한방일반의", parseIntOrDefault(record.get(15), 0))
                        .append("한방인턴", parseIntOrDefault(record.get(16), 0))
                        .append("한방레지던트", parseIntOrDefault(record.get(17), 0))
                        .append("한방전문의", parseIntOrDefault(record.get(18), 0))
                        .append("조산사", parseIntOrDefault(record.get(19), 0))
                        .append("좌표", new Document("X", parseDoubleOrDefault(record.get(20), 0.0))
                                .append("Y", parseDoubleOrDefault(record.get(21), 0.0)))
                        .append("진료과목", new ArrayList<String>());

                hospitalMap.put(key, doc);
            }
        }

        // 병원세부 CSV 파일에서 진료과목 데이터를 추가
        try (BufferedReader br = Files.newBufferedReader(Paths.get(hospitalDetailFile.getPath()), StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                String key = record.get(0); // 암호화요양기호
                String subject = record.get(2); // 진료과목

                if (hospitalMap.containsKey(key)) {
                    Document doc = hospitalMap.get(key);
                    List<String> subjects = doc.getList("진료과목", String.class);

                    // 기존의 "진료과목" 리스트에 올바른 "진료과목" 값을 추가
                    if (subjects == null) {
                        subjects = new ArrayList<>();
                    }
                    subjects.add(subject);
                    doc.put("진료과목", subjects);
                }
            }
        }

        // 병원 데이터를 MongoDB에 삽입
        for (Document doc : hospitalMap.values()) {
            hospitalCollection.insertOne(doc);
        }

        // 약국 CSV 파일 처리 및 MongoDB에 삽입
        try (BufferedReader br = Files.newBufferedReader(Paths.get(pharmacyInfoFile.getPath()), StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                Document doc = new Document("암호화요양기호", record.get(0))
                        .append("약국명", record.get(1))
                        .append("종별코드명", record.get(2))
                        .append("주소", record.get(3))
                        .append("전화번호", record.get(4))
                        .append("좌표", new Document("X", parseDoubleOrDefault(record.get(5), 0.0))
                                .append("Y", parseDoubleOrDefault(record.get(6), 0.0)));
                pharmacyCollection.insertOne(doc);
            }
        }
    }

    // 비어 있거나 잘못된 숫자 값을 처리하는 헬퍼 메서드
    private int parseIntOrDefault(String value, int defaultValue) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private double parseDoubleOrDefault(String value, double defaultValue) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public List<Document> searchHospitalsByName(String name) {
        logger.info("Searching hospitals by name: {}", name);

        MongoDatabase database = mongoClient.getDatabase("hospital");
        MongoCollection<Document> hospitalCollection = database.getCollection("hospitals");

        List<Document> allHospitals = hospitalCollection.find().into(new ArrayList<>());
        List<Document> matchedHospitals = new ArrayList<>();

        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();

        for (Document hospital : allHospitals) {
            String hospitalName = hospital.getString("요양기관명");
            int distance = levenshteinDistance.apply(name, hospitalName);
            if (distance <= 2) {  // 거리가 2 이하인 경우 유사한 것으로 간주
                matchedHospitals.add(hospital);
            }
        }

        matchedHospitals.sort((h1, h2) -> {
            int d1 = levenshteinDistance.apply(name, h1.getString("요양기관명"));
            int d2 = levenshteinDistance.apply(name, h2.getString("요양기관명"));
            return Integer.compare(d1, d2);
        });

        logger.info("Found {} hospitals matching name: {}", matchedHospitals.size(), name);
        return matchedHospitals;
    }
}
