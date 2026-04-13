package za.ac.mzansibuilds.dto;

import java.time.LocalDateTime;

public class ApiErrorDTO {

    private final String message;
    private final int status;
    private final String path;
    private final LocalDateTime timestamp;

    public ApiErrorDTO(String message, int status, String path) {
        this.message = message;
        this.status = status;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public String getPath() {
        return path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}