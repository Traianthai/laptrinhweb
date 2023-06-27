package com.laptrinhweb.library.config;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;


import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@Component
@RequiredArgsConstructor
public class JwtAthFilter extends OncePerRequestFilter{
	
	private final UserRepository customUserRepository;
    private final  JwtUtils jwtUtils;
    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse resp,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = req.getHeader(AUTHORIZATION);
        final String username;
        final String jwtToken;
        if(authHeader == null || !authHeader.startsWith("Bearer")){
            filterChain.doFilter(req, resp);
            return ;
        }
        jwtToken = authHeader.substring(7);
        username = jwtUtils.extractUsername(jwtToken);
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            User customUser = customUserRepository.findUserByUsername(username);
            if(jwtUtils.validateToken(jwtToken, customUser)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(customUser, null, null);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(req, resp);
        }
    }

}
