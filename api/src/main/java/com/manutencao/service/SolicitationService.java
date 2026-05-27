package com.manutencao.service;

import com.manutencao.entity.Solicitation;

import com.manutencao.entity.RequestStatus;

import com.manutencao.repository.SolicitationRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitationService {

    @Autowired
    private SolicitationRepository solicitationRepository;

    public Solicitation createSolicitation(Solicitation solicitation) {
        solicitation.setStatus(RequestStatus.OPEN);
        return solicitationRepository.save(solicitation);
    }

    public List<Solicitation> getAllSolicitations() {
        return solicitationRepository.findAll();
    }

    public Optional<Solicitation> getSolicitationById(Long id) {
        return solicitationRepository.findById(id);
    }

    public List<Solicitation> getSolicitationsByClientId(Long clientId) {
        return solicitationRepository.findByClientId(clientId);
    }

    public List<Solicitation> getSolicitationsByStatus(RequestStatus status) {
        return solicitationRepository.findByStatus(status);
    }

    public Solicitation updateSolicitation(Long id, Solicitation solicitationDetails) {
        Solicitation solicitation = solicitationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
        
        solicitation.setEquipmentDescription(solicitationDetails.getEquipmentDescription());
        solicitation.setDefectDescription(solicitationDetails.getDefectDescription());
        
        return solicitationRepository.save(solicitation);
    }

    public Solicitation updateSolicitationStatus(Long id, RequestStatus newStatus) {
        Solicitation solicitation = solicitationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
        
        solicitation.setStatus(newStatus);
        return solicitationRepository.save(solicitation);
    }

    public void deleteSolicitation(Long id) {
        solicitationRepository.deleteById(id);
    }

    public List<Solicitation> getSolicitationsByStatusNotFinalized() {
        return solicitationRepository.findByStatusNot(RequestStatus.FINALIZED);
    }
}
