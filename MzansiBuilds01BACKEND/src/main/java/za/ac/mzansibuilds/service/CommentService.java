package za.ac.mzansibuilds.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.mzansibuilds.domain.Comment;
import za.ac.mzansibuilds.repository.CommentRepository;

import java.util.List;

@Service
public class CommentService implements ICommentService {

    private final CommentRepository repository;

    @Autowired
    public CommentService(CommentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Comment save(Comment entity) {
        return repository.save(entity);
    }

    @Override
    public Comment update(Comment entity) {
        return repository.save(entity);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Comment read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Comment> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Comment> findByProjectId(String projectId) {
        return repository.findByProjectProjectId(projectId);
    }
}