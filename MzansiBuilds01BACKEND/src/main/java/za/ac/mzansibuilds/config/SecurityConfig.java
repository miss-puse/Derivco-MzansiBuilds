package za.ac.mzansibuilds.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import za.ac.mzansibuilds.util.JwtUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            // Allow H2 console frames in dev
            .headers().frameOptions().sameOrigin()
            .and()
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .antMatchers(HttpMethod.POST,
                    "/mzansi/developers/register",
                    "/mzansi/developers/login",
                    "/mzansi/developers/forgot-password",
                    "/mzansi/developers/reset-password"
                ).permitAll()
                // Public read-only endpoints (for Feed, CelebrationWall, ProjectDetail)
                .antMatchers(HttpMethod.GET,
                    "/mzansi/projects/**",
                    "/mzansi/developers/find/**",
                    "/mzansi/developers/all",
                    "/comment/**",
                    "/mzansi/progress/**"
                ).permitAll()
                // H2 web console — development only
                .antMatchers("/h2-console/**").permitAll()
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}