package com.laptrinhweb.library.controllers;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.util.Comparator;
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
import com.laptrinhweb.library.model.Book;
import com.laptrinhweb.library.model.Orders;
import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.BookRepository;
import com.laptrinhweb.library.repository.OrdersRepository;
import com.laptrinhweb.library.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;
import java.text.SimpleDateFormat;
@RestController
@CrossOrigin
@RequestMapping("api/order")
public class OrderController {
    @Autowired
    private UserRepository customUserRepository;
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private JwtUtils jwtUtils;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @ToString
    private static class OrderReq{
    	public String bookNumber;
    	public int bookID;
    }
    @GetMapping("/list")
    public List<Orders> ordersList (
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        System.out.println("Hello"+user.toString());
        if (user.getRoles().equals("ADMIN")){
            List<Orders> ordersList = ordersRepository.findAll();
            return ordersList;
        }
        return null;
    }
    @GetMapping("/list-user")
    public List<Orders> ordersListUser (
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        System.out.println(user.toString());
        List<Orders> ordersList = 
        		ordersRepository.findByOrderUser(user);
        return ordersList;
    
    }
    @GetMapping("/{id}")
    public  Orders orders(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        Orders orders = ordersRepository.getReferenceById(Integer.parseInt(id));
        User customUserOrder = customUserRepository.getReferenceById(orders.getOrderUser().getUserId());
        System.out.println(orders);
        if(customUserOrder.getUsername().equals(username) || customUser.getRoles().equals("ADMIN")){
            return orders;
        }
        return null;
    }
    @PostMapping("/rate/{id}")
    public  ResponseEntity<String>  rate(
    		@RequestBody Map<String, Object> body,
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException{
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        System.out.println(customUser.toString());
        if(customUser.getRoles().equals("USER")){
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> obj = (Map<String, Object>) body.get("orderRate");
            obj.remove("hibernateLazyInitializer");
            String json = objectMapper.writeValueAsString(obj);
            System.out.println(json);
            Orders orderReq = objectMapper.readValue(json, Orders.class);
            
            Orders orders = ordersRepository.getReferenceById(Integer.parseInt(id));
            orders.setComment(orderReq.getComment());
            orders.setStart(orderReq.getStart());
            System.out.println(orders);
            ordersRepository.save(orders);
            return ResponseEntity.status(200).body(null);
        }
        return ResponseEntity.status(400).body(null);
    }
    @PostMapping("/new")
    public ResponseEntity<String> save (
            @RequestBody Map<String, Object> body,
            HttpServletResponse resp,
            HttpServletRequest req
    ) throws JsonProcessingException {
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        System.out.println(customUser.toString());
        if(customUser.getRoles().equals("USER")){
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> obj = (Map<String, Object>) body.get("order");
            obj.remove("hibernateLazyInitializer");
            String json = objectMapper.writeValueAsString(obj);
            System.out.println(json);
            OrderReq orderReq = objectMapper.readValue(json, OrderReq.class);
            Book book = bookRepository.getById(orderReq.bookID);
            Orders orders = new Orders();
            orders.setBookNumber(Integer.parseInt(orderReq.bookNumber));
            orders.setOrderBook(book);
            orders.setStatus(0);
            orders.setComment("");
            orders.setOrderUser(customUser);
            Date date = new Date();
            orders.setOrderDate(new SimpleDateFormat("yyyy-MM-dd").format(date));
            System.out.println(orders);
            ordersRepository.save(orders);
            return ResponseEntity.status(200).body(orders.getOrderId()+"");
        }
        return ResponseEntity.status(400).body(null);
    }
    
    @PutMapping("/{id}")
    public  Orders update(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        Orders orders = ordersRepository.getReferenceById(Integer.parseInt(id));
        Book book = bookRepository.getById(orders.getOrderBook().getBookID().intValue());
        book.setSoldNumber(book.getSoldNumber()+1);
        bookRepository.save(book);
        if(user.getRoles().equals("ADMIN")){
        	if(orders.getStatus() == 0) orders.setStatus(1);
        	ordersRepository.save(orders);
            return orders;
        }
        return null;
    }
    @PostMapping("/{id}")
    public  Orders buy(
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User user = customUserRepository.findUserByUsername(username);
        Orders orders = ordersRepository.getReferenceById(Integer.parseInt(id));
      
    	if(orders.getStatus() == 1) orders.setStatus(2);
    	ordersRepository.save(orders);
        return orders;
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<String> delete (
            @PathVariable String id,
            HttpServletResponse resp,
            HttpServletRequest req
    ){
        final String authHeader =  req.getHeader(AUTHORIZATION);
        String jwtToken = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwtToken);
        User customUser = customUserRepository.findUserByUsername(username);
        ordersRepository.deleteById(Integer.parseInt(id));
        return ResponseEntity.status(200).body(null);
    }
}
