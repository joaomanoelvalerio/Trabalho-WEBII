package com.manutencao.repository;

import com.manutencao.entity.EmployeeProfile;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {
    Optional<EmployeeProfile> findByUserIdUser(Long userId);
    List<EmployeeProfile> findByActiveTrueOrderByUserNameUserAsc();
    List<EmployeeProfile> findByDepartment(String department);
}
