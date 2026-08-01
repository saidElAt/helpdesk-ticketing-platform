package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.entity.Category;
import com.saidelatmioui.helpdesk.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getEnabledCategories() {
        return categoryRepository.findEnabledCategoriesForDisplay();
    }
}