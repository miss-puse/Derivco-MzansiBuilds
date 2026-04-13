package za.ac.mzansibuilds.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.factory.DeveloperFactory;
import za.ac.mzansibuilds.factory.ProjectFactory;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class ProjectServiceTest {

    @Autowired
    private ProjectService projectService;

    private static final Developer developer =
            DeveloperFactory.createDeveloper("Lennox", "dev@gmail.com", "123");

    private static final Project project =
            ProjectFactory.createProject(
                    "MzansiBuilds",
                    "Platform",
                    "IN_PROGRESS",
                    "Need help",
                    developer
            );

    @Test
    @Order(1)
    void a_create() {
        Project created = projectService.save(project);
        assertNotNull(created);
        System.out.println("Created: " + created);
    }

    @Test
    @Order(2)
    void b_read() {
        List<Project> list = projectService.findByDeveloperId(developer.getDeveloperId());
        assertFalse(list.isEmpty());
        System.out.println("Read: " + list.get(0));
    }

    @Test
    @Order(3)
    void c_update() {
        Project updatedProject = new Project.Builder()
                .copy(project)
                .setStage("COMPLETE")
                .build();

        Project updated = projectService.save(updatedProject);
        assertEquals("COMPLETE", updated.getStage());
        System.out.println("Updated: " + updated);
    }
}