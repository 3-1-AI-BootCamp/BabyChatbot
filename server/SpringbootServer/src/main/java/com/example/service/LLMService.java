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
    private String gptRoles = """
        당신은 육아 관련 질문에 대한 부모들의 실제 답변을 정리하고 전달하는 역할을 맡고 있습니다.
        주어진 질문과 관련된 실제 부모들의 답변을 바탕으로 적절하고 일관된 답변을 제공해야 합니다. 아래 지침을 따라주세요:
        
        1. 답변 적절성 평가:
           • 제공된 답변들이 질문과 관련이 있는지 확인하세요.
           • 부적절하거나 관련 없는 답변은 제외하세요.
        
        2. 맥락 파악:
           • 질문과 답변들을 분석하여 전체적인 맥락을 이해하세요.
           • 부모들의 주요 관심사와 우려 사항을 파악하세요.
        
        3. 답변 유사성 평가:
           • 여러 답변 사이의 공통점과 차이점을 식별하세요.
           • 가장 많이 언급되는 제품이나 조언에 주목하세요.
        
        4. 실제 답변 기반 응답:
           • 제공된 답변들의 핵심 내용을 그대로 유지하세요.
           • 새로운 정보를 추가하거나 독자적인 답변을 생성하지 마세요.
        
        5. 일관된 말투로 수정:
           • 친근하고 실제 부모들이 답변하는 것 같은 말투로 수정하세요.
           • "~하면 좋을 것 같아요.", "~해요" 등의 말투를 사용하세요.
        
        6. 오타 및 부적절한 표현 수정:
           • 오타나 문법적 오류를 수정하세요.
           • "정제된 답변:" 등의 불필요한 표현을 제거하세요.
        
        주어진 질문과 관련 답변들을 바탕으로, 실제 부모들의 답변 내용을 최대한 유지하면서 말투만 일관되게 수정하여 답변을 제공해주세요.
        새로운 정보를 추가하거나 독자적인 답변을 생성하지 말고, 주어진 답변들의 내용을 바탕으로만 응답해주세요.
        """;

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
                .temperature(0.7)
                .build();

        // API 호출 및 응답 처리
        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);
        String response = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        // 응답 반환
        return ResponseEntity.ok(response);
    }


//    prompt 생성
//    public ResponseEntity<String> generatePrompt(String userQuestion, List<Map<String, String>> q_a_list) {
//        StringBuilder context = new StringBuilder();
//
//        for (int i = 0; i < q_a_list.size(); i++) {
//            Map<String, String> qa = q_a_list.get(i);
//            String question = qa.get("question");
//            String answer = qa.get("answer");
//
//            if (question != null && answer != null) {
//                context.append("관련 질문 ").append(i + 1).append(": ").append(question).append("\n");
//                context.append("관련 답변 ").append(i + 1).append(": ").append(answer).append("\n\n");
//            }
//        }
//
//        String prompt = String.format(
//            "다음은 사용자의 질문과 관련된 이전 질문-답변 쌍입니다:\n\n%s\n사용자 질문: %s\n\n" +
//            "위의 관련 정보를 참고하여 사용자의 질문에 대해 정확하고 상세한 답변을 제공해주세요. " +
//            "필요한 경우 이전 답변들의 정보를 활용하되, 현재 질문에 가장 적절한 새로운 답변을 생성해 주세요.",
//            context.toString(), userQuestion
//        );
//
//        return generateResponse(prompt);
//    }





    public ResponseEntity<String> generatePrompt(String userQuestion, List<Map<String, Object>> q_a_list) {
        StringBuilder promptBuilder = new StringBuilder();

        // 시스템 역할 추가
        promptBuilder.append(gptRoles).append("\n\n");

        // 사용자 질문 추가
        promptBuilder.append("사용자 질문: ").append(userQuestion).append("\n\n");

        // 관련 질문-답변 쌍 추가 (있는 경우)
        if (q_a_list != null && !q_a_list.isEmpty()) {
            promptBuilder.append("관련 질문-답변 쌍:\n");
            for (int i = 0; i < q_a_list.size(); i++) {
                Map<String, Object> qa = q_a_list.get(i);
                Object metadataObj = qa.get("metadata");

                if (metadataObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, String> metadata = (Map<String, String>) metadataObj;

                    String question = metadata.get("question");
                    String answer = metadata.get("answer");

                    if (question != null && answer != null) {
                        promptBuilder.append("관련 질문 ").append(i + 1).append(": ").append(question).append("\n");
                        promptBuilder.append("관련 답변 ").append(i + 1).append(": ").append(answer).append("\n\n");
                    }
                }
            }
        }

        return generateResponse(promptBuilder.toString());
    }
}
