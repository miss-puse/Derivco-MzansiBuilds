package za.ac.mzansibuilds.service;

import za.ac.mzansibuilds.domain.Project;
import java.util.List;

public interface IProjectService extends IService<Project, String> {

    List<Project> findByStage(String stage);

    List<Project> findByDeveloperId(String developerId);
}