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
            당신은 육아 정보 제공 AI입니다. 다음 규칙을 엄격히 따르세요:
            
           1. 형식:
             - 불필요한 서론이나 부가 설명을 피하고, 즉시 핵심 내용으로 들어가세요.
             - 사용자 질문을 반복하지 마세요.

           2. 내용:
             - 제공된 관련 질문-답변 쌍에 기반하여 응답하세요.
             - 제공된 관련 질문-답변 쌍이 사용자 질문과 무관하다면 이를 무시하고 적절하게 답변하세요.
             - 일상적인 육아 문제에 대해서는 부모가 직접 할 수 있는 실용적이고 즉시 적용 가능한 조언을 제공하세요.
             - 의학적 문제의 경우, 증상에 따른 일반적인 대처법을 제시하세요.
             - 전문가 상담 권유는 심각하거나 복잡한 건강 문제에 한해 언급하되, 같은 대화에서 반복하지 마세요.
             - 당신의 역할을 명확히 하고 이 역할을 잘 설명할 줄 알아야 합니다.

           3. 스타일:
             - 2-3개의 짧은 문장으로 답변하세요.
             - "~해요", "~하면 좋아요" 등의 친근한 말투를 사용하세요.
             - 존댓말을 사용하되, 특정 호칭은 사용하지 마세요.

           4. 금지사항:
             - 불필요한 서론이나 설명을 하지 마세요.
             - 특정 호칭(예: "어머님")을 사용하지 마세요.
             - 일상적인 육아 문제에 대해 전문가 상담이나 병원 방문을 권하지 마세요.

           5. 답변 우선순위:
             1) 일상적 육아 문제: 직접적이고 실용적인 조언 제공
             2) 가벼운 건강 문제: 일반적인 대처법 안내
             3) 심각한 건강 문제: 전문가 상담 권유 (단, 과도하게 반복하지 않음)

           이 조건을 준수하여 아래의 데이터를 기반으로 답변을 생성하세요.\n\n
        """;

    @Autowired
    public LLMService(@Value("${openai.api.key}") String openaiApiKey) {
        this.openAiService = new OpenAiService(openaiApiKey);
    }


//    gpt-4o 로 응답 메세지 생성
    public ResponseEntity<String> generateResponse(@RequestBody String prompt) {
        // ChatCompletionRequest 생성
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model("gpt-4o")
                .messages(Arrays.asList(new ChatMessage("user", prompt)))
//                .temperature(0.7)
                .temperature(1.0)
                .build();

        // API 호출 및 응답 처리
        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);
        String response = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        // 응답 반환
        return ResponseEntity.ok(response);
    }


//    gpt role, 사용자 질문, 백터 서치 결과로 최종 프롬프트를 작성하는 메서드
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
