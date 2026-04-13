package za.ac.mzansibuilds.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.factory.DeveloperFactory;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class DeveloperServiceTest {

    @Autowired
    private DeveloperService developerService;

    private static final Developer developer = DeveloperFactory.createDeveloper(
            "Lennox Komane",
            "lennox@gmail.com",
            "12345"
    );

    @Test
    @Order(1)
    void a_create() {
        Developer created = developerService.save(developer);
        assertNotNull(created);
        assertNotNull(created.getDeveloperId());
        System.out.println("Created: " + created);
    }

    @Test
    @Order(2)
    void b_read() {
        Developer read = developerService.findByEmail(developer.getEmail());
        assertNotNull(read);
        assertEquals(developer.getEmail(), read.getEmail());
        System.out.println("Read: " + read);
    }

    @Test
    @Order(3)
    void c_update() {
        Developer updatedDev = new Developer.Builder()
                .copy(developer)
                .setName("Lennox K.")
                .build();

        Developer updated = developerService.save(updatedDev);
        assertNotNull(updated);
        assertEquals("Lennox K.", updated.getName());
        System.out.println("Updated: " + updated);
    }

    @Test
    @Order(4)
    @Disabled("Delete test disabled")
    void d_delete() {
        developerService.deleteById(developer.getDeveloperId());
        Developer deleted = developerService.findByEmail(developer.getEmail());
        assertNull(deleted);
    }
}