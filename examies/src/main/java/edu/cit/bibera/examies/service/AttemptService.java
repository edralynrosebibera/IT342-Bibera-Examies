package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.entity.AttemptAnswerEntity;
import edu.cit.bibera.examies.entity.AttemptEntity;
import edu.cit.bibera.examies.entity.QuestionEntity;

import edu.cit.bibera.examies.model.Users;

import edu.cit.bibera.examies.repository.AttemptAnswerRepository;
import edu.cit.bibera.examies.repository.AttemptRepository;
import edu.cit.bibera.examies.repository.QuestionRepository;
import edu.cit.bibera.examies.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepo;
    private final AttemptAnswerRepository answerRepo;
    private final QuestionRepository questionRepo;
    private final UsersRepository usersRepository;

    public AttemptEntity startAttempt(Long examId, String studentId) {

        Users user = usersRepository.findBySupabaseUserId(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long localStudentId = user.getId();

        List<AttemptEntity> existing =
            attemptRepo.findByExamIdAndStudentId(examId, localStudentId);

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
                .studentId(localStudentId)
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

    public AttemptEntity getAttemptById(Long attemptId) {
        return attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
    }

    public List<AttemptEntity> getAttemptsByExamId(Long examId) {
        return attemptRepo.findByExamId(examId);
    }

    public AttemptEntity submitAttempt(Long attemptId) {

        AttemptEntity attempt = attemptRepo.findById(attemptId).orElseThrow();

        List<AttemptAnswerEntity> answers = answerRepo.findByAttemptId(attemptId);

        // 🔥 FETCH ALL QUESTIONS FOR THIS EXAM
        List<QuestionEntity> questions = questionRepo.findByExamId(attempt.getExamId());

        int score = 0;
        int totalPoints = 0;

        // 🔥 VALIDATE EACH ANSWER AND CALCULATE POINTS
        for (QuestionEntity question : questions) {
            totalPoints += question.getPoints();

            // Find student's answer for this question
            AttemptAnswerEntity studentAnswer = answers.stream()
                    .filter(ans -> ans.getQuestionId().equals(question.getId()))
                    .findFirst()
                    .orElse(null);

            if (studentAnswer != null) {
                boolean isCorrect = validateAnswer(studentAnswer, question);

                // Update isCorrect flag for record keeping
                studentAnswer.setIsCorrect(isCorrect);
                answerRepo.save(studentAnswer);

                // 🔥 ADD POINTS ONLY IF CORRECT
                if (isCorrect) {
                    score += question.getPoints();
                }
            }
        }

        attempt.setScore(score);
        attempt.setTotal(totalPoints);
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus("COMPLETED");

        return attemptRepo.save(attempt);
    }

    // 🔥 HELPER METHOD TO VALIDATE ANSWER
    private boolean validateAnswer(AttemptAnswerEntity studentAnswer, QuestionEntity question) {
        String correctAnswer = question.getCorrectAnswer();
        
        if (correctAnswer == null) {
            return false;
        }

        // 🔥 MCQ AND IDENTIFICATION - CASE INSENSITIVE COMPARISON
        if ("mcq".equalsIgnoreCase(question.getQuestionType()) || 
            "identification".equalsIgnoreCase(question.getQuestionType())) {
            String studentResp = studentAnswer.getSelectedOption() != null ? 
                                 studentAnswer.getSelectedOption() : 
                                 studentAnswer.getTextAnswer();
            return studentResp != null && 
                   studentResp.trim().equalsIgnoreCase(correctAnswer.trim());
        }

        // 🔥 ATTACHMENT - TEACHER WILL GRADE MANUALLY
        if ("attachment".equalsIgnoreCase(question.getQuestionType())) {
            return studentAnswer.getUploadFileUrl() != null && 
                   !studentAnswer.getUploadFileUrl().isEmpty();
        }

        return false;
    }
}