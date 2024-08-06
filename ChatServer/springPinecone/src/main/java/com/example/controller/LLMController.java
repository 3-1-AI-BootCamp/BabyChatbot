package com.example.controller;

import com.example.model.CommunicationRequest;
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
    @PostMapping("/request")
    public ResponseEntity<String> chatTags(@RequestBody CommunicationRequest request) {
        String labelTag = tagLabeling.sentenceTagging(request.getChatSentence());

        // TagNamespaceMapper를 사용하여 태그를 네임스페이스로 변환
        String mappingNamespace = TagNamespaceMapper.getNamespace(labelTag);

        // 변환된 네임스페이스를 사용하여 querySimilarQuestions 호출
        List<Map<String, String>> q_a_list = pineconeService.querySimilarQuestions(request.getChatSentence(), 3, mappingNamespace);

        return gptService.generatePrompt(request.getChatSentence(), q_a_list);
    }


}
