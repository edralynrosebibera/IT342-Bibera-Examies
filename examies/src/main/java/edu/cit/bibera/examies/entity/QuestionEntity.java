package edu.cit.bibera.examies.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    private String questionType;

    private String correctAnswer;

    private Integer points;

    // 🔥 FIX RELATION TO EXAM
    @ManyToOne
    @JoinColumn(name = "exam_id")
    @JsonIgnore
    private ExamEntity exam;

    // 🔥 OPTIONS RELATION
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id")
    private List<QuestionOptionEntity> options;
}