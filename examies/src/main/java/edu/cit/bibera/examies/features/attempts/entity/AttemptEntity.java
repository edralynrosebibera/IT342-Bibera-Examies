package edu.cit.bibera.examies.features.attempts.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long examId;

    private Double score;
    private Integer total;
    private String status;

    private LocalDateTime attemptedAt;
}