package za.ac.mzansibuilds.factory;

import org.junit.jupiter.api.Test;
import za.ac.mzansibuilds.domain.Developer;

import static org.junit.jupiter.api.Assertions.*;

class DeveloperFactoryTest {

    @Test
    void testCreateDeveloper() {

        Developer developer = DeveloperFactory.createDeveloper(
                "Lennox Komane",
                "lennox@gmail.com",
                "12345"
        );

        assertNotNull(developer);
        assertEquals("Lennox Komane", developer.getName());
        assertEquals("lennox@gmail.com", developer.getEmail());
        assertEquals("12345", developer.getPassword());
    }
}