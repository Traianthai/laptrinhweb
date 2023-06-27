package com.laptrinhweb.library.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@Entity
@ToString
public class Orders {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderId;
    @ManyToOne
    private User orderUser;
    @ManyToOne
    private Book orderBook;
    private LocalDate orderDate;
    private int bookNumber;
    private int status;
    private String comment;
    private int start;
    public void setOrderDate(String orderDate) {
        if (orderDate != null){
            this.orderDate = LocalDate.parse(orderDate);
        }
    }

}
