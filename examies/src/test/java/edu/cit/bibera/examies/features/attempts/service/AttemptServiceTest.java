package edu.cit.bibera.examies.features.attempts.service;

import edu.cit.bibera.examies.features.attempts.entity.AttemptAnswerEntity;
import edu.cit.bibera.examies.features.attempts.entity.AttemptEntity;
import edu.cit.bibera.examies.features.attempts.repository.AttemptAnswerRepository;
import edu.cit.bibera.examies.features.attempts.repository.AttemptRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttemptServiceTest {

    @Mock
    private AttemptRepository attemptRepository;

    @Mock
    private AttemptAnswerRepository attemptAnswerRepository;

    @InjectMocks
    private AttemptService attemptService;

    @Test
    void submitAttempt_setsComputedFieldsAndPersistsAnswers() {
        AttemptEntity attempt = AttemptEntity.builder().examId(11L).studentId(4L).build();
        AttemptAnswerEntity answer = AttemptAnswerEntity.builder().questionId(1L).selectedOption("A").build();

        when(attemptRepository.save(attempt)).thenReturn(AttemptEntity.builder().id(99L).examId(11L).studentId(4L).build());
        when(attemptAnswerRepository.saveAll(anyList())).thenReturn(List.of(answer));

        AttemptEntity saved = attemptService.submitAttempt(attempt, List.of(answer));

        assertThat(saved.getId()).isEqualTo(99L);
        assertThat(attempt.getStatus()).isEqualTo("COMPLETED");
        assertThat(attempt.getTotal()).isEqualTo(1);
        assertThat(answer.getAttemptId()).isEqualTo(99L);
    }
}
