package za.ac.mzansibuilds.factory;



import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.util.Helper;

public class DeveloperFactory {

    public static Developer createDeveloper(String name, String email, String password){

        if(Helper.isNullOrEmpty(name) ||
                Helper.isNullOrEmpty(email) ||
                Helper.isNullOrEmpty(password)){
            return null;
        }

        if(!Helper.isValidEmail(email)){
            return null;
        }

        return new Developer.Builder()
                .setDeveloperId(Helper.generateId())
                .setName(name)
                .setEmail(email)
                .setPassword(password)
                .build();
    }
}
