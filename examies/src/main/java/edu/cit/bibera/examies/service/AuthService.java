package edu.cit.bibera.examies.service;

import edu.cit.bibera.examies.dto.*;
import edu.cit.bibera.examies.model.Users;
import edu.cit.bibera.examies.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final RestTemplate restTemplate;
    private final UsersRepository usersRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon.key}")
    private String supabaseAnonKey;

    private String getAuthUrl() {
        return supabaseUrl + "/auth/v1";
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        try {

            if (usersRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("User already exists");
            }

            String signUpUrl = getAuthUrl() + "/signup";

            Map<String, Object> userData = new HashMap<>();
            userData.put("first_name", request.getFirstName());
            userData.put("last_name", request.getLastName());
            userData.put("role", request.getRole());

            SupabaseSignUpOptions options = SupabaseSignUpOptions.builder()
                    .data(userData)
                    .build();

            SupabaseSignUpRequest signUpRequest = SupabaseSignUpRequest.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .options(options)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", supabaseAnonKey);
            headers.set("Authorization", "Bearer " + supabaseAnonKey);

            HttpEntity<SupabaseSignUpRequest> entity = new HttpEntity<>(signUpRequest, headers);

            ResponseEntity<SupabaseAuthResponse> response = restTemplate.exchange(
                    signUpUrl,
                    HttpMethod.POST,
                    entity,
                    SupabaseAuthResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Signup failed with status: " + response.getStatusCode());
            }

            SupabaseAuthResponse body = response.getBody();

            if (body.getUser() == null) {
                throw new RuntimeException("Supabase did not return a user");
            }

            SupabaseUser supabaseUser = body.getUser();

            Users.UserRole role;

            try {
                role = Users.UserRole.valueOf(
                        request.getRole().trim().toUpperCase()
                );
            } catch (Exception e) {
                throw new RuntimeException("Invalid role: " + request.getRole());
            }

            Users user = Users.builder()
                    .supabaseUserId(supabaseUser.getId())
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .role(role)
                    .build();

            usersRepository.save(user);

            return AuthResponse.builder()
                    .user(supabaseUser)
                    .build();

        } catch (Exception e) {
            log.error("Error during signup", e);
            throw new RuntimeException("Signup failed: " + e.getMessage());
        }
    }

    public AuthResponse signIn(AuthRequest request) {

        try {

            String signInUrl = getAuthUrl() + "/token?grant_type=password";

            SupabaseSignInRequest signInRequest = SupabaseSignInRequest.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", supabaseAnonKey);
            headers.set("Authorization", "Bearer " + supabaseAnonKey);

            HttpEntity<SupabaseSignInRequest> entity = new HttpEntity<>(signInRequest, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    signInUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new RuntimeException("Signin failed with status: " + response.getStatusCode());
            }

            Map<String, Object> responseBody = response.getBody();

            String accessToken = (String) responseBody.get("access_token");
            String refreshToken = (String) responseBody.get("refresh_token");

            Map<String, Object> userMap = (Map<String, Object>) responseBody.get("user");

            if (userMap == null) {
                throw new RuntimeException("User data not returned by Supabase");
            }

            String userId = (String) userMap.get("id");

            Users user = usersRepository
                    .findBySupabaseUserId(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            SupabaseUser supabaseUser = SupabaseUser.builder()
                    .id(userId)
                    .email((String) userMap.get("email"))
                    .user_metadata((Map<String, Object>) userMap.get("user_metadata"))
                    .build();

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(supabaseUser)
                    .build();

        } catch (Exception e) {
            log.error("Error during signin", e);
            throw new RuntimeException("Signin failed: " + e.getMessage());
        }
    }

    public void signOut(String accessToken) {

        try {

            String signOutUrl = getAuthUrl() + "/logout";

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseAnonKey);
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    signOutUrl,
                    HttpMethod.POST,
                    entity,
                    Void.class
            );

        } catch (Exception e) {
            log.error("Error during signout", e);
            throw new RuntimeException("Signout failed: " + e.getMessage());
        }
    }

        public ResponseEntity<?> getUserByEmail(String email) {
        Optional<Users> userOpt = usersRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(userOpt.get());
    }
}