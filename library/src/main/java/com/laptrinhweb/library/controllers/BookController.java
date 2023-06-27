package com.laptrinhweb.library.controllers;


import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptrinhweb.library.config.JwtUtils;
import com.laptrinhweb.library.model.Book;
import com.laptrinhweb.library.model.Category;
import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.BookRepository;
import com.laptrinhweb.library.repository.CategoryRepository;
import com.laptrinhweb.library.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequestMapping("/api/book")
public class BookController {
	@Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository customUserRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/list")
    public List<Book> Books() throws IOException {
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable String id) {
        Book book = new Book();
        if (bookRepository.existsById(Integer.parseInt(id))) {
            book = bookRepository.getById(Integer.parseInt(id));
        }
        return book;
    }

    @GetMapping("/category")
    public List<Book> getBooksOfCategory(@PathVariable String id, Map<String, Object> req) {
        Category category = (Category) req.get("Category");
        List<Book> books = bookRepository.findByCategory(category);
        return books;
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> save(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
        	Map<String, Object> obj = (Map<String, Object>)  body.get("book");
        	obj.remove("hibernateLazyInitializer");
        	String json = objectMapper.writeValueAsString(obj);
        	Book book = objectMapper.readValue(json, Book.class);
        	List<Book> list = bookRepository.findBooksByNameAndAuthor(book.getBookName(),book.getBookAuthor());
        	for (Book book2 : list) {
        		System.out.println("---"+book2);
        	}
        	if(user.getRoles().equals("ADMIN") && list.isEmpty()){
        		Category category = categoryRepository.getReferenceById(book.getCategory().getCategoryID());
        		category.setSumBook(category.getSumBook() + 1);
        		categoryRepository.save(category);
        		bookRepository.save(book);
        		System.out.println(book);
        		System.out.println(category);
        		return ResponseEntity.status(200).body(null);
        	}
        }catch(Exception e) {
        	return ResponseEntity.status(200).body("Định dạng không phù hợp!");
        }
        return ResponseEntity.status(400).body(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        System.out.println(username);
        if(customUser.getRoles().equals("ADMIN")){
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> obj = (Map<String, Object>)  body.get("book");
            obj.remove("hibernateLazyInitializer");
            String json = objectMapper.writeValueAsString(obj);
            Book book = objectMapper.readValue(json, Book.class);
            Book oldBook = bookRepository.getReferenceById(Integer.parseInt(book.getBookID().toString()));
            if(oldBook.getCategory().getCategoryID() != book.getCategory().getCategoryID()){
                Category category1 = categoryRepository.getReferenceById(oldBook.getCategory().getCategoryID());
                Category category2 = categoryRepository.getReferenceById(book.getCategory().getCategoryID());
                category1.setSumBook(category1.getSumBook() - 1);
                category2.setSumBook(category2.getSumBook() + 1);
                categoryRepository.save(category1);
                categoryRepository.save(category2);
            }
            bookRepository.save(book);
            return ResponseEntity.status(200).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> DeleteBook(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ) {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        if(customUser.getRoles().equals("ADMIN")){
        	try {
    		Book oldBook = bookRepository.getReferenceById(Integer.parseInt(id));
    		Category category1 = categoryRepository.getReferenceById(oldBook.getCategory().getCategoryID());
    		category1.setSumBook(category1.getSumBook() - 1);
    		categoryRepository.save(category1);
            bookRepository.deleteById(Integer.parseInt(id));
            System.out.println("xoá " + id);
            	return ResponseEntity.status(200).body(null);
        	}catch (Exception e) {
        		return ResponseEntity.status(400).body(null);
			}
        }
        return ResponseEntity.status(400).body(null);
    }
    @PostMapping("/image")
    public ResponseEntity<String> upload(
            @RequestParam("image") MultipartFile image,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        if (user.getRoles().equals("ADMIN")){
            try {
                String fileName = image.getOriginalFilename();
                if (!fileName.equals("")) {
                    fileName = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()) + "_"+fileName;
                    byte[] bytes = image.getBytes();
                    Path path = Paths.get("D:\\ki6\\laptrinhweb\\BTL\\library_fe\\public\\images\\" + fileName);
//                    Path path = Paths.get("..\\BTL\\library\\library\\src\\main\\resources\\static\\images\\" + fileName);
                    FileOutputStream fos = new FileOutputStream(path.toString());
                    fos.write(bytes);
                    fos.close();
                    String url = path.toString();
                    System.out.println(resp);
                    return ResponseEntity.status(200).body(fileName);
                }
            } catch (Exception e) {
                e.printStackTrace();
            };
        }
        return ResponseEntity.status(400).body(null);
    }
}
