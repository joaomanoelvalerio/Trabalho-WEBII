package com.manutencao.service;

import com.manutencao.entity.Category;

import com.manutencao.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new IllegalArgumentException("Categoria com este nome já existe");
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        
        if (!category.getName().equalsIgnoreCase(categoryDetails.getName()) && 
            categoryRepository.existsByNameIgnoreCaseAndIdNot(categoryDetails.getName(), id)) {
            throw new IllegalArgumentException("Categoria com este nome já existe");
        }
        
        category.setName(categoryDetails.getName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Categoria não encontrada");
        }
        categoryRepository.deleteById(id);
    }

    public boolean existsCategoryByName(String name) {
        return categoryRepository.existsByNameIgnoreCase(name);
    }
}
