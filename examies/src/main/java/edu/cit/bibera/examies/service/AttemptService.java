package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.entity.*;
import edu.cit.bibera.examies.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepo;
    private final AttemptAnswerRepository answerRepo;

    public AttemptEntity startAttempt(Long examId, Long studentId) {

        return attemptRepo.findByExamIdAndStudentId(examId, studentId)
                .orElseGet(() -> {
                    AttemptEntity attempt = AttemptEntity.builder()
                            .examId(examId)
                            .studentId(studentId)
                            .startTime(LocalDateTime.now())
                            .status("ONGOING")
                            .build();

                    return attemptRepo.save(attempt);
                });
    }

    public AttemptAnswerEntity saveAnswer(AttemptAnswerEntity request) {

        AttemptAnswerEntity ans = AttemptAnswerEntity.builder()
                .attemptId(request.getAttemptId())
                .questionId(request.getQuestionId())
                .textAnswer(request.getTextAnswer())
                .selectedOption(request.getSelectedOption())
                .uploadFileUrl(request.getUploadFileUrl())
                .isCorrect(false)
                .build();

        return answerRepo.save(ans);
    }

    public List<AttemptAnswerEntity> getAnswers(Long attemptId) {
        return answerRepo.findByAttemptId(attemptId);
    }

    public AttemptEntity submitAttempt(Long attemptId) {

        AttemptEntity attempt = attemptRepo.findById(attemptId).orElseThrow();

        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus("COMPLETED");

        return attemptRepo.save(attempt);
    }
}
