package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
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

    // mongoDB 연결 설정
    private final MongoClient mongoClient;

    // mongoDB 연동
    @Autowired
    public UserService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }


    // mongoDB에 연결하여 회원가입 작업 수행
    public User registerUser(User user) {
        // sql로 키면 기본키인 emall 값이 비어있는 지 확인하고, 비어있다면 돌려보냄
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        // mongoDB 중 users 이름의 DB와 users 이름의 컬렉션에 접근
        MongoDatabase database = mongoClient.getDatabase("users");
        MongoCollection<Document> collection = database.getCollection("users");

        // 이메일 중복 검사 시행(users-users에 이미 해당하는 이메일이 존재하는 지 확인)
        Document existingUser = collection.find(new Document("email", user.getEmail())).first();
        if (existingUser != null) {
            throw new RuntimeException("Email already exists");
        }

        // 비밀번호 인코더화(해싱 작업 비슷하게 숨기는 거)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setSignUpDate(LocalDateTime.now().toString());

        // 받았던 값들 저장하는 과정
        Document newUser = new Document("email", user.getEmail())
                .append("password", user.getPassword())
                .append("childName", user.getChildName())
                .append("childGender", user.getChildGender())
                .append("childBirthdate", user.getChildBirthdate())
                .append("signUpDate", user.getSignUpDate())
                .append("profileImage", user.getProfileImage());

        collection.insertOne(newUser);

        return user;
    }


    // mongoDB에 연결하여 로그인 작업 수행
    public User loginUser(String email, String password) {
        // mongoDB 중 users 이름의 DB와 users 이름의 컬렉션에 접근
        MongoDatabase database = mongoClient.getDatabase("users");
        MongoCollection<Document> collection = database.getCollection("users");

        // 이메일, 비밀번호를 찾아서 비교하는 작업 수행, 일치하면 로그인 성공
        Document userDoc = collection.find(new Document("email", email)).first();
        if (userDoc != null && passwordEncoder.matches(password, userDoc.getString("password"))) {
            User user = new User();
            user.setEmail(userDoc.getString("email"));
            user.setChildName(userDoc.getString("childName"));
            user.setChildGender(userDoc.getString("childGender"));
            user.setChildBirthdate(userDoc.getString("childBirthdate"));
            user.setSignUpDate(userDoc.getString("signUpDate"));
            user.setProfileImage(userDoc.getString("profileImage"));
            return user;
        }
        return null;
    }


    // 이거는 유저 프로필 업데이트 용으로 만들다 만건데, 지금은 작동하지 않음. 삭제하거나 마음대로 업데이트 해도 무방함
    public User updateUserProfile(User user) {
        MongoDatabase database = mongoClient.getDatabase("users");
        MongoCollection<Document> collection = database.getCollection("users");

        Document existingUser = collection.find(new Document("email", user.getEmail())).first();
        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        Document updateFields = new Document("childName", user.getChildName())
                .append("childGender", user.getChildGender())
                .append("childBirthdate", user.getChildBirthdate())
                .append("profileImage", user.getProfileImage());

        collection.updateOne(new Document("email", user.getEmail()), new Document("$set", updateFields));

        return user;
    }
}
