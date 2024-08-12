package com.example.model;

public class InsertRequest {
//    'openai' 이외에는 허깅페이스 임베딩 모델 사용
    private String insertType;
    private boolean shouldPrint;

    public String getInsertType() {
        return insertType;
    }

    public boolean isShouldPrint() {
        return shouldPrint;
    }
}