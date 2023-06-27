package com.laptrinhweb.library.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long 	bookID;
    private String 	bookName;
    private String 	bookAuthor;
    private String 	bookImage;
    private String 	pageNumber;
    private String 	bookDescribe;
    private LocalDate bookDate;
    private int price;
    private String publisher;
    private int soldNumber;
    @ManyToOne
    private Category category;

    public void setBookDate(String bookDate) {
        this.bookDate = LocalDate.parse(bookDate);
    }
}
