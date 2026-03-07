package edu.cit.bibera.examies.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupabaseSignUpRequest {
    private String email;
    private String password;
    private SupabaseSignUpOptions options;
}
