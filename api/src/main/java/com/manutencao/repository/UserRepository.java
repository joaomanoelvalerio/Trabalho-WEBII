package com.manutencao.repository;

import com.manutencao.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCpfUser(String cpfUser);
    Optional<User> findByEmail(String email);
    boolean existsByCpfUser(String cpfUser);
    boolean existsByEmail(String email);
}
