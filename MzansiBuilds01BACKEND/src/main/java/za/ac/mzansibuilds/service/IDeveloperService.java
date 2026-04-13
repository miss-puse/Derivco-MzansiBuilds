package za.ac.mzansibuilds.service;

import za.ac.mzansibuilds.domain.Developer;
import java.util.List;

public interface IDeveloperService extends IService<Developer, String> {

    Developer findByEmail(String email);
}