package com.example.gptChat;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@SpringBootApplication
public class GptChatApplication {

    private final OpenAiService openAiService;

    public GptChatApplication() {
        // OpenAI 서비스 초기화
        this.openAiService = new OpenAiService("your api key");
    }

    public static void main(String[] args) {
        SpringApplication.run(GptChatApplication.class, args);
        System.out.println("Hello World!");
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateResponse(@RequestBody String prompt) {
        // ChatCompletionRequest 생성
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(new ChatMessage("user", prompt)))
                .maxTokens(100)
                .temperature(0.7)
                .build();

        // API 호출 및 응답 처리
        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);
        String response = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        // 응답 반환
        return ResponseEntity.ok(response);
    }
}
