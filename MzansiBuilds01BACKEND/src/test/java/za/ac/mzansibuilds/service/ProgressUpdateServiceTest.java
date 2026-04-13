package za.ac.mzansibuilds.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.mzansibuilds.domain.ProgressUpdate;
import za.ac.mzansibuilds.domain.Project;
import za.ac.mzansibuilds.factory.ProgressUpdateFactory;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class ProgressUpdateServiceTest {

    @Autowired
    private ProgressUpdateService service;

    private static Project project;

    private static ProgressUpdate update;

    @BeforeAll
    static void setup() {
        project = new Project.Builder()
                .setProjectId("PROJ1")
                .setTitle("Test")
                .setDescription("Desc")
                .setStage("IN_PROGRESS")
                .build();

        update = ProgressUpdateFactory.createProgressUpdate("Started backend", project);
    }

    @Test
    @Order(1)
    void a_create() {
        ProgressUpdate created = service.save(update);
        assertNotNull(created);
        System.out.println(created);
    }

    @Test
    @Order(2)
    void b_read() {
        List<ProgressUpdate> list = service.findByProjectId(project.getProjectId());
        assertFalse(list.isEmpty());
    }
}