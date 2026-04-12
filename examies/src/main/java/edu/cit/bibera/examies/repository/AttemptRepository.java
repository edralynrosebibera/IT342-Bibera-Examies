package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.AttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;  
import java.util.Optional;

public interface AttemptRepository extends JpaRepository<AttemptEntity, Long> {
    List<AttemptEntity> findByExamIdAndStudentId(Long examId, Long studentId);
}