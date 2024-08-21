package com.example.model;


import com.opencsv.bean.CsvBindByName;

public class QAData {
    @CsvBindByName
    private String question;

    @CsvBindByName
    private String answer;

    // Getters and setters
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}