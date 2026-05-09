package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.dto.ClassEnrollmentDto;
import edu.cit.bibera.examies.dto.JoinClassRequest;
import edu.cit.bibera.examies.entity.ClassesEntity;
import edu.cit.bibera.examies.entity.EnrollmentEntity;
import edu.cit.bibera.examies.model.Users;
import edu.cit.bibera.examies.repository.ClassesRepository;
import edu.cit.bibera.examies.repository.EnrollmentRepository;
import edu.cit.bibera.examies.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final ClassesRepository classesRepository;
    private final UsersRepository usersRepository;

    public ResponseEntity<?> joinClass(JoinClassRequest request) {

        // 🔥 Find user
        Users user = usersRepository.findBySupabaseUserId(request.studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long studentId = user.getId();

        // 🔥 Find class using password ONLY
        ClassesEntity cls = classesRepository
                .findByClassPassword(request.classPassword);

        if (cls == null) {
            return ResponseEntity.badRequest().body("Class not found");
        }

        // 🔥 Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndClassId(
                studentId, cls.getId())) {
            return ResponseEntity.badRequest().body("Already enrolled");
        }

        // 🔥 Save enrollment
        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .studentId(studentId)
                .classId(cls.getId())
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Joined class successfully");
    }

    public List<ClassEnrollmentDto> getEnrollmentsByClassId(Long classId) {
        return enrollmentRepository.findByClassId(classId).stream()
                .map(enrollment -> {
                    Users student = usersRepository.findById(enrollment.getStudentId())
                            .orElseThrow(() -> new RuntimeException("Student not found"));
                    return ClassEnrollmentDto.builder()
                            .id(enrollment.getId())
                            .studentId(student.getId())
                            .studentName(student.getFirstName() + " " + student.getLastName())
                            .studentEmail(student.getEmail())
                            .build();
                })
                .collect(Collectors.toList());
    }
}