package com.example.gptChat.util;

import org.springframework.stereotype.Component;
import ai.djl.huggingface.tokenizer.HuggingFaceTokenizer;
import ai.djl.inference.Predictor;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.training.util.ProgressBar;
import ai.djl.translate.Translator;

import java.util.List;

@Component
public class VectorUtil {

    private final Predictor<String, float[]> predictor;

    public VectorUtil() throws Exception {
        Criteria<String, float[]> criteria = Criteria.builder()
                .optEngine("PyTorch")
                .setTypes(String.class, float[].class)
                .optModelUrls("djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
                .optTranslator(new SentenceTranslator())
                .optProgress(new ProgressBar())
                .build();

        ZooModel<String, float[]> model = criteria.loadModel();
        this.predictor = model.newPredictor();
    }

    public List<Double> encode(String text) {
        try {
            float[] embedding = predictor.predict(text);
            return Arrays.stream(embedding).boxed().collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("텍스트 인코딩 중 오류 발생", e);
        }
    }
}