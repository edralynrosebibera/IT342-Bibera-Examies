package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.model.ExamClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamClassRepository extends JpaRepository<ExamClass, Integer> {
    List<ExamClass> findByInstructorId(Integer instructorId);
}
