package za.ac.mzansibuilds.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.mzansibuilds.domain.ProgressUpdate;
import za.ac.mzansibuilds.repository.ProgressUpdateRepository;

import java.util.List;

@Service
public class ProgressUpdateService implements IProgressUpdateService {

    private final ProgressUpdateRepository repository;

    @Autowired
    public ProgressUpdateService(ProgressUpdateRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProgressUpdate save(ProgressUpdate entity) {
        return repository.save(entity);
    }

    @Override
    public ProgressUpdate update(ProgressUpdate entity) {
        return repository.save(entity);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public ProgressUpdate read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<ProgressUpdate> findAll() {
        return repository.findAll();
    }

    @Override
    public List<ProgressUpdate> findByProjectId(String projectId) {
        return repository.findByProjectProjectId(projectId);
    }
}