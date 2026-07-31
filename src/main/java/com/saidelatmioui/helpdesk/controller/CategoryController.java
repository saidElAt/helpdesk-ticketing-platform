package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.entity.Category;
import com.saidelatmioui.helpdesk.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getEnabledCategories() {
        return ResponseEntity.ok(
                categoryService.getEnabledCategories()
        );
    }
}