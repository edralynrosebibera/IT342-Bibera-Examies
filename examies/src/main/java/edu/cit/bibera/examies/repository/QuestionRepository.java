package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<QuestionEntity, Long> {


    List<QuestionEntity> findByExamId(Long examId); // 🔥 IMPORTANT
}