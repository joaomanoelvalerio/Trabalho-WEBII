package com.manutencao.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    @Column(unique = true, length = 11)
    private String cpfUser;

    @Column(nullable = false)
    private String nameUser;

    @Email(message = "O e-mail deve ser válido")
    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 20)
    private String phone;

    @Embedded
    private Endereco address;

    @Column(nullable = false)
    private String password;

    @Column
    private LocalDate birthdate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
