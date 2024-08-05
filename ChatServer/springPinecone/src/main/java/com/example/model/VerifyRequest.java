package com.example.model;

import lombok.Getter;

@Getter
public class VerifyRequest {
//    openai 이외에는 허깅페이스 임베딩 모델 사용
    private String verifyType;
    private String question;
    private int topK;
}
