package com.laptrinhweb.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.laptrinhweb.library.model.Book;
import com.laptrinhweb.library.model.Category;




@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
	@Query("SELECT b FROM Book b WHERE b.bookName LIKE %:bookName% AND b.bookAuthor LIKE %:bookAuthor%")
	List<Book> findBooksByNameAndAuthor(@Param("bookName") String bookName, @Param("bookAuthor") String bookAuthor);
    List<Book> findByCategory(Category category);
}
