package com.laptrinhweb.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.laptrinhweb.library.model.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findCategoryByCategoryName(String categoryName);
}
