package com.manutencao.controller;

import com.manutencao.entity.Solicitation;
import com.manutencao.repository.SolicitationRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/solicitations")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class SolicitationController {

    private final SolicitationRepository solicitationRepository;

    public SolicitationController(SolicitationRepository solicitationRepository) {
        this.solicitationRepository = solicitationRepository;
    }

    @GetMapping
    public List<Solicitation> getAll() {
        return solicitationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Solicitation getById(@PathVariable Long id) {
        return solicitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
    }

    @GetMapping("/client/{clientId}")
    public List<Solicitation> getByClient(@PathVariable Long clientId) {
        return solicitationRepository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<Solicitation> create(@Valid @RequestBody Solicitation solicitation) {
        validateRequestText(solicitation);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitationRepository.save(solicitation));
    }

    @PutMapping("/{id}")
    public Solicitation update(@PathVariable Long id, @Valid @RequestBody Solicitation updated) {
        solicitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        validateRequestText(updated);
        updated.setId(id);
        return solicitationRepository.save(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!solicitationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada.");
        }
        solicitationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void validateRequestText(Solicitation solicitation) {
        if (countWords(solicitation.getEquipmentDescription()) < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A descrição do equipamento deve ter pelo menos 3 palavras.");
        }
        if (countWords(solicitation.getDefectDescription()) < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A descrição do defeito deve ter pelo menos 3 palavras.");
        }
    }

    private int countWords(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0;
        }
        return (int) java.util.Arrays.stream(value.trim().split("\\s+"))
                .filter(word -> !word.isBlank())
                .count();
    }
}
