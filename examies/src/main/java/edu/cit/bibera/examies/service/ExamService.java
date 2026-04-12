package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.entity.AttemptEntity;
import edu.cit.bibera.examies.entity.ExamEntity;
import edu.cit.bibera.examies.entity.QuestionEntity;
import edu.cit.bibera.examies.entity.QuestionOptionEntity;
import edu.cit.bibera.examies.repository.ExamRepository;
import edu.cit.bibera.examies.repository.QuestionOptionRepository;
import edu.cit.bibera.examies.repository.AttemptRepository;
import edu.cit.bibera.examies.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepo;
    private final QuestionOptionRepository optionRepo;

    private final AttemptRepository attemptRepository;

    // ✅ SIMPLE EXAM CREATE (not used for full exam)
    public ExamEntity createExam(ExamEntity exam) {
        exam.setCreatedAt(LocalDateTime.now());
        exam.setStarted(false);
        exam.setClosed(false);
        return examRepository.save(exam);
    }

    public List<ExamEntity> getTeacherExams(Long instructorId) {
        return examRepository.findByInstructorId(instructorId);
    }

    public List<ExamEntity> getClassExams(Long classId) {
        return examRepository.findByClassId(classId);
    }

    public ExamEntity startExam(Long id) {
        ExamEntity exam = examRepository.findById(id).orElseThrow();
        exam.setStarted(true);
        return examRepository.save(exam);
    }

    public ExamEntity closeExam(Long id) {
        ExamEntity exam = examRepository.findById(id).orElseThrow();
        exam.setClosed(true);
        return examRepository.save(exam);
    }

    public ExamEntity createFullExam(ExamEntity exam) {

        exam.setCreatedAt(LocalDateTime.now());
        exam.setStarted(false);
        exam.setClosed(false);

        if (exam.getQuestions() != null) {
            for (QuestionEntity q : exam.getQuestions()) {
                q.setExam(exam);

                if (q.getOptions() != null) {
                    for (QuestionOptionEntity opt : q.getOptions()) {
                        opt.setQuestion(q);
                    }
                }
            }
        }

        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
    examRepository.deleteById(id);
}

    public ExamEntity updateExam(Long id, ExamEntity updatedExam) {
        ExamEntity existing = examRepository.findById(id).orElseThrow();

        existing.setTitle(updatedExam.getTitle());
        existing.setDescription(updatedExam.getDescription());
        existing.setTimeLimit(updatedExam.getTimeLimit());
        existing.setDueDate(updatedExam.getDueDate());
        existing.setClassId(updatedExam.getClassId());

        // 🔥 REPLACE QUESTIONS
        existing.getQuestions().clear();

        if (updatedExam.getQuestions() != null) {
            for (QuestionEntity q : updatedExam.getQuestions()) {
                q.setExam(existing);

                if (q.getOptions() != null) {
                    for (QuestionOptionEntity opt : q.getOptions()) {
                        opt.setQuestion(q);
                    }
                }
            }
            existing.getQuestions().addAll(updatedExam.getQuestions());
        }

        return examRepository.save(existing);
    }

    public ExamEntity getExamById(Long id) {
    return examRepository.findById(id).orElseThrow();
}

public List<Map<String, Object>> getStudentExams(Long studentId) {

    List<ExamEntity> exams = examRepository.findAll();
    List<Map<String, Object>> result = new ArrayList<>();

    for (ExamEntity exam : exams) {

        Map<String, Object> map = new HashMap<>();

        map.put("id", exam.getId());
        map.put("title", exam.getTitle());
        map.put("started", exam.isStarted());
        map.put("closed", exam.isClosed());

        List<AttemptEntity> attempts =
            attemptRepository.findByExamIdAndStudentId(
                exam.getId(), studentId
            );

        if (!attempts.isEmpty()) {
            AttemptEntity latest = attempts.get(attempts.size() - 1);

            if ("COMPLETED".equals(latest.getStatus())) {
                map.put("score", latest.getScore());
                map.put("total", latest.getTotal());
            }
        }

        result.add(map);
    }

    return result;
}
}