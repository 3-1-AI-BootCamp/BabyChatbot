package com.example.gptChat.repository;

import com.example.gptChat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

// 이메일 찾기 등에 사용되나 지금은 사용하지 않음
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}