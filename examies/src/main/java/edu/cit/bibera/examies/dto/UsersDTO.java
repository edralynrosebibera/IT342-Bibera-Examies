package edu.cit.bibera.examies.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
