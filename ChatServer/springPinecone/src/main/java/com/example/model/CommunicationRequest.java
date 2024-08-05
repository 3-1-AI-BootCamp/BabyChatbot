package com.example.model;

import lombok.*;
import java.util.List;

@Getter
@Setter
public class CommunicationRequest {
    // 채팅 내용
    private String chatSentence;

//    클라에서 태그까지 같이 줄 경우 사용(지금은 fast api에서 태그 구별해줄거라 필요없음)
//    private List<String> tags;
}
