package com.example.util;

import com.theokanning.openai.embedding.EmbeddingRequest;
import com.theokanning.openai.embedding.EmbeddingResult;
import com.theokanning.openai.service.OpenAiService;

import java.util.Collections;
import java.util.List;

public class OpenAIEmbedding {
    private final OpenAiService service;
    private static final String MODEL = "text-embedding-ada-002";

    public OpenAIEmbedding(String apiKey) {
        this.service = new OpenAiService(apiKey);
    }

//    텍스트 임베딩 메서드
    public List<Double> getEmbedding(String text) {
        EmbeddingRequest request = EmbeddingRequest.builder()
                .model(MODEL)
                .input(Collections.singletonList(text))
                .build();

        EmbeddingResult result = service.createEmbeddings(request);
        return result.getData().get(0).getEmbedding();
    }


}