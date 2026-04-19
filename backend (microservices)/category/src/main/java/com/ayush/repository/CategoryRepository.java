package com.ayush.repository;

import com.ayush.modal.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface CategoryRepository  extends JpaRepository<Category, Long> {
    Set<Category> findBySalonId(Long id);
}
