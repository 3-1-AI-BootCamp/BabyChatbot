package com.example.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    // mongoDB에 저장할 값들
    // 자동 생성되는 값
    @Id
    private String id;

    // email~profileImage까지는 사용자가 직접 입력해야 하는 값
    @Indexed(unique = true)
    private String email;

    private String password;
    private String childName;
    private String childBirthdate;
    private String childGender;
    private String signUpDate;
    private String profileImage; // 프로필 이미지 필드 추가
}
