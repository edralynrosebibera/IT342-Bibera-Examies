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

        if (enrollmentRepository.existsByStudentIdAndClassId(
                request.studentId, request.classId)) {
            return ResponseEntity.badRequest().body("Already enrolled");
        }

        ClassesEntity cls = classesRepository.findById(request.classId)
                .orElseThrow();

        if (!cls.getClassPassword().equals(request.classPassword)) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .studentId(request.studentId)
                .classId(request.classId)
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Joined class successfully");
    }
}