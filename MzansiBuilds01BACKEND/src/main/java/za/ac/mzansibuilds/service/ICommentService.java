package za.ac.mzansibuilds.service;

import za.ac.mzansibuilds.domain.Comment;
import java.util.List;

public interface ICommentService extends IService<Comment, String> {

    List<Comment> findByProjectId(String projectId);
}