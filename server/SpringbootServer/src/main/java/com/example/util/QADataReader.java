package com.example.util;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.example.model.QAData;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class QADataReader {
    
//    csv 파일 읽는 메서드
    public List<QAData> readAllCsvFiles() throws Exception {
        List<QAData> allData = new ArrayList<>();
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:csv_files/*.csv");

//        utf-8 인코딩
        for (Resource resource : resources) {
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                CsvToBean<QAData> csvToBean = new CsvToBeanBuilder<QAData>(reader)
                    .withType(QAData.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

                List<QAData> fileData = csvToBean.parse();
                allData.addAll(fileData);
            }
        }
        
        return allData;
    }
    
}