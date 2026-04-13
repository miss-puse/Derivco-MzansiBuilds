package za.ac.mzansibuilds.domain;

import javax.persistence.*;

@Entity
public class ProgressUpdate {

    @Id
    @Column(name = "update_id")
    private String updateId;

    private String message;
    private String date;

    @ManyToOne
    private Project project;

    public ProgressUpdate(){}

    private ProgressUpdate(Builder builder){
        this.updateId = builder.updateId;
        this.message = builder.message;
        this.date = builder.date;
        this.project = builder.project;
    }

    public String getUpdateId() { return updateId; }
    public String getMessage() { return message; }

    @Override
    public String toString() {
        return "ProgressUpdate{" +
                "updateId='" + updateId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }


    public static class Builder {
        private String updateId;
        private String message;
        private String date;
        private Project project;

        public Builder setUpdateId(String updateId){
            this.updateId = updateId;
            return this;
        }

        public Builder setMessage(String message){
            this.message = message;
            return this;
        }

        public Builder setDate(String date){
            this.date = date;
            return this;
        }

        public Builder setProject(Project project){
            this.project = project;
            return this;
        }

        public ProgressUpdate build(){
            if(updateId == null || updateId.isEmpty()){
                throw new IllegalArgumentException("updateId is required");
            }
            return new ProgressUpdate(this);
        }
    }
}