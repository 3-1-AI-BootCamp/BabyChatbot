package com.example.service;

import com.example.util.HuggingfaceEmbedding;
import com.example.util.OpenAIEmbedding;
import com.google.protobuf.Struct;
import com.google.protobuf.Value;
import io.pinecone.clients.Index;
import io.pinecone.clients.Pinecone;
import io.pinecone.proto.DescribeIndexStatsResponse;
import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
import io.pinecone.unsigned_indices_model.ScoredVectorWithUnsignedIndices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class PineconeService {
    private Index index;
    private Index indexOpenai;
    private HuggingfaceEmbedding embedding;
    private OpenAIEmbedding openEmbedding;
    String namespace = "qa-namespace";
    String namespaceOpenai = "question-answer";


    @Autowired
    public PineconeService(
            @org.springframework.beans.factory.annotation.Value("${pinecone.api.key}") String pineconeApiKey,
            @org.springframework.beans.factory.annotation.Value("${fastapi.url}") String fastApiUrl,
            @org.springframework.beans.factory.annotation.Value("${openai.api.key}") String openaiApiKey
    ) {
        Pinecone pc = new Pinecone.Builder(pineconeApiKey).build();
//        this.index = pc.getIndexConnection("vector384");
        this.index = pc.getIndexConnection("tag-vector384");
        this.indexOpenai = pc.getIndexConnection("vector1536");
        this.embedding = new HuggingfaceEmbedding(fastApiUrl);
        this.openEmbedding = new OpenAIEmbedding(openaiApiKey);
    }


//    Pinecone 데이터 삽입 함수
    public void insertQAPair(String question, String answer) {
        List<Float> floatEmbedding = embedding.getEmbedding(question);
        
//        데이터 저장 형식 지정
        Struct metadata = Struct.newBuilder()
                .putFields("question", Value.newBuilder().setStringValue(question).build())
                .putFields("answer", Value.newBuilder().setStringValue(answer).build())
                .build();

//        레코드 ID 설정
        String id = UUID.randomUUID().toString();
        index.upsert(id, floatEmbedding, null, null, metadata, namespace);

        System.out.println("질문-답변 쌍이 Pinecone에 저장되었습니다. ID: " + id);
        System.out.println("임베딩 차원: " + floatEmbedding.size());
    }


//    Pinecone 데이터 조회 함수(질문 텍스트를 임베딩하고 쿼리로 결과 가져옴)
    public List<Map<String, Object>> querySimilarQuestions(String question, int topK, String namespace, float similarity) {
        List<Float> queryVector = embedding.getEmbedding(question);
        QueryResponseWithUnsignedIndices response = index.query(topK, queryVector, null, null, null, namespace, null, true, true);
        List<ScoredVectorWithUnsignedIndices> matches = response.getMatchesList();

        return matches.stream()
            .filter(match -> match.getScore() >= similarity)
            .map(this::extractMetadata)
            .collect(Collectors.toList());
    }


//    Openai 데이터 삽입 함수
    public void insertQAPairOpenai(String question, String answer) {
        List<Double> embeddingList = openEmbedding.getEmbedding(question);
        List<Float> floatEmbedding = embeddingList.stream()
                .map(Double::floatValue)
                .collect(Collectors.toList());

        Struct metadata = Struct.newBuilder()
                .putFields("question", Value.newBuilder().setStringValue(question).build())
                .putFields("answer", Value.newBuilder().setStringValue(answer).build())
                .build();

        String id = UUID.randomUUID().toString();
        indexOpenai.upsert(id, floatEmbedding, null, null, metadata, namespaceOpenai);

        System.out.println("질문-답변 쌍이 Pinecone에 저장되었습니다. ID: " + id);
        System.out.println("임베딩 차원: " + floatEmbedding.size());
    }


//    Openai 데이터 조회 함수(텍스트를 임베딩하고 쿼리로 결과 가져옴)
    public List<Map<String, Object>> querySimilarQuestionsOpenai(String question, int topK, String namespace) {
        List<Float> queryVector = openEmbedding.getEmbedding(question).stream()
                .map(Double::floatValue)
                .collect(Collectors.toList());
        QueryResponseWithUnsignedIndices response = indexOpenai.query(topK, queryVector, null, null, null, namespace, null, true, true);
        List<ScoredVectorWithUnsignedIndices> matches = response.getMatchesList();

        return matches.stream()
                .map(this::extractMetadata)
                .collect(Collectors.toList());
    }


//     특정 네임스페이스의 전체 레코드 수 조회
    public String getTotalRecordsInNamespace(boolean type) {
       if (type) return index.describeIndexStats().toString();
       else return indexOpenai.describeIndexStats().toString();
    }
    
    
//    쿼리로 가져온 데이터에서 메타데이터, 스코어 추출
    private Map<String, Object> extractMetadata(ScoredVectorWithUnsignedIndices match) {
        Map<String, Object> result = new HashMap<>();
        result.put("score", match.getScore());

        Map<String, String> metadata = new HashMap<>();
        for (Map.Entry<String, com.google.protobuf.Value> entry : match.getMetadata().getFieldsMap().entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().getStringValue();
            metadata.put(key, value);
        }
        result.put("metadata", metadata);

        return result;
    }
}