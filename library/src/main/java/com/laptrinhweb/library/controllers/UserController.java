package com.laptrinhweb.library.controllers;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptrinhweb.library.config.JwtUtils;
import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@CrossOrigin
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository customUserRepository;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody Map<String, Object> req
    ) {
        String username = (String) req.get("username");
        String password = (String) req.get("password");
        System.out.println(username + " " + password);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        final User user = customUserRepository.findUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(jwtUtils.generateToken(user));
        }
        return ResponseEntity.status(400).body("error");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody Map<String, Object> req
    ) {
        if (customUserRepository.findUserByUsername((String) req.get("username")) == null && 
        		customUserRepository.findUserByEmail((String) req.get("email")) == null) {
            User user = new User();
            user.setUsername((String)req.get("username"));
            user.setPassword((String)req.get("password"));
            user.setEmail((String) req.get("email"));
            user.setRoles((String) req.get("roles"));
            user.setAddress(" ");
            user.setFirstName(" ");
            user.setAddress(" ");
            user.setLastName(" ");
            customUserRepository.save(user);
            return ResponseEntity.status(200).body("success");
        }
        return ResponseEntity.status(400).body("error");
    }

    @PostMapping("/{id}")
    public User user (
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        if(customUser.getRoles().equals("ADMIN")){
            User customUser1 = new User();
            if(customUserRepository.existsById(Integer.parseInt((id)))){
                customUser1 = customUserRepository.getReferenceById(Integer.parseInt(id));
            }
            return customUser1;
        }
        return null;
    }

    @PostMapping("/info")
    public User Info(
            HttpServletResponse resp,
            HttpServletRequest req
    ) {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        if(customUser != null){
            return customUser;
        }
        return null;
    }
    @PostMapping("/list")
    public List<User> listUser(
            HttpServletResponse resp,
            HttpServletRequest req
    ) {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        System.out.println("heloooooo");
        if (customUser.getRoles().equals("ADMIN")){
            return  customUserRepository.findAll();
        }
        return null;
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> saveCustomUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUserReq = customUserRepository.findUserByUsername(username);
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> obj = (Map<String, Object>) body.get("user");
        obj.remove("hibernateLazyInitializer");
        String json = objectMapper.writeValueAsString(obj);
        User customUser = objectMapper.readValue(json, User.class);
        if (customUserReq.getRoles().equals("ADMIN") || customUserReq.getUsername().equals(customUser.getUsername())){
            User customUser1 = customUserRepository.findUserByUsername(customUser.getUsername());
            customUserRepository.save(customUser);
            return ResponseEntity.status(200).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }
    
    @DeleteMapping("/{id}")
    public  ResponseEntity<String> deleteUser(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        if (customUser.getRoles().equals("ADMIN")){
            customUserRepository.deleteById(Integer.parseInt(id));
            return ResponseEntity.status(200).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }
}
