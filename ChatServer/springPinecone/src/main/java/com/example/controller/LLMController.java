package com.example.controller;

import com.example.model.CommunicationRequest;
import com.example.service.LLMService;
import com.example.service.TagLabeling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/llm")
public class LLMController {
    private final LLMService gptService;
    private final TagLabeling tagLabeling;

//    gptService, tagLabeling 객체 생성
    @Autowired
    public LLMController(LLMService gptService, TagLabeling tagLabeling) {
        this.gptService = gptService;
        this.tagLabeling = tagLabeling;
    }


//    순수 gpt에게 요청
    @PostMapping("/simple")
    public String simpleChatRequest(@RequestBody CommunicationRequest request) {
        ResponseEntity<String> gptResponse = gptService.generateResponse(request.getChatSentence());

        return gptResponse.getBody();
    }


//    태그 구분해서 실행할 서비스 로직 결정
    @PostMapping("/request")
    public Map<String, Object> chatTags(@RequestBody CommunicationRequest request) {
        Map<String, Object> temp = tagLabeling.sentenceTagging(request.getChatSentence());

        // 여기서 labeledData를 사용하여 추가 처리를 수행할 수 있습니다.
        // 예: 서비스에 전달하거나, 응답을 생성하는 등
        return temp;
    }


}
