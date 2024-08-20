package com.example.controller;

import com.example.service.HospitalService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/upload")
    public String uploadData() {
        try {
            hospitalService.uploadHospitalData();
            return "Data uploaded successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload data: " + e.getMessage();
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<Document>> searchHospitalByNameAndRegion(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("요양기관명");
        String region = requestBody.get("지역");

        List<Document> hospitals;

        if (region != null && !region.isEmpty()) {
            hospitals = hospitalService.searchHospitalsByNameAndRegion(name, region);
        } else if (name != null && !name.isEmpty()) {
            hospitals = hospitalService.searchHospitalsByNameAndRegion(name, ""); // Search without a specific region
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (hospitals.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

}