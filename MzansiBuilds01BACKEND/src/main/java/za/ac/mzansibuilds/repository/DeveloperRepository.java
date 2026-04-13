package za.ac.mzansibuilds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.mzansibuilds.domain.Developer;

@Repository
public interface DeveloperRepository extends JpaRepository<Developer, String> {

    Developer findByEmail(String email);

    Developer findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}