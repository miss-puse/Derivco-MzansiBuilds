package za.ac.mzansibuilds.domain;

import javax.persistence.*;

@Entity
public class Comment {

    @Id
    @Column(name = "comment_id")
    private String commentId;

    private String message;

    @ManyToOne
    private Developer developer;

    @ManyToOne
    private Project project;

    public Comment(){}

    private Comment(Builder builder){
        this.commentId = builder.commentId;
        this.message = builder.message;
        this.developer = builder.developer;
        this.project = builder.project;
    }

    public String getCommentId() { return commentId; }
    public String getMessage() { return message; }

    @Override
    public String toString() {
        return "Comment{" +
                "commentId='" + commentId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }

    public static class Builder {
        private String commentId;
        private String message;
        private Developer developer;
        private Project project;

        public Builder setCommentId(String commentId){
            this.commentId = commentId;
            return this;
        }

        public Builder setMessage(String message){
            this.message = message;
            return this;
        }

        public Builder setDeveloper(Developer developer){
            this.developer = developer;
            return this;
        }

        public Builder setProject(Project project){
            this.project = project;
            return this;
        }

        public Comment build(){
            if(commentId == null || commentId.isEmpty()){
                throw new IllegalArgumentException("commentId is required");
            }
            return new Comment(this);
        }
    }
}