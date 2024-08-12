package com.example;

//import com.google.protobuf.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class InitializeClientApplication {


    public static void main(String[] args) {

        String openaiApiKey = "api key";
        String indexName = "vector384";
        String namespace = "qa-namespace";
        String fastApiUrl = "http://localhost:8000";

        SpringApplication.run(InitializeClientApplication.class, args);
    }



}

