package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.dto.JoinClassRequest;
import edu.cit.bibera.examies.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}