package edu.cit.bibera.examies.features.attempts.repository;

import edu.cit.bibera.examies.features.attempts.entity.AttemptAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswerEntity, Long> {
    List<AttemptAnswerEntity> findByAttemptId(Long attemptId);
}
