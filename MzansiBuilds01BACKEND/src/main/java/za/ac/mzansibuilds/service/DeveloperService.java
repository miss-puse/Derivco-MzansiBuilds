package za.ac.mzansibuilds.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.mzansibuilds.domain.Developer;
import za.ac.mzansibuilds.repository.DeveloperRepository;

import java.util.List;

@Service
public class DeveloperService implements IDeveloperService {

    private final DeveloperRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DeveloperService(DeveloperRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Developer save(Developer entity) {
        entity = normalizeEmail(entity);
        entity = encodePasswordIfNeeded(entity);
        return repository.save(entity);
    }

    @Override
    public Developer update(Developer entity) {
        entity = normalizeEmail(entity);
        entity = encodePasswordIfNeeded(entity);
        return repository.save(entity);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Developer read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Developer> findAll() {
        return repository.findAll();
    }

    @Override
    public Developer findByEmail(String email) {
        String normalizedEmail = normalizeEmailValue(email);
        if (normalizedEmail == null) {
            return null;
        }
        return repository.findByEmailIgnoreCase(normalizedEmail);
    }

    public boolean existsByEmail(String email) {
        String normalizedEmail = normalizeEmailValue(email);
        return normalizedEmail != null && repository.existsByEmailIgnoreCase(normalizedEmail);
    }

    private Developer normalizeEmail(Developer developer) {
        if (developer == null) {
            return null;
        }

        String normalizedEmail = normalizeEmailValue(developer.getEmail());
        if (normalizedEmail == null || normalizedEmail.equals(developer.getEmail())) {
            return developer;
        }

        return new Developer.Builder()
                .copy(developer)
                .setEmail(normalizedEmail)
                .build();
    }

    private String normalizeEmailValue(String email) {
        if (email == null) {
            return null;
        }

        String normalized = email.trim().toLowerCase();
        return normalized.isEmpty() ? null : normalized;
    }

    private Developer encodePasswordIfNeeded(Developer developer) {
        if (developer == null) {
            return null;
        }

        String password = developer.getPassword();

        if (password == null || password.isBlank() || isBcryptHash(password)) {
            return developer;
        }

        return new Developer.Builder()
                .copy(developer)
                .setPassword(passwordEncoder.encode(password))
                .build();
    }

    private boolean isBcryptHash(String value) {
        return value.matches("^\\$2[aby]\\$.{56}$");
    }
}