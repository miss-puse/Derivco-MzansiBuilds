package za.ac.mzansibuilds.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.dto.ApiErrorDTO;
import za.ac.mzansibuilds.dto.AuthResponseDTO;
import za.ac.mzansibuilds.dto.LoginRequestDTO;
import za.ac.mzansibuilds.dto.RegisterRequestDTO;
import za.ac.mzansibuilds.service.DeveloperService;
import za.ac.mzansibuilds.util.Helper;
import za.ac.mzansibuilds.util.JwtUtil;

import java.util.List;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/mzansi/developers")
public class DeveloperController {

    @Autowired
    private DeveloperService developerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequestDTO registration, HttpServletRequest request) {
        try {
            if (registration == null
                || Helper.isNullOrEmpty(registration.getName())
                || Helper.isNullOrEmpty(registration.getEmail())
                || Helper.isNullOrEmpty(registration.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(error("name, email and password are required", HttpStatus.BAD_REQUEST, request));
            }

            if (!Helper.isValidEmail(registration.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(error("Invalid email format", HttpStatus.BAD_REQUEST, request));
            }

            String normalizedEmail = registration.getEmail().trim().toLowerCase();

            if (developerService.existsByEmail(normalizedEmail)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(error("Email already exists", HttpStatus.CONFLICT, request));
            }

            Developer toCreate = new Developer.Builder()
                    .setDeveloperId(Helper.generateId())
                    .setName(registration.getName())
                    .setEmail(normalizedEmail)
                    .setPassword(registration.getPassword())
                    .setPhoneNumber(registration.getPhoneNumber())
                    .setRole(registration.getRole() != null ? registration.getRole() : "DEVELOPER")
                    .build();

            Developer created = developerService.save(toCreate);
            return ResponseEntity.ok(toAuthResponse(created));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(error("Email already exists", HttpStatus.CONFLICT, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(error(e.getMessage(), HttpStatus.BAD_REQUEST, request));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO credentials, HttpServletRequest request) {
        try {
            String email = credentials.getEmail();
            String password = credentials.getPassword();

            if (Helper.isNullOrEmpty(email) || Helper.isNullOrEmpty(password)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(error("email and password are required", HttpStatus.BAD_REQUEST, request));
            }

            email = email.trim().toLowerCase();

            Developer developer = developerService.findByEmail(email);

            if (developer != null && password != null && passwordEncoder.matches(password, developer.getPassword())) {
                return ResponseEntity.ok(toAuthResponse(developer));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(error("Invalid credentials", HttpStatus.UNAUTHORIZED, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request));
        }
    }

    @PostMapping("/create")
    public Developer create(@RequestBody Developer developer) {
        if (developer.getDeveloperId() == null || developer.getDeveloperId().isBlank()) {
            developer = new Developer.Builder()
                    .copy(developer)
                    .setDeveloperId(Helper.generateId())
                    .build();
        }
        return developerService.save(developer);
    }

    @GetMapping("/all")
    public List<Developer> getAll() {
        return developerService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> find(@PathVariable String id) {
        Developer developer = developerService.read(id);
        if (developer != null) {
            return ResponseEntity.ok(developer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiErrorDTO("Developer not found", HttpStatus.NOT_FOUND.value(), "/mzansi/developers/find/" + id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Developer updates, HttpServletRequest request) {
        try {
            Developer existing = developerService.read(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error("Developer not found", HttpStatus.NOT_FOUND, request));
            }
            
            Developer updated = new Developer.Builder()
                .copy(existing)
                .setName(updates.getName() != null ? updates.getName() : existing.getName())
                .setEmail(updates.getEmail() != null ? updates.getEmail() : existing.getEmail())
                .setPhoneNumber(updates.getPhoneNumber() != null ? updates.getPhoneNumber() : existing.getPhoneNumber())
                .setRole(updates.getRole() != null ? updates.getRole() : existing.getRole())
                .build();
            
            return ResponseEntity.ok(developerService.save(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request));
        }
    }

    private AuthResponseDTO toAuthResponse(Developer developer) {
        return new AuthResponseDTO(
                developer.getDeveloperId(),
                developer.getName(),
                developer.getEmail(),
                developer.getPhoneNumber(),
                developer.getRole(),
                jwtUtil.generateToken(developer.getEmail())
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body,
                                            HttpServletRequest request) {
        String email = body.get("email");
        if (Helper.isNullOrEmpty(email)) {
            return ResponseEntity.badRequest()
                    .body(error("email is required", HttpStatus.BAD_REQUEST, request));
        }

        String normalizedEmail = email.trim().toLowerCase();
        Developer developer = developerService.findByEmail(normalizedEmail);

        // Always return 200 to prevent email enumeration attacks
        if (developer == null) {
            return ResponseEntity.ok(Map.of(
                    "message", "If that email is registered, a reset token has been sent."
            ));
        }

        String resetToken = jwtUtil.generateResetToken(developer.getEmail());
        String resetLink = frontendUrl + "/reset-password?token="
            + URLEncoder.encode(resetToken, StandardCharsets.UTF_8);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(developer.getEmail());
        message.setSubject("MzansiBuilds Password Reset");
        message.setText("Hello " + developer.getName() + ",\n\n"
            + "You requested a password reset for your MzansiBuilds account.\n"
            + "Use the link below to set a new password (valid for 1 hour):\n\n"
            + resetLink + "\n\n"
            + "If you did not request this, you can ignore this email.\n\n"
            + "MzansiBuilds Team");

        mailSender.send(message);

        return ResponseEntity.ok(Map.of(
            "message", "If that email is registered, a reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body,
                                           HttpServletRequest request) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (Helper.isNullOrEmpty(token) || Helper.isNullOrEmpty(newPassword)) {
            return ResponseEntity.badRequest()
                    .body(error("token and newPassword are required", HttpStatus.BAD_REQUEST, request));
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(error("Password must be at least 8 characters", HttpStatus.BAD_REQUEST, request));
        }

        if (!jwtUtil.validateToken(token) || !jwtUtil.isResetToken(token)) {
            return ResponseEntity.badRequest()
                    .body(error("Invalid or expired reset token", HttpStatus.BAD_REQUEST, request));
        }

        String email = jwtUtil.extractSubject(token);
        Developer developer = developerService.findByEmail(email);
        if (developer == null) {
            return ResponseEntity.badRequest()
                    .body(error("Invalid reset token", HttpStatus.BAD_REQUEST, request));
        }

        Developer updated = new Developer.Builder()
                .copy(developer)
                .setPassword(newPassword) // DeveloperService.save() will hash this
                .build();
        developerService.save(updated);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please log in with your new password."));
    }

    private ApiErrorDTO error(String message, HttpStatus status, HttpServletRequest request) {
        return new ApiErrorDTO(message, status.value(), request.getRequestURI());
    }
}