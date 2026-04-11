package edu.cit.bibera.examies.entity;

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

    private LocalDateTime startTime;

    private LocalDateTime submittedAt;

    private Integer score;

    private String status; 
    private Integer total;
}