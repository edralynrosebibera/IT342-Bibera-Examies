package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.ExamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepository extends JpaRepository<ExamEntity, Long> {

    List<ExamEntity> findByInstructorId(String instructorId);

    List<ExamEntity> findByClassId(Long classId);

    List<ExamEntity> findByClassIdIn(List<Long> classIds);
}