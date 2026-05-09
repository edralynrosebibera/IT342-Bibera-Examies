package edu.cit.bibera.examies.features.attempts.service;

import edu.cit.bibera.examies.features.attempts.entity.AttemptAnswerEntity;
import edu.cit.bibera.examies.features.attempts.entity.AttemptEntity;
import edu.cit.bibera.examies.features.attempts.repository.AttemptAnswerRepository;
import edu.cit.bibera.examies.features.attempts.repository.AttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    public AttemptEntity submitAttempt(AttemptEntity attempt, List<AttemptAnswerEntity> answers) {
        attempt.setAttemptedAt(LocalDateTime.now());
        attempt.setStatus("COMPLETED");
        attempt.setTotal(answers != null ? answers.size() : 0);

        AttemptEntity savedAttempt = attemptRepository.save(attempt);

        if (answers != null) {
            for (AttemptAnswerEntity answer : answers) {
                answer.setAttemptId(savedAttempt.getId());
            }
            attemptAnswerRepository.saveAll(answers);
        }

        return savedAttempt;
    }

    public List<AttemptEntity> getAttemptsByExam(Long examId) {
        return attemptRepository.findByExamId(examId);
    }

    public List<AttemptAnswerEntity> getAnswersByAttempt(Long attemptId) {
        return attemptAnswerRepository.findByAttemptId(attemptId);
    }
}
