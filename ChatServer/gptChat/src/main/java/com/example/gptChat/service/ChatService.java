package com.example.gptChat.service;

import com.example.gptChat.util.VectorUtil;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import java.util.*;

@Service
public class ChatService {

    private final MongoTemplate mongoTemplate;
    private final VectorUtil vectorUtil;

    @Autowired
    public ChatService(MongoTemplate mongoTemplate, VectorUtil vectorUtil) {
        this.mongoTemplate = mongoTemplate;
        this.vectorUtil = vectorUtil;
    }

    public ResponseEntity<Map<String, String>> search(Map<String, String> request) {
        String question = request.get("question");
        System.out.println("Input question: " + question);

        // 입력 질문을 벡터화
        List<Double> questionVector = vectorUtil.encode(question);

        // MongoDB Atlas Search 쿼리 생성
        Query query = new Query();
        query.addCriteria(Criteria.where("vector").near(new Document("$vector", questionVector).append("$path", "vector").append("$num", 1)));

        // 가장 유사한 문서 검색
        Document mostSimilar = mongoTemplate.findOne(query, Document.class, "questions");

        Map<String, String> response = new HashMap<>();
        if (mostSimilar != null) {
            response.put("answer", mostSimilar.getString("answer"));
            System.out.println("Most similar question: " + mostSimilar.getString("question"));
        } else {
            response.put("answer", "죄송합니다. 관련된 답변을 찾지 못했습니다.");
            System.out.println("유사한 질문을 찾지 못했습니다.");
        }

        return ResponseEntity.ok(response);
    }
}