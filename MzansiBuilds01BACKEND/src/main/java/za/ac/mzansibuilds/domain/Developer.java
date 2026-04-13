package za.ac.mzansibuilds.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Developer {

    @Id
    @Column(name = "developer_id", nullable = false)
    private String developerId;

    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    private String phoneNumber;
    private String role;

    public Developer(){}

    private Developer(Builder builder){
        this.developerId = builder.developerId;
        this.name = builder.name;
        this.email = builder.email;
        this.password = builder.password;
        this.phoneNumber = builder.phoneNumber;
        this.role = builder.role;
    }

    public String getDeveloperId() { return developerId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    @JsonIgnore
    public String getPassword() { return password; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getRole() { return role; }

    @Override
    public String toString() {
        return "Developer{" +
                "developerId='" + developerId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    // BUILDER (same style as your Admin)
    public static class Builder {
        private String developerId;
        private String name;
        private String email;
        private String password;
        private String phoneNumber;
        private String role;

        public Builder setDeveloperId(String developerId){
            this.developerId = developerId;
            return this;
        }

        public Builder setName(String name){
            this.name = name;
            return this;
        }

        public Builder setEmail(String email){
            this.email = email;
            return this;
        }

        public Builder setPassword(String password){
            this.password = password;
            return this;
        }

        public Builder setPhoneNumber(String phoneNumber){
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder setRole(String role){
            this.role = role;
            return this;
        }

        public Builder copy(Developer dev){
            this.developerId = dev.developerId;
            this.name = dev.name;
            this.email = dev.email;
            this.password = dev.password;
            this.phoneNumber = dev.phoneNumber;
            this.role = dev.role;
            return this;
        }

        public Developer build(){
            if(developerId == null || developerId.isEmpty()){
                throw new IllegalArgumentException("developerId is required");
            }
            return new Developer(this);
        }
    }
}