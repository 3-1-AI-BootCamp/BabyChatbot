package com.example.controller;

import com.example.model.InsertRequest;
import com.example.model.QAData;
import com.example.model.VerifyRequest;
import com.example.service.PineconeService;
import com.example.util.QADataReader;
import io.pinecone.proto.DescribeIndexStatsResponse;
import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pinecone")
public class PineconeController {
    private final PineconeService pineconeService;


    @Autowired
    public PineconeController(PineconeService pineconeService) {
        this.pineconeService = pineconeService;
    }


//    multilingual/openai 임베딩 데이터 벡터 유사 조회
    @PostMapping("/query")
    public List<Map<String, String>> querySimilarQuestions(@RequestBody Map<String, Object> request) {
        String question = (String) request.get("question");
        int topK = (int) request.get("topK");

        if ("openai".equals(request.get("verifyType"))) {
            return pineconeService.querySimilarQuestionsOpenai(question, topK);
        } else {
            return pineconeService.querySimilarQuestions(question, topK);
        }
    }


//    multilingual/openai 임베딩 네임스페이스의 전체 레코드 수 조회 (데이터 파싱 필요)
    @PostMapping("/stats")
    public String getTotalRecordsInNamespace(@RequestBody VerifyRequest request) {
        boolean type = true;
        if("openai".equals(request.getVerifyType())) type = false;
        return pineconeService.getTotalRecordsInNamespace(type);
    }


//    임베딩 방식 지정해서 데이터 삽입(로컬 컴퓨터의 csv 파일 데이터를 저장함)
    @PostMapping("/insert")
    public void dataInsert(@RequestBody InsertRequest request) {
        try {
            QADataReader reader = new QADataReader();
            List<QAData> qaDataList = reader.readAllCsvFiles();

            if ("openai".equals(request.getInsertType())) {
                for (QAData data : qaDataList) {
                    pineconeService.insertQAPairOpenai(data.getQuestion(), data.getAnswer());
                }
            } else {
                for (QAData data : qaDataList) {
                    pineconeService.insertQAPair(data.getQuestion(), data.getAnswer());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}