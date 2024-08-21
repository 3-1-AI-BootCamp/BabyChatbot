package com.example.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@Service
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);

    private final MongoClient mongoClient;

    @Autowired
    public HospitalService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    // 문자열이 비어있는지 확인하는 헬퍼 메소드
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Document> searchHospitalsByNameAndRegion(String name, String region, String category, double userLat, double userLon) {
        logger.info("Searching hospitals by name: {}, region: {}, category: {}", name, region, category);

        MongoDatabase database = mongoClient.getDatabase("hospital");
        MongoCollection<Document> hospitalCollection = database.getCollection("hospitals");

        List<org.bson.conversions.Bson> filters = new ArrayList<>();

        // name 파라미터 정제
        if (name != null) {
            name = name.trim().replaceAll("(?i)null", "").replaceAll("[{}]", "").trim();
        }

        if (region != null) {
            region = region.trim().replaceAll("(?i)null", "").replaceAll("[{}]", "").trim();
        }

        if (category != null) {
            category = category.trim().replaceAll("(?i)null", "").replaceAll("[{}]", "").trim();
        }

        logger.info("Name filter: {}", (!isEmpty(name)) ? name : "Not applied");
        logger.info("Region filter: {}", (!isEmpty(region)) ? region : "Not applied");
        logger.info("Category filter: {}", (!isEmpty(category)) ? category : "Not applied");

        if (!isEmpty(region)) {
            filters.add(Filters.regex("지역", region, "i"));
        }

        if (!isEmpty(name)) {
            filters.add(Filters.regex("요양기관명", name, "i"));
        }

        if (!isEmpty(category)) {
            filters.add(Filters.regex("진료과목", category, "i"));
        }

        logger.info("Applied filters: {}", filters);

        List<Document> allHospitals;
        if (!filters.isEmpty()) {
            allHospitals = hospitalCollection.find(Filters.and(filters)).into(new ArrayList<>());
        } else {
            allHospitals = hospitalCollection.find().into(new ArrayList<>());
        }

        logger.info("Hospitals found: {}", allHospitals.size());

        Document closestHospital = null;
        double minDistance = Double.MAX_VALUE;

        for (Document hospital : allHospitals) {
            Document coordinates = (Document) hospital.get("좌표");
            if (coordinates != null) {
                double hospitalLat = coordinates.getDouble("Y");
                double hospitalLon = coordinates.getDouble("X");
                double distance = calculateDistance(userLat, userLon, hospitalLat, hospitalLon);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestHospital = hospital;
                }
            }
        }

        logger.info("Found closest hospital: {}", closestHospital != null ? closestHospital.getString("요양기관명") : "null");
        return closestHospital != null ? Collections.singletonList(closestHospital) : Collections.emptyList();
    }
}