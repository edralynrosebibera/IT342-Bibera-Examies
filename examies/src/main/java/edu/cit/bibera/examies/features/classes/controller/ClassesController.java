package edu.cit.bibera.examies.features.classes.controller;

import edu.cit.bibera.examies.features.classes.dto.CreateClassRequest;
import edu.cit.bibera.examies.features.classes.entity.ClassesEntity;
import edu.cit.bibera.examies.features.classes.service.ClassesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ClassesController {

    private final ClassesService classesService;

    @PostMapping
    public ResponseEntity<ClassesEntity> createClass(@RequestBody CreateClassRequest request) {
        return ResponseEntity.ok(classesService.createClass(request));
    }

    @GetMapping("/instructor/{supabaseUserId}")
    public ResponseEntity<List<ClassesEntity>> getClassesByInstructor(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(classesService.getClassesByInstructor(supabaseUserId));
    }

    @GetMapping("/student/{supabaseUserId}")
    public ResponseEntity<List<ClassesEntity>> getClassesByStudent(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(classesService.getClassesByStudent(supabaseUserId));
    }

    @GetMapping("/{classId}")
    public ResponseEntity<ClassesEntity> getClassById(@PathVariable Long classId) {
        return ResponseEntity.ok(classesService.getClassById(classId));
    }
}