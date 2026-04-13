package za.ac.mzansibuilds.domain;

import javax.persistence.*;

@Entity
public class Project {

    @Id
    @Column(name = "project_id")
    private String projectId;

    private String title;
    private String description;
    private String stage;
    private String supportNeeded;

    @ManyToOne
    private Developer developer;

    public Project(){}

    private Project(Builder builder){
        this.projectId = builder.projectId;
        this.title = builder.title;
        this.description = builder.description;
        this.stage = builder.stage;
        this.supportNeeded = builder.supportNeeded;
        this.developer = builder.developer;
    }

    public String getProjectId() { return projectId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getStage() { return stage; }
    public String getSupportNeeded() { return supportNeeded; }
    public Developer getDeveloper() { return developer; }

    @Override
    public String toString() {
        return "Project{" +
                "projectId='" + projectId + '\'' +
                ", title='" + title + '\'' +
                ", stage='" + stage + '\'' +
                '}';
    }

    public static class Builder {
        private String projectId;
        private String title;
        private String description;
        private String stage;
        private String supportNeeded;
        private Developer developer;

        public Builder setProjectId(String projectId){
            this.projectId = projectId;
            return this;
        }

        public Builder setTitle(String title){
            this.title = title;
            return this;
        }

        public Builder setDescription(String description){
            this.description = description;
            return this;
        }

        public Builder setStage(String stage){
            this.stage = stage;
            return this;
        }

        public Builder setSupportNeeded(String supportNeeded){
            this.supportNeeded = supportNeeded;
            return this;
        }

        public Builder setDeveloper(Developer developer){
            this.developer = developer;
            return this;
        }

        public Builder copy(Project project){
            this.projectId = project.projectId;
            this.title = project.title;
            this.description = project.description;
            this.stage = project.stage;
            this.supportNeeded = project.supportNeeded;
            this.developer = project.developer;
            return this;
        }

        public Project build(){
            if(projectId == null || projectId.isEmpty()){
                throw new IllegalArgumentException("projectId is required");
            }
            return new Project(this);
        }
    }
}