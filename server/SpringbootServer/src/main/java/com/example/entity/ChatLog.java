package com.example.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name = "chat_logs")
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "userQuestion", columnDefinition = "TEXT")
    private String userQuestion;

    @Column(name = "gptResponse", columnDefinition = "TEXT")
    private String gptResponse;

    @Column(name = "responseTime")
    private Integer responseTime;

    @Column(name = "nameSpace")
    private String nameSpace;

    @Column(name = "tag")
    private String tag;

    @Column(name = "timeLogs", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timeLogs;
}