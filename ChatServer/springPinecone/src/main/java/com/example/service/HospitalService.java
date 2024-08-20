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
