package edu.cit.bibera.examies.features.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String role;
}