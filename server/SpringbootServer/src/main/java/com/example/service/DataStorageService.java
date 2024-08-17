package com.example.service;


import com.example.model.PerformanceData;
import com.example.entity.ChatLog;
import com.example.entity.QAListData;
import com.example.repository.ChatLogRepository;
import com.example.repository.QAListDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;


@Service
public class DataStorageService {

    private final ChatLogRepository chatLogRepository;
    private final QAListDataRepository qaListDataRepository;


    @Autowired
    public DataStorageService(ChatLogRepository chatLogRepository, QAListDataRepository qaListDataRepository) {
        this.chatLogRepository = chatLogRepository;
        this.qaListDataRepository = qaListDataRepository;
    }


    @Transactional
    public void storeData(PerformanceData performanceData) {
        // ChatLog 저장
        ChatLog chatLog = new ChatLog();
        chatLog.setUserQuestion(performanceData.getUserQuestion());
        chatLog.setGptResponse(performanceData.getGptResponse());
        chatLog.setResponseTime(Math.toIntExact(performanceData.getResponseTime())); // long to int 변환
        chatLog.setNameSpace(performanceData.getMappingNamespace());

        Map<String, Object> firstQA = performanceData.getQaList().get(0);
        @SuppressWarnings("unchecked")
        Map<String, Object> metadata = (Map<String, Object>) firstQA.get("metadata");
//        Map<String, Object> metadata = (Map<String, Object>) firstQA.get("metadata");
        chatLog.setTag((String) metadata.get("tag"));

        chatLog.setTimeLogs(LocalDateTime.now());

        ChatLog savedChatLog = chatLogRepository.save(chatLog);

        // QAListData 저장
        for (Map<String, Object> qaItem : performanceData.getQaList()) {
            QAListData qaListData = new QAListData();
            qaListData.setChatLog(savedChatLog);
            qaListData.setScore(((Number) qaItem.get("score")).floatValue()); // double to float 변환

            @SuppressWarnings("unchecked")
            Map<String, Object> qaMetadata = (Map<String, Object>) qaItem.get("metadata");
//            Map<String, Object> qaMetadata = (Map<String, Object>) qaItem.get("metadata");
            qaListData.setAnswer((String) qaMetadata.get("answer"));
            qaListData.setQuestion((String) qaMetadata.get("question"));

            qaListDataRepository.save(qaListData);
        }
    }


}