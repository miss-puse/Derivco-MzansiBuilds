package za.ac.mzansibuilds.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

    private String commentId;

    private String message;

    private String projectId;

    private String developerId;

    private String createdDate;
}