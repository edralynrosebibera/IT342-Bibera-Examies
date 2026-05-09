package edu.cit.bibera.examies.features.attempts.repository;

import edu.cit.bibera.examies.features.attempts.entity.AttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptRepository extends JpaRepository<AttemptEntity, Long> {
    List<AttemptEntity> findByExamIdAndStudentId(Long examId, Long studentId);
    List<AttemptEntity> findByExamId(Long examId);
}
