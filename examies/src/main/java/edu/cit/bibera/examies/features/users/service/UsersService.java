package edu.cit.bibera.examies.features.users.service;

import edu.cit.bibera.examies.features.auth.entity.Users;
import edu.cit.bibera.examies.features.users.dto.UsersDTO;
import edu.cit.bibera.examies.features.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;

    public Optional<UsersDTO> findUserDtoById(Long id) {
        return usersRepository.findById(id).map(this::toDto);
    }

    private UsersDTO toDto(Users user) {
        return UsersDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
