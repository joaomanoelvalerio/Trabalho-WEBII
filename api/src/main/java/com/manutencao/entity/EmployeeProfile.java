package com.manutencao.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_employee_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProfile;

    @NotNull(message = "O usuário é obrigatório")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false, unique = true)
    private User user;

    @NotBlank(message = "O departamento é obrigatório")
    @Column(nullable = false, length = 100)
    private String department;

    @NotBlank(message = "As especialidades são obrigatórias")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String specialties;

    @NotNull(message = "A data de admissão é obrigatória")
    @Column(nullable = false)
    private LocalDate admissionDate;

    @Column(nullable = true)
    private LocalDate resignationDate;

    @NotNull(message = "O status ativo é obrigatório")
    @Column(nullable = false)
    private Boolean active;

    @NotNull(message = "A permissão de cotação é obrigatória")
    @Column(nullable = false)
    private Boolean canQuote;

    @NotNull(message = "A permissão de manutenção é obrigatória")
    @Column(nullable = false)
    private Boolean canMaintain;

    @NotNull(message = "A permissão de finalização é obrigatória")
    @Column(nullable = false)
    private Boolean canFinalize;

    @NotNull(message = "A permissão de relatório é obrigatória")
    @Column(nullable = false)
    private Boolean canViewReports;

    @Column(nullable = true, length = 500)
    private String observations;

    @Column(nullable = false, updatable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
        if (this.active == null) {
            this.active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }

    public boolean isActiveEmployee() {
        return this.active && this.resignationDate == null;
    }

    /**
     * Verifica se o funcionário está inativo ou foi demitido.
     *
     * @return true se o perfil está inativo ou demitido, false caso contrário
     */

    public boolean isInactiveOrFired() {
        return !this.active || this.resignationDate != null;
    }
    
}