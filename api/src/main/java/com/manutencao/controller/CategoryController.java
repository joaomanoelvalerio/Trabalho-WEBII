package com.manutencao.controller;

import com.manutencao.entity.Category;

import com.manutencao.repository.CategoryRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoria já cadastrada.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category updated) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(updated.getName(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe outra categoria com esse nome.");
        }

        existing.setName(updated.getName().trim());
        return categoryRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada.");
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}