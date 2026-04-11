package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.AttemptAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswerEntity, Long> {
    List<AttemptAnswerEntity> findByAttemptId(Long attemptId);
}