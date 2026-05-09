package edu.cit.bibera.examies.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionOptionResponse {
    private Long id;
    private String optionText;
    private Boolean isCorrect;
}
