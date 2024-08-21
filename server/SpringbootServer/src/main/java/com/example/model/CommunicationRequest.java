package com.example.model;

import lombok.*;
import java.util.List;

@Getter
@Setter
public class CommunicationRequest {
    // 채팅 내용
    private String chatSentence;
    private int topK;
    private float similarity;
    private String gptRole;
}
