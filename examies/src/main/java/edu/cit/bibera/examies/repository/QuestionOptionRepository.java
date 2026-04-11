package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.QuestionOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionOptionRepository extends JpaRepository<QuestionOptionEntity, Long> {

    List<QuestionOptionEntity> findByQuestionId(Long questionId);

}