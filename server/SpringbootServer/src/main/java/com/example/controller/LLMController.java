package com.example.controller;

import com.example.model.CommunicationRequest;
import com.example.model.PerformanceData;
import com.example.service.LLMService;
import com.example.service.PineconeService;
import com.example.service.SaveChatLogService;
import com.example.service.TagLabeling;
import com.example.util.TagNamespaceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/llm")
public class LLMController {
    private final LLMService gptService;
    private final TagLabeling tagLabeling;
    private final PineconeService pineconeService;
    private final SaveChatLogService saveChatLogService;

//    gptService, tagLabeling 객체 생성
    @Autowired
    public LLMController(LLMService gptService, TagLabeling tagLabeling, PineconeService pineconeService, SaveChatLogService saveChatLogService) {
        this.gptService = gptService;
        this.tagLabeling = tagLabeling;
        this.pineconeService = pineconeService;
        this.saveChatLogService = saveChatLogService;
    }


//    순수 gpt에게 요청
    @PostMapping("/simple")
    public String simpleChatRequest(@RequestBody CommunicationRequest request) {
        ResponseEntity<String> gptResponse = gptService.generateResponse(request.getChatSentence());

        return gptResponse.getBody();
    }


//    태그 구분해서 실행할 서비스 로직 결정
    @PostMapping("/request")
    public ResponseEntity<String> responseControll(@RequestBody CommunicationRequest request) {
//        String labelTag = tagLabeling.sentenceTagging(request.getChatSentence());

        // TagNamespaceMapper를 사용하여 태그를 네임스페이스로 변환
        String mappingNamespace = TagNamespaceMapper.getNamespace("육아 의학 정보");

        // 변환된 네임스페이스를 사용하여 querySimilarQuestions 호출
        List<Map<String, Object>> q_a_list = pineconeService.querySimilarQuestions(request.getChatSentence(), 5, mappingNamespace, 0.7f);

        return gptService.generatePrompt(request.getChatSentence(), q_a_list);
    }


    //    요청 오면 fast api 서버로 비동기 요청 보내고 db에 저장하도록 수정
    @PostMapping("/requestLogSave")
    public Mono<ResponseEntity<String>> requestLogSave(@RequestBody CommunicationRequest request) {
        ResponseEntity<PerformanceData> rsFormat = requestAllDataFormat(request);

        // rsFormat의 body만 saveChatLogDB 메서드에 전달
        return saveChatLogService.saveChatLogDB(rsFormat.getBody());
    }


//    사용자 질문을 받아서 태깅하고 q_a_list, namespace, gpt response 다 반환하기 위한 메서드
    public ResponseEntity<PerformanceData> requestAllDataFormat(@RequestBody CommunicationRequest request) {
        long startTime = System.currentTimeMillis();

        String userQuestion = request.getChatSentence();
//        int topK = request.getTopK();
//        String gptRole = request.getGptRole();
//        float similarity = request.getSimilarity();
//        String labelTag = tagLabeling.sentenceTagging(userQuestion);
        String mappingNamespace = TagNamespaceMapper.getNamespace("육아 의학 정보");

        List<Map<String, Object>> qaList = pineconeService.querySimilarQuestions(userQuestion, 5, mappingNamespace, 0.7f);

        ResponseEntity<String> gptResponseEntity = gptService.generatePrompt(userQuestion, qaList);
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
