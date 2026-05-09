package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.dto.QuestionOptionResponse;
import edu.cit.bibera.examies.dto.QuestionResponse;
import edu.cit.bibera.examies.entity.QuestionEntity;
import edu.cit.bibera.examies.repository.QuestionOptionRepository;
import edu.cit.bibera.examies.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepo;

    @GetMapping("/exam/{examId}")
    public List<QuestionResponse> getQuestionsByExam(@PathVariable Long examId) {

        List<QuestionEntity> questions = questionRepository.findByExamId(examId);
        System.out.println("Questions found: " + questions.size());

        return questions.stream().map(q -> {

            List<QuestionOptionResponse> options = optionRepo.findByQuestionId(q.getId())
                    .stream()
                    .map(opt -> QuestionOptionResponse.builder()
                            .id(opt.getId())
                            .optionText(opt.getOptionText())
                            .isCorrect(opt.getIsCorrect())
                            .build())
                    .toList();

            return QuestionResponse.builder()
                    .id(q.getId())
                    .questionText(q.getQuestionText())
                    .questionType(q.getQuestionType())
                    .points(q.getPoints())
                    .options(options)
                    .build();

        }).toList();
    }

}