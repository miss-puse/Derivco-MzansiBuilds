package za.ac.mzansibuilds.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.mzansibuilds.domain.Comment;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.factory.CommentFactory;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class CommentServiceTest {

    @Autowired
    private CommentService service;

    private static Comment comment;

    private static Project project;

    @BeforeAll
    static void setup() {
        Developer dev = new Developer.Builder()
                .setDeveloperId("DEV1")
                .setName("Lennox")
                .setEmail("test@gmail.com")
                .setPassword("123")
                .build();

        project = new Project.Builder()
                .setProjectId("PROJ1")
                .setTitle("App")
                .setDescription("Test")
                .setStage("IN_PROGRESS")
                .setDeveloper(dev)
                .build();

        comment = CommentFactory.createComment("Nice project", dev, project);
    }

    @Test
    @Order(1)
    void a_create() {
        Comment created = service.save(comment);
        assertNotNull(created);
    }

    @Test
    @Order(2)
    void b_read() {
        List<Comment> list = service.findByProjectId(project.getProjectId());
        assertFalse(list.isEmpty());
    }
}