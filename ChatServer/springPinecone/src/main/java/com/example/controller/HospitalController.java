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
    public ResponseEntity<List<Document>> searchHospitalByNameAndRegion(@RequestBody Map<String, Object> requestBody) {
        String name = (String) requestBody.get("요양기관명");
        String region = (String) requestBody.get("지역");
        Map<String, Double> userLocation = (Map<String, Double>) requestBody.get("사용자위치");
        double userLat = userLocation.get("위도");
        double userLon = userLocation.get("경도");

        List<Document> hospitals = hospitalService.searchHospitalsByNameAndRegion(name, region, userLat, userLon);

        if (hospitals.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

}