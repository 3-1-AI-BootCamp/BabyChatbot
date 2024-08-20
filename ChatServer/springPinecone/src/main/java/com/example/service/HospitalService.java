package com.example.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.apache.commons.text.similarity.LevenshteinDistance;
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

    // Haversine 공식을 사용하여 두 지점 간의 거리를 계산하는 함수
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구 반경 (킬로미터)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 킬로미터 단위로 반환
    }

    public List<Document> searchHospitalsByNameAndRegion(String name, String region, double userLat, double userLon) {
        logger.info("Searching hospitals by name: {} in region: {}", name, region);

        MongoDatabase database = mongoClient.getDatabase("hospital");
        MongoCollection<Document> hospitalCollection = database.getCollection("hospitals");

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

        // 가장 가까운 병원 찾기
        Document closestHospital = null;
        double minDistance = Double.MAX_VALUE;

        for (Document hospital : matchedHospitals) {
            double hospitalLat = hospital.get("좌표", Document.class).getDouble("Y");
            double hospitalLon = hospital.get("좌표", Document.class).getDouble("X");
            double distance = calculateDistance(userLat, userLon, hospitalLat, hospitalLon);

            if (distance < minDistance) {
                minDistance = distance;
                closestHospital = hospital;
            }
        }

        logger.info("Found closest hospital: {}", closestHospital);
        return closestHospital != null ? Collections.singletonList(closestHospital) : Collections.emptyList();
    }
}
