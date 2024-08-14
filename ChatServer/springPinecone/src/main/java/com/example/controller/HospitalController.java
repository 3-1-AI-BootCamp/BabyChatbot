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
    public ResponseEntity<Document> searchHospitalByName(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("요양기관명");
        List<Document> hospitals = hospitalService.searchHospitalsByName(name);

        if (hospitals.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Document hospital = hospitals.get(0); // 첫 번째 병원만 반환

        // 진료과목을 최대 5개로 제한
        List<String> limitedSubjects = hospital.getList("진료과목", String.class).stream()
                .limit(5)
                .collect(Collectors.toList());

        // 필요한 모든 정보를 반환
        Document result = new Document("요양기관명", hospital.getString("요양기관명"))
                .append("종별코드명", hospital.getString("종별코드명"))
                .append("주소", hospital.getString("주소"))
                .append("전화번호", hospital.getString("전화번호"))
                .append("병원홈페이지", hospital.getString("병원홈페이지"))
                .append("총의사수", hospital.getInteger("총의사수"))
                .append("의과일반의", hospital.getInteger("의과일반의"))
                .append("의과인턴", hospital.getInteger("의과인턴"))
                .append("의과레지던트", hospital.getInteger("의과레지던트"))
                .append("의과전문의", hospital.getInteger("의과전문의"))
                .append("치과일반의", hospital.getInteger("치과일반의"))
                .append("치과인턴", hospital.getInteger("치과인턴"))
                .append("치과레지던트", hospital.getInteger("치과레지던트"))
                .append("치과전문의", hospital.getInteger("치과전문의"))
                .append("한방일반의", hospital.getInteger("한방일반의"))
                .append("한방인턴", hospital.getInteger("한방인턴"))
                .append("한방레지던트", hospital.getInteger("한방레지던트"))
                .append("한방전문의", hospital.getInteger("한방전문의"))
                .append("조산사", hospital.getInteger("조산사"))
                .append("좌표", hospital.get("좌표"))
                .append("진료과목", limitedSubjects);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}