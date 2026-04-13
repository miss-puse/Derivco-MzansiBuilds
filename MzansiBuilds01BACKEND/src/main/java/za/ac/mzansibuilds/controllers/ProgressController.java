package za.ac.mzansibuilds.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.mzansibuilds.domain.ProgressUpdate;
import za.ac.mzansibuilds.service.ProgressUpdateService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mzansi/progress")
public class ProgressController {

    @Autowired
    private ProgressUpdateService service;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ProgressUpdate update){
        try {
            ProgressUpdate created = service.save(update);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/project/{id}")
    public List<ProgressUpdate> byProject(@PathVariable String id){
        return service.findByProjectId(id);
    }
}