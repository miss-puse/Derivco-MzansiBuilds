package za.ac.mzansibuilds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.mzansibuilds.domain.ProgressUpdate;

import java.util.List;

@Repository
public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, String> {

    List<ProgressUpdate> findByProjectProjectId(String projectId);
}