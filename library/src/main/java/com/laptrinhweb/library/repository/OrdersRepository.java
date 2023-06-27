package com.laptrinhweb.library.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.laptrinhweb.library.model.Orders;
import com.laptrinhweb.library.model.User;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
//    List<Orders> findByUserId(int userId);
//    List<Orders> findBySent(int sent);
    List<Orders> findByOrderUser(User user);
//    List<Orders> findByBuyAndOptions(int buy, String options);
//    List<Orders> findByBuyGreaterThanAndOptions(int buy, String options);
}
