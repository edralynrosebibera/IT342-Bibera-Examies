package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.model.Users;
import edu.cit.bibera.examies.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UsersRepository usersRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(usersRepository.findAll());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return usersRepository.findById(id)
                .map(user -> updateRole(user, request))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!usersRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        usersRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> updateRole(Users user, Map<String, String> request) {
        String role = request.get("role");
        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        user.setRole(Users.UserRole.valueOf(role.trim().toUpperCase()));
        return ResponseEntity.ok(usersRepository.save(user));
    }
}
