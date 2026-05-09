package edu.cit.bibera.examies.features.users.repository;

import edu.cit.bibera.examies.features.auth.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findBySupabaseUserId(String supabaseUserId);
    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);
}
