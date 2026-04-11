package edu.cit.bibera.examies.controller;

import edu.cit.bibera.examies.dto.CreateClassRequest;
import edu.cit.bibera.examies.entity.ClassesEntity;
import edu.cit.bibera.examies.service.ClassesService;
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

    @GetMapping("/instructor/{id}")
    public ResponseEntity<List<ClassesEntity>> getClassesByInstructor(@PathVariable Long id) {
        return ResponseEntity.ok(classesService.getClassesByInstructor(id));
    }
}