package com.example.service;

import com.example.model.PerformanceData;
import org.springframework.http.ResponseEntity;
import com.example.util.FastApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpStatus;
import java.util.Map;

@Service
public class SaveChatLogService {
    private final FastApiClient fastApiClient;

    public SaveChatLogService(@Value("${fastapi.url}") String fastApiUrl) {
        this.fastApiClient = new FastApiClient(fastApiUrl);
    }

//    사용자 채팅으로 인해 조회되거나 생성된 데이터 로그를 저장하도록 fast api에 요청
    public Mono<ResponseEntity<String>> saveChatLogDB(PerformanceData rsFormat) {
        return fastApiClient.postPerformanceDataAsync("/save_chat_log", rsFormat)
                .map(response -> ResponseEntity.ok("채팅 로그가 성공적으로 저장되었습니다. 응답: " + response))
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError()
                        .body("채팅 로그 저장 중 오류 발생: " + e.getMessage())));
    }

}