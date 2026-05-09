package edu.cit.bibera.examies.features.classes.service;

import edu.cit.bibera.examies.features.auth.entity.Users;
import edu.cit.bibera.examies.features.classes.entity.ClassesEntity;
import edu.cit.bibera.examies.features.classes.entity.EnrollmentEntity;
import edu.cit.bibera.examies.features.classes.repository.ClassesRepository;
import edu.cit.bibera.examies.features.classes.repository.EnrollmentRepository;
import edu.cit.bibera.examies.features.users.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClassesServiceTest {

    @Mock
    private ClassesRepository classesRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private ClassesService classesService;

    @Test
    void getClassesByStudent_returnsEnrolledClasses() {
        Users user = Users.builder().id(7L).supabaseUserId("sb-1").build();
        EnrollmentEntity enrollment = EnrollmentEntity.builder().studentId(7L).classId(20L).build();
        ClassesEntity classesEntity = ClassesEntity.builder().id(20L).className("IT342").build();

        when(usersRepository.findBySupabaseUserId("sb-1")).thenReturn(Optional.of(user));
        when(enrollmentRepository.findByStudentId(7L)).thenReturn(List.of(enrollment));
        when(classesRepository.findById(20L)).thenReturn(Optional.of(classesEntity));

        List<ClassesEntity> classes = classesService.getClassesByStudent("sb-1");

        assertThat(classes).hasSize(1);
        assertThat(classes.get(0).getClassName()).isEqualTo("IT342");
    }
}
