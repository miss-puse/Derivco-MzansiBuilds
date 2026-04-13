package za.ac.mzansibuilds.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectService implements IProjectService {

    private final ProjectRepository repository;

    @Autowired
    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    @Override
    public Project save(Project entity) {
        return repository.save(entity);
    }

    @Override
    public Project update(Project entity) {
        return repository.save(entity);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Project read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Project> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Project> findByStage(String stage) {
        return repository.findByStage(stage);
    }

    @Override
    public List<Project> findByDeveloperId(String developerId) {
        return repository.findByDeveloperDeveloperId(developerId);
    }
}