package edu.cit.bibera.examies.features.exams.repository;

import edu.cit.bibera.examies.features.exams.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<QuestionEntity, Long> {


    List<QuestionEntity> findByExamId(Long examId); // 🔥 IMPORTANT
}