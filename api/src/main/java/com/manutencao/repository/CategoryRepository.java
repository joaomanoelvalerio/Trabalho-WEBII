package com.manutencao.repository;

import com.manutencao.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
    boolean existsByNameIgnoreCaseAndActiveTrue(String name);
    boolean existsByNameIgnoreCaseAndIdNotAndActiveTrue(String name, Long id);
    Optional<Category> findByIdAndActiveTrue(Long id);
    List<Category> findByActiveTrueOrderByNameAsc();
}
