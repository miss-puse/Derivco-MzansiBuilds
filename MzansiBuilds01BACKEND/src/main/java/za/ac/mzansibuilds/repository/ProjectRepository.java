package za.ac.mzansibuilds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.mzansibuilds.domain.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    List<Project> findByStage(String stage); // for Celebration Wall

    List<Project> findByDeveloperDeveloperId(String developerId); // get user projects
}