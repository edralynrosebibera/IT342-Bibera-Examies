package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.dto.CreateClassRequest;
import edu.cit.bibera.examies.entity.ClassesEntity;
import edu.cit.bibera.examies.entity.EnrollmentEntity;
import edu.cit.bibera.examies.model.Users;
import edu.cit.bibera.examies.repository.ClassesRepository;
import edu.cit.bibera.examies.repository.EnrollmentRepository;
import edu.cit.bibera.examies.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassesService {

    private final ClassesRepository classesRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UsersRepository usersRepository;

    public ClassesEntity createClass(CreateClassRequest request) {
        ClassesEntity newClass = ClassesEntity.builder()
                .instructorId(request.instructorId)
                .className(request.className)
                .classPassword(request.classPassword)
                .createdAt(LocalDateTime.now())
                .build();

        return classesRepository.save(newClass);
    }

    public List<ClassesEntity> getClassesByInstructor(String supabaseUserId) {
        return classesRepository.findByInstructorId(supabaseUserId);
    }

    public List<ClassesEntity> getClassesByStudent(String supabaseUserId) {
        Users user = usersRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long studentId = user.getId();

        List<EnrollmentEntity> enrollments =
                enrollmentRepository.findByStudentId(studentId);

        return enrollments.stream()
                .map(e -> classesRepository.findById(e.getClassId()).orElse(null))
                .toList();
    }

    public ClassesEntity getClassById(Long classId) {
        return classesRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }
}