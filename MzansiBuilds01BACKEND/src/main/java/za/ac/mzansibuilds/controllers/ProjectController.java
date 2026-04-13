package za.ac.mzansibuilds.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.service.ProjectService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mzansi/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Project project) {
        try {
            Project created = projectService.save(project);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public List<Project> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> find(@PathVariable String id) {
        Project project = projectService.read(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("message", "Project not found"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Project updates) {
        try {
            Project existing = projectService.read(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Project not found"));
            }
            
            Project updated = new Project.Builder()
                .copy(existing)
                .setTitle(updates.getTitle() != null ? updates.getTitle() : existing.getTitle())
                .setDescription(updates.getDescription() != null ? updates.getDescription() : existing.getDescription())
                .setStage(updates.getStage() != null ? updates.getStage() : existing.getStage())
                .setSupportNeeded(updates.getSupportNeeded() != null ? updates.getSupportNeeded() : existing.getSupportNeeded())
                .build();
            
            return ResponseEntity.ok(projectService.save(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            projectService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/developer/{developerId}")
    public List<Project> getByDeveloper(@PathVariable String developerId) {
        return projectService.findAll().stream()
            .filter(p -> p.getDeveloper() != null && 
                        p.getDeveloper().getDeveloperId().equals(developerId))
            .collect(Collectors.toList());
    }

    @GetMapping("/completed")
    public List<Project> getCompleted() {
        return projectService.findAll().stream()
            .filter(p -> "completed".equalsIgnoreCase(p.getStage()))
            .collect(Collectors.toList());
    }
}