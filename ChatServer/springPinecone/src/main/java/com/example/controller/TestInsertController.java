//package com.example.controller;
//
//
//import com.example.service.PineconeService;
//import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
//import org.springframework.beans.factory.annotation.Value;
//
//import java.nio.charset.StandardCharsets;
//import java.util.Arrays;
//import java.util.List;
//
//
//public class InsertController {
//
//    public void acceptRequest() {
//        PineconeService pineconeService = new PineconeService("pineconeApiKey", "fastApiUrl", "namespace");
//
//
//        // 질문-답변 쌍 테스트 데이터 (여기서 텍스트를 수정하면 됩니다)
//        List<String[]> qaPairs = Arrays.asList(
//                new String[]{"What is the capital of France?", "The capital of France is Paris."},
//                new String[]{"Who wrote Romeo and Juliet?", "Romeo and Juliet was written by William Shakespeare."},
//                new String[]{"What is the largest planet in our solar system?", "The largest planet in our solar system is Jupiter."}
//        );
//
//
////         테스트 질문-답변 쌍 삽입
//        for (String[] pair : qaPairs) {
//            pineconeService.insertQAPair(pair[0], pair[1]);
//        }
//
//        // 유사한 질문 검색
////        String queryQuestion = "What's the main city of France?";
//        String queryQuestion = "우리 아이가 달라졌어요";
//        int topK = 3;
//
//        System.out.println("\n유사한 질문 검색 결과:");
//        QueryResponseWithUnsignedIndices response = pineconeService.querySimilarQuestions(queryQuestion, topK);
////        레코드 수 확인
//        System.out.println(pineconeService.getTotalRecordsInNamespace());
//        System.out.println(response);
//
//        // 검색한 결과 출력
////        for (ScoredVectorWithUnsignedIndices match : response.getMatches()) {
////            System.out.println("Score: " + match.getScore());
////            if (match.getMetadata() != null) {
////                System.out.println("Question: " + match.getMetadata().get("question").getStringValue());
////                System.out.println("Answer: " + match.getMetadata().get("answer").getStringValue());
////            }
////            System.out.println("---");
////        }
//
//
//}
