package com.example.entity;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name = "qalist_data")
public class QAListData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "chat_log_id")
    private ChatLog chatLog;

    @Column(name = "score")
    private Float score;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;
}