package com.example.gptChat.mongoDB.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.stereotype.Service;

import static com.mongodb.client.model.Filters.eq;

@Service
public class MongoService {

    private final MongoClient mongoClient;

    public MongoService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    public String findMovieByTitle(String title) {
        MongoDatabase database = mongoClient.getDatabase("sample_mflix");
        MongoCollection<Document> collection = database.getCollection("movies");

        Document doc = collection.find(eq("title", title)).first();
        if (doc != null) {
            return doc.toJson();
        } else {
            return "No matching documents found.";
        }
    }
}