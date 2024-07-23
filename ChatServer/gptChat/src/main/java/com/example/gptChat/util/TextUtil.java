package com.example.gptChat.util;

import java.util.*;

public class TextUtil {

    public static double cosineSimilarity(String text1, String text2) {
        Map<String, Integer> freqMap1 = getWordFrequency(text1);
        Map<String, Integer> freqMap2 = getWordFrequency(text2);

        Set<String> words = new HashSet<>(freqMap1.keySet());
        words.addAll(freqMap2.keySet());

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (String word : words) {
            int freq1 = freqMap1.getOrDefault(word, 0);
            int freq2 = freqMap2.getOrDefault(word, 0);
            dotProduct += freq1 * freq2;
            norm1 += freq1 * freq1;
            norm2 += freq2 * freq2;
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            System.out.println("One of the norms is zero. Returning similarity as 0.0");
            return 0.0;
        }

        double similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
        System.out.println("Cosine similarity: " + similarity);
        return similarity;
    }

    private static Map<String, Integer> getWordFrequency(String text) {
        Map<String, Integer> freqMap = new HashMap<>();
        String[] words = text.toLowerCase().replaceAll("[^a-zA-Z0-9가-힣\\s]", "").split("\\s+");
        System.out.println("Words in text: " + Arrays.toString(words));
        for (String word : words) {
            if (!word.isEmpty()) {
                freqMap.put(word, freqMap.getOrDefault(word, 0) + 1);
            }
        }
        return freqMap;
    }
}
