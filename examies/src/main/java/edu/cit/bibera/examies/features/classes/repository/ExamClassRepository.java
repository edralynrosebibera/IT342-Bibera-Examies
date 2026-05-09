package edu.cit.bibera.examies.features.classes.repository;

import edu.cit.bibera.examies.features.classes.entity.ExamClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamClassRepository extends JpaRepository<ExamClass, Integer> {
    List<ExamClass> findByInstructorId(Integer instructorId);
}