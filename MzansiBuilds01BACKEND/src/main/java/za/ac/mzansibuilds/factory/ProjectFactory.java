package za.ac.mzansibuilds.factory;



import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.util.Helper;

public class ProjectFactory {

    public static Project createProject(String title,
                                        String description,
                                        String stage,
                                        String supportNeeded,
                                        Developer developer){

        if(Helper.isNullOrEmpty(title) ||
                Helper.isNullOrEmpty(description) ||
                Helper.isNullOrEmpty(stage) ||
                developer == null){
            return null;
        }

        return new Project.Builder()
                .setProjectId(Helper.generateId())
                .setTitle(title)
                .setDescription(description)
                .setStage(stage)
                .setSupportNeeded(supportNeeded)
                .setDeveloper(developer)
                .build();
    }
}
