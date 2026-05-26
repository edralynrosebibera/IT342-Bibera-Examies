package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.dto.ClassEnrollmentDto;
import edu.cit.bibera.examies.dto.JoinClassRequest;
import edu.cit.bibera.examies.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestBody JoinClassRequest request) {
        return enrollmentService.joinClass(request);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<ClassEnrollmentDto>> getClassEnrollments(@PathVariable Long classId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByClassId(classId));
    }
}