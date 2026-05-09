package edu.cit.bibera.examies.features.users.service;

import edu.cit.bibera.examies.features.auth.entity.Users;
import edu.cit.bibera.examies.features.users.dto.UsersDTO;
import edu.cit.bibera.examies.features.users.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private UsersService usersService;

    @Test
    void findUserDtoById_mapsEntityToDto() {
        Users user = Users.builder()
                .id(10L)
                .email("student@example.com")
                .firstName("Student")
                .lastName("One")
                .role(Users.UserRole.STUDENT)
                .phoneNumber("09123456789")
                .build();

        when(usersRepository.findById(10L)).thenReturn(Optional.of(user));

        Optional<UsersDTO> dto = usersService.findUserDtoById(10L);

        assertThat(dto).isPresent();
        assertThat(dto.get().getId()).isEqualTo(10L);
        assertThat(dto.get().getRole()).isEqualTo("STUDENT");
        assertThat(dto.get().getEmail()).isEqualTo("student@example.com");
    }
}
