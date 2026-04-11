package edu.cit.bibera.examies.repository;

import edu.cit.bibera.examies.entity.ClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassesRepository extends JpaRepository<ClassesEntity, Long> {

    List<ClassesEntity> findByInstructorId(Long instructorId);
    ClassesEntity findByClassPassword(String classPassword);
}