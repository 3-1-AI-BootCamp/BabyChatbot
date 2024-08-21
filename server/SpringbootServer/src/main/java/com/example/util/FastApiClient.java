package com.example.util;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Mono;
import com.example.model.PerformanceData;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;



public class FastApiClient {
    private final RestTemplate restTemplate;
    private final String fastApiUrl;
    private final WebClient webClient;

    public FastApiClient(String fastApiUrl) {
        this.restTemplate = new RestTemplate();
        this.fastApiUrl = fastApiUrl;
        this.webClient = WebClient.create(fastApiUrl);
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


    // PerformanceData를 위한 새로운 비동기 메서드
    public Mono<Map<String, Object>> postPerformanceDataAsync(String endpoint, PerformanceData performanceData) {
        return webClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(performanceData)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                        clientResponse -> Mono.error(new RuntimeException("FastAPI server returned error: " + clientResponse.statusCode())))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

}