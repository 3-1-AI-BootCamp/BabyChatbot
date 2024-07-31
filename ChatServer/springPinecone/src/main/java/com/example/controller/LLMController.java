package com.example.controller;

import com.example.model.CommunicationRequest;
import com.example.service.LLMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/llm")
public class LLMController {
    private final LLMService gptService;

    @Autowired
    public LLMController(LLMService gptService) {
        this.gptService = gptService;
    }


    @PostMapping("/request")
    public String chatRequest(@RequestBody CommunicationRequest request) {
        String responseContent = "";
        if ("openai".equals(request.getModelType())) {
            ResponseEntity<String> gptResponse = gptService.generateResponse(request.getChatSentence());
            responseContent = gptResponse.getBody();
        } else {
//            여기에 다른 모델 구현
            responseContent = "you choosed other model";
        }
        

        return responseContent;
    }

}
