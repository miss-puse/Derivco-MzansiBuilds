package za.ac.mzansibuilds.factory;

import org.junit.jupiter.api.Test;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.domain.Project;

import static org.junit.jupiter.api.Assertions.*;

class ProjectFactoryTest {

    @Test
    void testCreateProject() {

        Developer developer = new Developer.Builder()
                .setDeveloperId("DEV001")
                .setName("Lennox")
                .setEmail("lennox@gmail.com")
                .setPassword("12345")
                .build();

        Project project = ProjectFactory.createProject(
                "MzansiBuilds App",
                "Building in public platform",
                "IN_PROGRESS",
                "Need frontend help",
                developer
        );

        assertNotNull(project);
        assertEquals("MzansiBuilds App", project.getTitle());
        assertEquals("IN_PROGRESS", project.getStage());
        assertEquals(developer, project.getDeveloper());
    }
}