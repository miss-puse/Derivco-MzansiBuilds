package za.ac.mzansibuilds.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private String projectId;
    private String projectName;
    private String description;
    private String developerId;
}