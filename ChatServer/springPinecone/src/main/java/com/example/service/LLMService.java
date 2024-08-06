package com.example.service;


import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Service
public class LLMService {
    private final OpenAiService openAiService;

    @Autowired
    public LLMService(@Value("${openai.api.key}") String openaiApiKey) {
        this.openAiService = new OpenAiService(openaiApiKey);
    }


//    gpt-3.5-turbo 로 메세지 생성
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


//    prompt 생성
    public ResponseEntity<String> generatePrompt(String userQuestion, List<Map<String, String>> q_a_list) {
        StringBuilder context = new StringBuilder();

        for (int i = 0; i < q_a_list.size(); i++) {
            Map<String, String> qa = q_a_list.get(i);
            String question = qa.get("question");
            String answer = qa.get("answer");

            if (question != null && answer != null) {
                context.append("관련 질문 ").append(i + 1).append(": ").append(question).append("\n");
                context.append("관련 답변 ").append(i + 1).append(": ").append(answer).append("\n\n");
            }
        }

        String prompt = String.format(
            "다음은 사용자의 질문과 관련된 이전 질문-답변 쌍입니다:\n\n%s\n사용자 질문: %s\n\n" +
            "위의 관련 정보를 참고하여 사용자의 질문에 대해 정확하고 상세한 답변을 제공해주세요. " +
            "필요한 경우 이전 답변들의 정보를 활용하되, 현재 질문에 가장 적절한 새로운 답변을 생성해 주세요.",
            context.toString(), userQuestion
        );

        return generateResponse(prompt);
    }

}
