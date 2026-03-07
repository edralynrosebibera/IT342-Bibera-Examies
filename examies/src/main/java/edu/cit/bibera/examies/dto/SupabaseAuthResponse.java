package edu.cit.bibera.examies.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SupabaseAuthResponse {

    private SupabaseUser user;

}