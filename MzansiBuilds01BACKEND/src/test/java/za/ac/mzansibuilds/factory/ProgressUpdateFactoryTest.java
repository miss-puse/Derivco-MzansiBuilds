package za.ac.mzansibuilds.factory;

import org.junit.jupiter.api.Test;
import za.ac.mzansibuilds.domain.ProgressUpdate;
import za.ac.mzansibuilds.domain.Project;

import static org.junit.jupiter.api.Assertions.*;

class ProgressUpdateFactoryTest {

    @Test
    void testCreateProgressUpdate() {

        Project project = new Project.Builder()
                .setProjectId("PROJ001")
                .setTitle("Test Project")
                .setDescription("Testing")
                .setStage("IN_PROGRESS")
                .build();

        ProgressUpdate update = ProgressUpdateFactory.createProgressUpdate(
                "Completed backend setup",
                project
        );

        assertNotNull(update);
        assertEquals("Completed backend setup", update.getMessage());
        //assertEquals(project, update.getProject());
    }
}