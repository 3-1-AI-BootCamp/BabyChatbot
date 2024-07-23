package com.example.gptChat.repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuestionRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Document> findAll() {
        return mongoTemplate.findAll(Document.class, "questions");
    }
}
