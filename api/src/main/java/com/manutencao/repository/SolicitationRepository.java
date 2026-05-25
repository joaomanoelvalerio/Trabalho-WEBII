package com.manutencao.repository;

import com.manutencao.entity.Solicitation;
import com.manutencao.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitationRepository extends JpaRepository<Solicitation, Long> {
    List<Solicitation> findByClientId(Long clientId);
    List<Solicitation> findByStatus(RequestStatus status);
    List<Solicitation> findByStatusNot(RequestStatus status);
}