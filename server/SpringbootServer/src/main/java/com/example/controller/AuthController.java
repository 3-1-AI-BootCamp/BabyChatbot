package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // 회원가입 컨트롤러로 요청이 들어오면 그 값을 userService에 보냄
    // 참고로 지금 email 말고는 빈 값 체크를 안해서 이메일만 입력해도 회원가입이 될거임(백엔드 상에선)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // 이메일이 빈 값인지 확인
        try {
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            // 이메일이 비어있지 않으면 userService로 회원가입 요청
            User registeredUser = userService.registerUser(user);

            // 회원가입 완료 후 ok 사인 보냄
            return ResponseEntity.ok(registeredUser);
            // 오류 나면 오류 메시지 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // 로그인 컨트롤러로 요청이 들어오면 그 값을 userService에 보냄
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        // userService로 로그인 작업 수행
        User loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());

        // 로그인 성공 시 if문 실행, 실패 시 else문 실행
        if (loggedInUser != null) {
            return ResponseEntity.ok(loggedInUser);
        } else {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}