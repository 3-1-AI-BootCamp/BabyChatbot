package com.example.util;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;



public class FastApiClient {
    private final RestTemplate restTemplate;
    private final String fastApiUrl;

    public FastApiClient(String fastApiUrl) {
        this.restTemplate = new RestTemplate();
        this.fastApiUrl = fastApiUrl;
    }

    
//    요청할 데이터 형식 지정해서 post 요청
    public Map<String, Object> postRequest(String endpoint, Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            fastApiUrl + endpoint,
            HttpMethod.POST,
            request,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            throw new RuntimeException("FastAPI server returned error: " + response.getStatusCode());
        }
    }
}