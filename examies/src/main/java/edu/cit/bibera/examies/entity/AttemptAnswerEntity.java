package edu.cit.bibera.examies.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attempts_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptAnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long attemptId;

    private Long questionId;

    private String textAnswer;

    private String selectedOption;

    private String uploadFileUrl;

    private Boolean isCorrect;
}