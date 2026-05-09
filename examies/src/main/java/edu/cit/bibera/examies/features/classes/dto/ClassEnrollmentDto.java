package edu.cit.bibera.examies.features.classes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassEnrollmentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
}