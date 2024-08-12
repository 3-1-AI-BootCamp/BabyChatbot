package com.example.controller;

import com.example.model.CommunicationRequest;
import com.example.model.PerformanceData;
import com.example.service.LLMService;
import com.example.service.PineconeService;
import com.example.service.TagLabeling;
import com.example.util.TagNamespaceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/llm")
public class LLMController {
    private final LLMService gptService;
    private final TagLabeling tagLabeling;
    private final PineconeService pineconeService;

//    gptService, tagLabeling 객체 생성
    @Autowired
    public LLMController(LLMService gptService, TagLabeling tagLabeling, PineconeService pineconeService) {
        this.gptService = gptService;
        this.tagLabeling = tagLabeling;
        this.pineconeService = pineconeService;
    }


//    순수 gpt에게 요청
    @PostMapping("/simple")
    public String simpleChatRequest(@RequestBody CommunicationRequest request) {
        ResponseEntity<String> gptResponse = gptService.generateResponse(request.getChatSentence());

        return gptResponse.getBody();
    }


//    태그 구분해서 실행할 서비스 로직 결정
//    @PostMapping("/request")
//    public ResponseEntity<String> chatTags(@RequestBody CommunicationRequest request) {
//        String labelTag = tagLabeling.sentenceTagging(request.getChatSentence());
//
//        // TagNamespaceMapper를 사용하여 태그를 네임스페이스로 변환
//        String mappingNamespace = TagNamespaceMapper.getNamespace(labelTag);
//
//        // 변환된 네임스페이스를 사용하여 querySimilarQuestions 호출
//        List<Map<String, Object>> q_a_list = pineconeService.querySimilarQuestions(request.getChatSentence(), 5, mappingNamespace);
//
//        return gptService.generatePrompt(request.getChatSentence(), q_a_list);
//    }

//    q_a_list, namespace, gpt response 다 반환하기 위한 메서드
    @PostMapping("/request")
    public ResponseEntity<PerformanceData> chatTags(@RequestBody CommunicationRequest request) {
        long startTime = System.currentTimeMillis();

        String userQuestion = request.getChatSentence();
        int topK = request.getTopK();
        float similarity = request.getSimilarity();
        String gptRole = request.getGptRole();
        String labelTag = tagLabeling.sentenceTagging(userQuestion);
        String mappingNamespace = TagNamespaceMapper.getNamespace(labelTag);

        List<Map<String, Object>> qaList = pineconeService.querySimilarQuestions(userQuestion, topK, mappingNamespace, similarity);

        ResponseEntity<String> gptResponseEntity = gptService.generatePrompt(userQuestion, qaList, gptRole);
        String gptResponse = gptResponseEntity.getBody(); // ResponseEntity에서 실제 응답 추출

        long endTime = System.currentTimeMillis();
        long responseTime = endTime - startTime;

        PerformanceData performanceData = new PerformanceData(
            userQuestion,
            mappingNamespace,
            qaList,
            gptResponse,
            responseTime
        );

        return ResponseEntity.ok(performanceData);
    }


}
