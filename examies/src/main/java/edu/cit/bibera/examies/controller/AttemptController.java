package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.entity.*;
import edu.cit.bibera.examies.service.AttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AttemptController {

    private final AttemptService service;

    @PostMapping("/start")
    public AttemptEntity start(
            @RequestParam Long examId,
            @RequestParam Long studentId
    ) {
        return service.startAttempt(examId, studentId);
    }

    // ✅ CORRECT (uses service)
    @PostMapping("/answer")
    public AttemptAnswerEntity answer(@RequestBody AttemptAnswerEntity request) {
        return service.saveAnswer(request);
    }

    @GetMapping("/{attemptId}")
    public List<AttemptAnswerEntity> getAnswers(@PathVariable Long attemptId) {
        return service.getAnswers(attemptId);
    }

    @PutMapping("/submit/{attemptId}")
    public AttemptEntity submit(@PathVariable Long attemptId) {
        return service.submitAttempt(attemptId);
    }
}