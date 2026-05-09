package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.EnrollmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Long> {

    List<EnrollmentEntity> findByStudentId(Long studentId);

    List<EnrollmentEntity> findByClassId(Long classId);

    boolean existsByStudentIdAndClassId(Long studentId, Long classId);
}
