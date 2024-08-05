package com.example.util;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class HuggingfaceEmbedding {
    private final FastApiClient fastApiClient;

    public HuggingfaceEmbedding(String fastApiUrl) {
        this.fastApiClient = new FastApiClient(fastApiUrl);
    }

    
//    fast api로 임베딩할 텍스트 데이터와 함께 post 요청
    public Map<String, Object> getEmbeddingsAndScores(List<String> texts) {
        Map<String, Object> body = Map.of("texts", texts);
        return fastApiClient.postRequest("/embed", body);
    }

    
//    반환 결과에서 임베딩 데이터 추출하고 float 리스트로 변환
    public List<Float> getEmbedding(String text) {
        Map<String, Object> result = getEmbeddingsAndScores(List.of(text));
        Object embeddingsObj = result.get("embeddings");
        if (embeddingsObj instanceof List<?>) {
            List<?> embeddings = (List<?>) embeddingsObj;
            if (!embeddings.isEmpty() && embeddings.get(0) instanceof List<?>) {
                List<?> firstEmbedding = (List<?>) embeddings.get(0);
                return firstEmbedding.stream()
                    .filter(item -> item instanceof Number)
                    .map(item -> ((Number) item).floatValue())
                    .collect(Collectors.toList());
            }
        }
        throw new RuntimeException("Failed to get embedding from FastAPI server");
    }
}