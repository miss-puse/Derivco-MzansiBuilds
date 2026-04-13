package za.ac.mzansibuilds.util;



import java.util.UUID;

public class Helper {

    public static boolean isNullOrEmpty(String str){
        return (str == null || str.trim().isEmpty());
    }

    public static boolean isValidEmail(String email){
        return (email != null && email.contains("@") && email.contains("."));
    }

    public static String generateId(){
        return UUID.randomUUID().toString();
    }
}