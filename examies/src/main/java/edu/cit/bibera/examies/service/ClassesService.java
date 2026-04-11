package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.dto.CreateClassRequest;
import edu.cit.bibera.examies.entity.ClassesEntity;
import edu.cit.bibera.examies.repository.ClassesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassesService {

    private final ClassesRepository classesRepository;

    public ClassesEntity createClass(CreateClassRequest request) {

        ClassesEntity newClass = ClassesEntity.builder()
                .instructorId(request.instructorId)
                .className(request.className)
                .classPassword(request.classPassword)
                .createdAt(LocalDateTime.now())
                .build();

        return classesRepository.save(newClass);
    }

    public List<ClassesEntity> getClassesByInstructor(Long instructorId) {
        return classesRepository.findByInstructorId(instructorId);
    }
}