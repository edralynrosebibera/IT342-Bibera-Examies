package edu.cit.bibera.examies.dto;

import lombok.*;
import java.util.List;
import edu.cit.bibera.examies.dto.QuestionOptionResponse;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionResponse {

    private Long id;
    private String questionText;
    private String questionType;
    private Integer points;
    private List<QuestionOptionResponse> options;
}