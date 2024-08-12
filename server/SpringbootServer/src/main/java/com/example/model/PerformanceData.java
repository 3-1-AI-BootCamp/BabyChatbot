package com.example.model;

import java.util.List;
import java.util.Map;
import lombok.*;


@Getter
@Setter
public class PerformanceData {
    private String userQuestion;
    private String mappingNamespace;
    private List<Map<String, Object>> qaList;
    private String gptResponse;
    private long responseTime;

    public PerformanceData(String userQuestion, String mappingNamespace,
                           List<Map<String, Object>> qaList, String gptResponse,
                           long responseTime) {
        this.userQuestion = userQuestion;
        this.mappingNamespace = mappingNamespace;
        this.qaList = qaList;
        this.gptResponse = gptResponse;
        this.responseTime = responseTime;
    }

}