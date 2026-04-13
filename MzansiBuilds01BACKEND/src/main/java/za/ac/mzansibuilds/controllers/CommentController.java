package za.ac.mzansibuilds.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.mzansibuilds.domain.Comment;
import za.ac.mzansibuilds.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService service;

    @PostMapping("/create")
    public Comment create(@RequestBody Comment comment){
        return service.save(comment);
    }

    @GetMapping("/project/{id}")
    public List<Comment> byProject(@PathVariable String id){
        return service.findByProjectId(id);
    }
}