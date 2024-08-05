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

    public Map<String, Object> sentenceTagging(String text) {
        Map<String, Object> requestBody = Map.of("text", text);
        return fastApiClient.postRequest("/label", requestBody);
    }
}