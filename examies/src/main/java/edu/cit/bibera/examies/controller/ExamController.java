package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.entity.ExamEntity;
import edu.cit.bibera.examies.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams") // 🔥 THIS IS WHAT YOU NEED
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ExamController {

    private final ExamService examService;

    // ✅ CREATE EXAM
    @PostMapping
    public ExamEntity create(@RequestBody ExamEntity exam) {
        return examService.createFullExam(exam);
    }

    // ✅ GET TEACHER EXAMS
    @GetMapping("/teacher/{instructorId}")
    public List<ExamEntity> getTeacherExams(@PathVariable Long instructorId) {
        return examService.getTeacherExams(instructorId);
    }

    // ✅ GET CLASS EXAMS
    @GetMapping("/class/{classId}")
    public List<ExamEntity> getClassExams(@PathVariable Long classId) {
        return examService.getClassExams(classId);
    }

    // ✅ START EXAM
    @PutMapping("/start/{id}")
    public ExamEntity startExam(@PathVariable Long id) {
        return examService.startExam(id);
    }

    // ✅ CLOSE EXAM
    @PutMapping("/close/{id}")
    public ExamEntity closeExam(@PathVariable Long id) {
        return examService.closeExam(id);
    }

    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
    }

    @PutMapping("/{id}")
    public ExamEntity updateExam(@PathVariable Long id, @RequestBody ExamEntity updatedExam) {
        return examService.updateExam(id, updatedExam);
    }   

    @GetMapping("/{id}")
public ExamEntity getExamById(@PathVariable Long id) {
    return examService.getExamById(id);
}
}