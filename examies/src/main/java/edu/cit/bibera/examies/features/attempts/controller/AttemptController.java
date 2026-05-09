package edu.cit.bibera.examies.features.attempts.controller;

import edu.cit.bibera.examies.features.attempts.entity.AttemptAnswerEntity;
import edu.cit.bibera.examies.features.attempts.entity.AttemptEntity;
import edu.cit.bibera.examies.features.attempts.service.AttemptService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AttemptController {

    private final AttemptService attemptService;

    @PostMapping
    public AttemptEntity submitAttempt(@RequestBody SubmitAttemptRequest request) {
        List<AttemptAnswerEntity> answers = request.getAnswers() != null
                ? request.getAnswers()
                : Collections.emptyList();
        return attemptService.submitAttempt(request.getAttempt(), answers);
    }

    @GetMapping("/exam/{examId}")
    public List<AttemptEntity> getAttemptsByExam(@PathVariable Long examId) {
        return attemptService.getAttemptsByExam(examId);
    }

    @GetMapping("/{attemptId}/answers")
    public List<AttemptAnswerEntity> getAnswersByAttempt(@PathVariable Long attemptId) {
        return attemptService.getAnswersByAttempt(attemptId);
    }

    @Data
    public static class SubmitAttemptRequest {
        private AttemptEntity attempt;
        private List<AttemptAnswerEntity> answers;
    }
}
