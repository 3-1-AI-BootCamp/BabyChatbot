package com.example.gptChat.service;

import com.example.gptChat.model.User;
import com.example.gptChat.repository.UserRepository;
import com.mongodb.client.*;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final MongoClient mongoClient;

    @Autowired
    public UserService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    public User registerUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        MongoDatabase database = mongoClient.getDatabase("users");
        MongoCollection<Document> collection = database.getCollection("users");

        Document existingUser = collection.find(new Document("email", user.getEmail())).first();
        if (existingUser != null) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setSignUpDate(LocalDateTime.now().toString());

        Document newUser = new Document("email", user.getEmail())
                .append("password", user.getPassword())
                .append("childName", user.getChildName())
                .append("childGender", user.getChildGender())
                .append("childBirthdate", user.getChildBirthdate())
                .append("signUpDate", user.getSignUpDate());

        collection.insertOne(newUser);

        return user;
    }

    public User loginUser(String email, String password) {
        MongoDatabase database = mongoClient.getDatabase("users");
        MongoCollection<Document> collection = database.getCollection("users");

        Document userDoc = collection.find(new Document("email", email)).first();
        if (userDoc != null && passwordEncoder.matches(password, userDoc.getString("password"))) {
            User user = new User();
            user.setEmail(userDoc.getString("email"));
            user.setChildName(userDoc.getString("childName"));
            user.setChildGender(userDoc.getString("childGender"));
            user.setChildBirthdate(userDoc.getString("childBirthdate"));
            user.setSignUpDate(userDoc.getString("signUpDate"));
            return user;
        }
        return null;
    }
}