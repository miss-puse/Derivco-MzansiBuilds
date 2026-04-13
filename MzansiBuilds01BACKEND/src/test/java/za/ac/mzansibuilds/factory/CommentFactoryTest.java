package za.ac.mzansibuilds.factory;

import org.junit.jupiter.api.Test;
import za.ac.mzansibuilds.domain.Comment;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.domain.Project;
import static org.junit.jupiter.api.Assertions.*;


class CommentFactoryTest {

    @Test
    void testCreateComment() {

        Developer developer = new Developer.Builder()
                .setDeveloperId("DEV001")
                .setName("Lennox")
                .setEmail("lennox@gmail.com")
                .setPassword("12345")
                .build();

        Project project = new Project.Builder()
                .setProjectId("PROJ001")
                .setTitle("MzansiBuilds")
                .setDescription("Platform")
                .setStage("IN_PROGRESS")
                .setDeveloper(developer)
                .build();

        Comment comment = CommentFactory.createComment(
                "I can help with frontend",
                developer,
                project
        );

        assertNotNull(comment);
        assertEquals("I can help with frontend", comment.getMessage());
//        assertEquals(developer, comment.getDeveloper());
//        assertEquals(project, comment.getProject());
    }
}