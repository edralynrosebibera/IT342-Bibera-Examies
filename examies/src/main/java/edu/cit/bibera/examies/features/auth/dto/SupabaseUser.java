package edu.cit.bibera.examies.features.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class SupabaseUser {

    private String id;
    private String email;

    private Map<String, Object> user_metadata;

}