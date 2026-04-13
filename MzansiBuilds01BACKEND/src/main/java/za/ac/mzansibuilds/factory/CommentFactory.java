package za.ac.mzansibuilds.factory;



import za.ac.mzansibuilds.domain.Comment;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.util.Helper;

public class CommentFactory {

    public static Comment createComment(String message,
                                        Developer developer,
                                        Project project){

        if(Helper.isNullOrEmpty(message) ||
                developer == null ||
                project == null){
            return null;
        }

        return new Comment.Builder()
                .setCommentId(Helper.generateId())
                .setMessage(message)
                .setDeveloper(developer)
                .setProject(project)
                .build();
    }
}
