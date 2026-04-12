package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.entity.*;
import edu.cit.bibera.examies.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepo;
    private final AttemptAnswerRepository answerRepo;

    public AttemptEntity startAttempt(Long examId, Long studentId) {

        List<AttemptEntity> existing =
            attemptRepo.findByExamIdAndStudentId(examId, studentId);

        // 🚫 If already completed → return latest attempt
        if (!existing.isEmpty()) {
            AttemptEntity latest = existing.get(existing.size() - 1);

            if ("COMPLETED".equals(latest.getStatus())) {
                return latest;
            }
        }

        // ✅ If not existing → create new
        AttemptEntity attempt = AttemptEntity.builder()
                .examId(examId)
                .studentId(studentId)
                .startTime(LocalDateTime.now())
                .status("ONGOING")
                .build();

        return attemptRepo.save(attempt);
    }

    public AttemptAnswerEntity saveAnswer(AttemptAnswerEntity request) {

        AttemptAnswerEntity ans = AttemptAnswerEntity.builder()
                .attemptId(request.getAttemptId())
                .questionId(request.getQuestionId())
                .textAnswer(request.getTextAnswer())
                .selectedOption(request.getSelectedOption())
                .uploadFileUrl(request.getUploadFileUrl())
                .isCorrect(true)
                .build();

        return answerRepo.save(ans);
    }

    public List<AttemptAnswerEntity> getAnswers(Long attemptId) {
        return answerRepo.findByAttemptId(attemptId);
    }

    public AttemptEntity submitAttempt(Long attemptId) {

        AttemptEntity attempt = attemptRepo.findById(attemptId).orElseThrow();

        List<AttemptAnswerEntity> answers = answerRepo.findByAttemptId(attemptId);

        int score = 0;
        int total = answers.size();

        for (AttemptAnswerEntity ans : answers) {
            if (Boolean.TRUE.equals(ans.getIsCorrect())) {
                score++;
            }
        }

        attempt.setScore(score);
        attempt.setTotal(total);
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus("COMPLETED");

        return attemptRepo.save(attempt);
    }
}