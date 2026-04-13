package za.ac.mzansibuilds.controllers;

import com.icegreen.greenmail.junit5.GreenMailExtension;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetup;
import com.icegreen.greenmail.util.ServerSetupTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import javax.mail.internet.MimeMessage;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DeveloperControllerIntegrationTest {

        private static final ServerSetup TEST_SMTP = new ServerSetup(3025, null, ServerSetup.PROTOCOL_SMTP);
        private static final String TEST_MAIL_USERNAME = "no-reply@mzansibuilds.local";
        private static final String TEST_MAIL_PASSWORD = "test-password";

        @RegisterExtension
        static GreenMailExtension greenMail = new GreenMailExtension(TEST_SMTP);

        @DynamicPropertySource
        static void overrideMailProperties(DynamicPropertyRegistry registry) {
                registry.add("spring.mail.host", () -> "127.0.0.1");
                registry.add("spring.mail.port", () -> TEST_SMTP.getPort());
                registry.add("spring.mail.username", () -> TEST_MAIL_USERNAME);
                registry.add("spring.mail.password", () -> TEST_MAIL_PASSWORD);
                registry.add("spring.mail.properties.mail.smtp.auth", () -> "true");
                registry.add("spring.mail.properties.mail.smtp.starttls.enable", () -> "false");
                registry.add("spring.mail.properties.mail.smtp.starttls.required", () -> "false");
                registry.add("app.frontend.url", () -> "http://localhost:5173");
        }

    @Autowired
        private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

        @LocalServerPort
        private int port;

        @BeforeEach
        void clearMailbox() throws Exception {
                greenMail.setUser(TEST_MAIL_USERNAME, TEST_MAIL_PASSWORD);
                greenMail.purgeEmailFromAllMailboxes();
        }

    @Test
    void registerAndLoginReturnsJwtBackedAuthPayload() throws Exception {
        String email = "auth-" + UUID.randomUUID() + "@example.com";
        String baseUrl = "http://localhost:" + port + "/api/mzansi/developers";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> registerEntity = new HttpEntity<>(
                objectMapper.writeValueAsString(Map.of(
                        "name", "Integration User",
                        "email", email,
                        "password", "Secret123!",
                        "phoneNumber", "0821234567",
                        "role", "DEVELOPER"
                )),
                headers
        );

        ResponseEntity<String> registerResponseEntity = restTemplate.postForEntity(
                baseUrl + "/register",
                registerEntity,
                String.class
        );

        assertEquals(200, registerResponseEntity.getStatusCodeValue());
        assertNotNull(registerResponseEntity.getBody());

        JsonNode registered = objectMapper.readTree(registerResponseEntity.getBody());
        assertNotNull(registered.get("developerId"));
        assertFalse(registered.get("developerId").asText().isBlank());
        assertEquals(email, registered.get("email").asText());
        assertNotNull(registered.get("token"));
        assertFalse(registered.get("token").asText().isBlank());

        HttpEntity<String> loginEntity = new HttpEntity<>(
                objectMapper.writeValueAsString(Map.of(
                        "email", email,
                        "password", "Secret123!"
                )),
                headers
        );

        ResponseEntity<String> loginResponseEntity = restTemplate.postForEntity(
                baseUrl + "/login",
                loginEntity,
                String.class
        );

        assertEquals(200, loginResponseEntity.getStatusCodeValue());
        assertNotNull(loginResponseEntity.getBody());

        JsonNode loggedIn = objectMapper.readTree(loginResponseEntity.getBody());
        assertEquals(registered.get("developerId").asText(), loggedIn.get("developerId").asText());
        assertEquals("Integration User", loggedIn.get("name").asText());
        assertNotNull(loggedIn.get("token"));
        assertFalse(loggedIn.get("token").asText().isBlank());
    }

    @Test
    void registerRejectsDuplicateEmails() throws Exception {
        String email = "duplicate-" + UUID.randomUUID() + "@example.com";
        String baseUrl = "http://localhost:" + port + "/api/mzansi/developers";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String payload = objectMapper.writeValueAsString(Map.of(
                "name", "Duplicate User",
                "email", email,
                "password", "Secret123!"
        ));

        ResponseEntity<String> first = restTemplate.postForEntity(
                baseUrl + "/register",
                new HttpEntity<>(payload, headers),
                String.class
        );

        ResponseEntity<String> second = restTemplate.postForEntity(
                baseUrl + "/register",
                new HttpEntity<>(payload, headers),
                String.class
        );

        assertEquals(200, first.getStatusCodeValue());
        assertEquals(409, second.getStatusCodeValue());
        assertNotNull(second.getBody());

        JsonNode duplicateResponse = objectMapper.readTree(second.getBody());
        assertEquals("Email already exists", duplicateResponse.get("message").asText());
    }

    @Test
    void forgotPasswordSendsEmailAndResetPasswordAllowsNewLogin() throws Exception {
        String email = "reset-" + UUID.randomUUID() + "@example.com";
        String baseUrl = "http://localhost:" + port + "/api/mzansi/developers";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<String> registerResponse = restTemplate.postForEntity(
                baseUrl + "/register",
                new HttpEntity<>(objectMapper.writeValueAsString(Map.of(
                        "name", "Reset User",
                        "email", email,
                        "password", "Secret123!",
                        "role", "DEVELOPER"
                )), headers),
                String.class
        );
        assertEquals(200, registerResponse.getStatusCodeValue());

        ResponseEntity<String> forgotResponse = restTemplate.postForEntity(
                baseUrl + "/forgot-password",
                new HttpEntity<>(objectMapper.writeValueAsString(Map.of("email", email)), headers),
                String.class
        );
        assertEquals(200, forgotResponse.getStatusCodeValue());

        assertTrue(greenMail.waitForIncomingEmail(5000, 1));
        MimeMessage[] messages = greenMail.getReceivedMessages();
        assertTrue(messages.length >= 1);

        String emailBody = GreenMailUtil.getBody(messages[0]);
        int markerIndex = emailBody.indexOf("/reset-password?token=");
        assertTrue(markerIndex > -1, "Reset link token not found in email body");

        int tokenStart = markerIndex + "/reset-password?token=".length();
        int tokenEnd = emailBody.indexOf('\n', tokenStart);
        if (tokenEnd < 0) {
            tokenEnd = emailBody.length();
        }
        String rawToken = emailBody.substring(tokenStart, tokenEnd).trim();
        String token = URLDecoder.decode(rawToken, StandardCharsets.UTF_8);

        ResponseEntity<String> resetResponse = restTemplate.postForEntity(
                baseUrl + "/reset-password",
                new HttpEntity<>(objectMapper.writeValueAsString(Map.of(
                        "token", token,
                        "newPassword", "NewPassword123!"
                )), headers),
                String.class
        );
        assertEquals(200, resetResponse.getStatusCodeValue());

        ResponseEntity<String> oldPasswordLogin = restTemplate.postForEntity(
                baseUrl + "/login",
                new HttpEntity<>(objectMapper.writeValueAsString(Map.of(
                        "email", email,
                        "password", "Secret123!"
                )), headers),
                String.class
        );
        assertEquals(401, oldPasswordLogin.getStatusCodeValue());

        ResponseEntity<String> newPasswordLogin = restTemplate.postForEntity(
                baseUrl + "/login",
                new HttpEntity<>(objectMapper.writeValueAsString(Map.of(
                        "email", email,
                        "password", "NewPassword123!"
                )), headers),
                String.class
        );
        assertEquals(200, newPasswordLogin.getStatusCodeValue());
    }
}