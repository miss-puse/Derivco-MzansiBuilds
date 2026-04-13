package za.ac.mzansibuilds.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.reset-expiration}")
    private long resetExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    /**
     * Generate a standard access token for the given subject (developer email).
     */
    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Generate a short-lived password-reset token.
     * The token carries a "type=reset" claim so it cannot be used as an access token.
     */
    public String generateResetToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + resetExpiration))
                .claim("type", "reset")
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract the subject (email) from a token.
     */
    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Returns true only when the token has the "type=reset" claim.
     */
    public boolean isResetToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return "reset".equals(claims.get("type"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if the token signature is valid and it has not expired.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
