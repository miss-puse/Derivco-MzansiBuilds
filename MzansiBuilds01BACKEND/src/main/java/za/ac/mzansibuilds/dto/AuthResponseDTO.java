package za.ac.mzansibuilds.dto;

public class AuthResponseDTO {

    private final String developerId;
    private final String name;
    private final String email;
    private final String phoneNumber;
    private final String role;
    private final String token;

    public AuthResponseDTO(String developerId, String name, String email, String phoneNumber, String role, String token) {
        this.developerId = developerId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.token = token;
    }

    public String getDeveloperId() {
        return developerId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}