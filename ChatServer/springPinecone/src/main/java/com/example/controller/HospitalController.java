package com.example.controller;

import com.example.service.HospitalService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchHospitalByNameAndRegion(@RequestBody Map<String, Object> requestBody) {
        try {
            String name = (String) requestBody.get("요양기관명");
            String region = (String) requestBody.get("지역");
            String category = (String) requestBody.get("병원유형");
            Map<String, Double> userLocation = (Map<String, Double>) requestBody.get("사용자위치");
            double userLat = userLocation.get("위도");
            double userLon = userLocation.get("경도");

            List<Document> hospitals = hospitalService.searchHospitalsByNameAndRegion(name, region, category, userLat, userLon);

            if (hospitals.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(hospitals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

}