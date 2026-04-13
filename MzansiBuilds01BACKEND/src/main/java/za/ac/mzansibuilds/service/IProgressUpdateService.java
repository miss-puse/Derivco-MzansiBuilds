package za.ac.mzansibuilds.service;

import za.ac.mzansibuilds.domain.ProgressUpdate;
import java.util.List;

public interface IProgressUpdateService extends IService<ProgressUpdate, String> {

    List<ProgressUpdate> findByProjectId(String projectId);
}