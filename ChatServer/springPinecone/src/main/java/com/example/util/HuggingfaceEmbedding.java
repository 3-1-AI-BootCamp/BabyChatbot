package com.example.util;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class HuggingfaceEmbedding {
    private final RestTemplate restTemplate;
    private final String fastApiUrl;

    public HuggingfaceEmbedding(String fastApiUrl) {
        this.restTemplate = new RestTemplate();
        this.fastApiUrl = fastApiUrl;
    }


    public Map<String, Object> getEmbeddingsAndScores(List<String> texts) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of("texts", texts);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                fastApiUrl + "/embed",
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null && responseBody.containsKey("embeddings") && responseBody.containsKey("scores")) {
                    return responseBody;
                } else {
                    throw new RuntimeException("Unexpected response format from FastAPI server");
                }
            } else {
                throw new RuntimeException("FastAPI server returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get embeddings: " + e.getMessage(), e);
        }
    }


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




//    public List<List<Float>> getScores(List<String> texts) {
//        Map<String, Object> result = getEmbeddingsAndScores(texts);
//        return (List<List<Float>>) result.get("scores");
//    }
//
//
//
//    public List<List<Float>> getScores(List<String> texts) {
//        Map<String, Object> result = getEmbeddingsAndScores(texts);
//        Object scoresObj = result.get("scores");
//        if (scoresObj instanceof List<?>) {
//            List<?> scores = (List<?>) scoresObj;
//            return scores.stream()
//                .filter(item -> item instanceof List<?>)
//                .map(item -> ((List<?>) item).stream()
//                    .filter(num -> num instanceof Number)
//                    .map(num -> ((Number) num).floatValue())
//                    .collect(Collectors.toList()))
//                .collect(Collectors.toList());
//        }
//        throw new RuntimeException("Failed to get scores from FastAPI server");
//    }


}