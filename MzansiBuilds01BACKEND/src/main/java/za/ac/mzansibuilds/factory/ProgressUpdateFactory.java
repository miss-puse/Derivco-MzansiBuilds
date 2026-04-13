package za.ac.mzansibuilds.factory;

import za.ac.mzansibuilds.domain.ProgressUpdate;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.util.Helper;

import java.time.LocalDate;

public class ProgressUpdateFactory {

    public static ProgressUpdate createProgressUpdate(String message, Project project){

        if(Helper.isNullOrEmpty(message) || project == null){
            return null;
        }

        return new ProgressUpdate.Builder()
                .setUpdateId(Helper.generateId())
                .setMessage(message)
                .setDate(LocalDate.now().toString())
                .setProject(project)
                .build();
    }
}