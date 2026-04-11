package edu.cit.bibera.examies.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List; // 🔥 ADD THIS
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long instructorId;

    private Long classId;

    private String title;

    private String description;

    private Integer timeLimit;

    private LocalDateTime dueDate;

    private boolean isStarted;

    private boolean isClosed;

    private LocalDateTime createdAt;

    // 🔥 THIS IS THE MISSING PART
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "exam_id")
    private List<QuestionEntity> questions;
}