package com.example.model;

import lombok.Getter;


@Getter
public class CommunicationRequest {
//    채팅 내용
    private String chatSentence;
//    gpt, 젬마 등 모델 선택
    private String modelType;
}
