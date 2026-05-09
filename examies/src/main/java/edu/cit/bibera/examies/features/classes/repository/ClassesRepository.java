package edu.cit.bibera.examies.features.classes.repository;

import edu.cit.bibera.examies.features.classes.entity.ClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassesRepository extends JpaRepository<ClassesEntity, Long> {

    List<ClassesEntity> findByInstructorId(String instructorId);
    ClassesEntity findByClassPassword(String classPassword);
}