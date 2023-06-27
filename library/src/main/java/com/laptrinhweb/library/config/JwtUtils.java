package com.laptrinhweb.library.config;

import org.springframework.stereotype.Component;

import com.laptrinhweb.library.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {
    private String SECRET_KEY = "db922620-35e8-4a1e-b6da-db1e28f10a64";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(User customUser) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, customUser);
    }

    private String createToken(Map<String, Object> claims, User customUser) {
        return Jwts.builder().setClaims(claims)
        		.setSubject(customUser.getUsername())
        		.setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact();
    }

    public Boolean validateToken(String token, User customUser) {
        final String username = extractUsername(token);
        return (username.equals(customUser.getUsername()) && !isTokenExpired(token));
    }
}
