package com.laptrinhweb.library.controllers;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptrinhweb.library.config.JwtUtils;
import com.laptrinhweb.library.model.Category;
import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.CategoryRepository;
import com.laptrinhweb.library.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping("api/category")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/list")
    public List<Category> Categories() {
    	System.out.println("lissssss");
    	return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Category editCategory(@PathVariable String id) {
        System.out.println((id));
        Category category = new Category();
        if (categoryRepository.existsById(Integer.parseInt(id))) {
            category = categoryRepository.getReferenceById(Integer.parseInt(id));
        }

        return category;
    }//

    @PutMapping("/{id}")
    public ResponseEntity<String> update(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = userRepository.findUserByUsername(username);
        if(customUser.getRoles().equals("ADMIN")){
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> map = (Map<String, Object>) body.get("category");
            map.remove("hibernateLazyInitializer");
            String json = objectMapper.writeValueAsString(map);
            Category category = objectMapper.readValue(json, Category.class);
            category.setSumBook(0L);

            	Category category2 = categoryRepository.findCategoryByCategoryName(category.getCategoryName());
            	if(category2 == null) {
                    categoryRepository.save(category);
                    return ResponseEntity.status(200).body(null);
                }

            return ResponseEntity.status(400).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }

    

    @DeleteMapping("/{id}")
    public ResponseEntity<Category> delete(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws IOException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = userRepository.findUserByUsername(username);
        if(user.getRoles().equals("ADMIN")){
            categoryRepository.deleteById(Integer.parseInt(id));
            return ResponseEntity.status(200).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }
}
