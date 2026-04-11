package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.dto.JoinClassRequest;
import edu.cit.bibera.examies.entity.ClassesEntity;
import edu.cit.bibera.examies.entity.EnrollmentEntity;
import edu.cit.bibera.examies.repository.ClassesRepository;
import edu.cit.bibera.examies.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final ClassesRepository classesRepository;

    public ResponseEntity<?> joinClass(JoinClassRequest request) {

        // 🔥 Find class using password ONLY
        ClassesEntity cls = classesRepository
                .findByClassPassword(request.classPassword);

        if (cls == null) {
            return ResponseEntity.badRequest().body("Class not found");
        }

        // 🔥 Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndClassId(
                request.studentId, cls.getId())) {
            return ResponseEntity.badRequest().body("Already enrolled");
        }

        // 🔥 Save enrollment
        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .studentId(request.studentId)
                .classId(cls.getId())
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Joined class successfully");
    }
}