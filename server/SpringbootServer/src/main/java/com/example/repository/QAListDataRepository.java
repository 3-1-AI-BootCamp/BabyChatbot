package com.example.repository;

import com.example.entity.QAListData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QAListDataRepository extends JpaRepository<QAListData, Long> {
}
