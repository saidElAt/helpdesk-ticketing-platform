package com.saidelatmioui.helpdesk.repository;

import com.saidelatmioui.helpdesk.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    @Query("""
            SELECT category
            FROM Category category
            WHERE category.enabled = true
            ORDER BY
                CASE
                    WHEN UPPER(category.name) = 'OTHER' THEN 1
                    ELSE 0
                END,
                category.name ASC
            """)
    List<Category> findEnabledCategoriesForDisplay();
}