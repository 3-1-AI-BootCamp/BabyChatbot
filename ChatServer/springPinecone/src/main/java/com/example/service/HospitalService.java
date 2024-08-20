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

        // CSV file containing hospital information
        File hospitalInfoFile = new ClassPathResource("csv_files/병원정보.csv").getFile();

        // Reading the CSV file
        try (BufferedReader br = Files.newBufferedReader(Paths.get(hospitalInfoFile.getPath()), StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                // CSV의 임의의 영문 이름 필드 가져오기
                String hospitalId = record.get("HospitalID");
                String region = record.get("location");

                // Find the existing document in MongoDB by 암호화요양기호
                Document existingDoc = hospitalCollection.find(Filters.eq("암호화요양기호", hospitalId)).first();

                if (existingDoc != null) {
                    // Update the document with the new region information
                    hospitalCollection.updateOne(Filters.eq("암호화요양기호", hospitalId),
                            new Document("$set", new Document("지역", region)));
                    logger.info("Updated hospital with ID {}: added region {}", hospitalId, region);
                } else {
                    // Document doesn't exist, insert a new one
                    Document newDoc = new Document("암호화요양기호", hospitalId)
                            .append("지역", region);
                    hospitalCollection.insertOne(newDoc);
                    logger.info("Inserted new hospital with ID {}: added region {}", hospitalId, region);
                }
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

    // 요양기관명과 지역을 함께 주며 검색을 요청했을 경우의 함수
    public List<Document> searchHospitalsByNameAndRegion(String name, String region) {
        logger.info("Searching hospitals by name: {} in region: {}", name, region);

        MongoDatabase database = mongoClient.getDatabase("hospital");
        MongoCollection<Document> hospitalCollection = database.getCollection("hospitals");

        // MongoDB 검색 쿼리 생성
        List<Document> allHospitals;
        if (region == null || region.isEmpty()) {
            allHospitals = hospitalCollection.find().into(new ArrayList<>());
        } else {
            allHospitals = hospitalCollection.find(Filters.regex("주소", "^" + region)).into(new ArrayList<>());
        }

        List<Document> matchedHospitals = new ArrayList<>();
        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();

        for (Document hospital : allHospitals) {
            String hospitalName = hospital.getString("요양기관명");
            int distance = levenshteinDistance.apply(name, hospitalName);
            if (distance <= 2) {
                matchedHospitals.add(hospital);
            }
        }

        matchedHospitals.sort((h1, h2) -> {
            int d1 = levenshteinDistance.apply(name, h1.getString("요양기관명"));
            int d2 = levenshteinDistance.apply(name, h2.getString("요양기관명"));
            return Integer.compare(d1, d2);
        });

        logger.info("Found {} hospitals matching name: {} in region: {}", matchedHospitals.size(), name, region);
        return matchedHospitals;
    }
}
