package za.ac.mzansibuilds.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origin-patterns:http://localhost:5173,http://localhost:3000,http://localhost:5174}")
    private String allowedOriginPatternsProperty;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] allowedOriginPatterns = Arrays.stream(allowedOriginPatternsProperty.split(","))
                        .map(String::trim)
                        .filter(value -> !value.isEmpty())
                        .toArray(String[]::new);

                registry.addMapping("/**")
                        .allowedOriginPatterns(allowedOriginPatterns)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}