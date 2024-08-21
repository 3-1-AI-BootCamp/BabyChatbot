package com.example.util;

import java.util.Map;
import java.util.HashMap;

public class TagNamespaceMapper {

    private static final Map<String, String> TAG_TO_NAMESPACE = new HashMap<>();

    static {
        TAG_TO_NAMESPACE.put("병원", "hospital");
        TAG_TO_NAMESPACE.put("육아 의학 정보", "medical information");
        TAG_TO_NAMESPACE.put("아기 용품", "baby products");
        TAG_TO_NAMESPACE.put("기타", "others");
    }

    public static String getNamespace(String tag) {
        return TAG_TO_NAMESPACE.getOrDefault(tag, "others");
    }
}