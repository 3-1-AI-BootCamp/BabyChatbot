package com.example.service;

import com.example.util.FastApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Map;


@Service
public class TagLabeling {
    private final FastApiClient fastApiClient;

    public TagLabeling(@Value("${fastapi.url}") String fastApiUrl) {
        this.fastApiClient = new FastApiClient(fastApiUrl);
    }

    
//    요청 문장 태깅 메서드
    public String sentenceTagging(String text) {
        Map<String, Object> requestBody = Map.of("text", text);
        Map<String, Object> response = fastApiClient.postRequest("/label", requestBody);
        
        // response에서 "label" 키의 값을 추출하여 String으로 반환
        if (response != null && response.containsKey("label")) {
            Object labelObj = response.get("label");
            if (labelObj instanceof String) {
                return (String) labelObj;
            }
        }
        
        throw new RuntimeException("Label not found in the response");
    }

}