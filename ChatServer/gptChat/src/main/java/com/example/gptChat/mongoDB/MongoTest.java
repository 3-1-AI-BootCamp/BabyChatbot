package com.example.gptChat.mongoDB;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.Getter;
import lombok.Setter;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import static com.mongodb.client.model.Filters.eq;

@Component
@RestController
@RequestMapping("/mongoTest")
public class MongoTest {

    private final MongoClient mongoClient;

    @Autowired
    public MongoTest(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @PostMapping("/movie")
    public ResponseEntity<String> getMovieByTitle(@RequestBody TitleRequest titleRequest) {
        MongoDatabase database = mongoClient.getDatabase("sample_mflix");
        MongoCollection<Document> collection = database.getCollection("movies");

        Document doc = collection.find(eq("title", titleRequest.getTitle())).first();
        if (doc != null) {
            return ResponseEntity.ok(doc.toJson());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Setter
    @Getter
    public static class TitleRequest {
        private String title;

    }
}
