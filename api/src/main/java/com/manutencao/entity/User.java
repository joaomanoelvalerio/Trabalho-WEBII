package com.manutencao.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "O CPF é obrigatório")
    @Column(unique = true, nullable = false, length = 11)
    private String cpfUser;

    @NotBlank(message = "O nome é obrigatório")
    @Column(unique = true, nullable = false)
    private String nameUser;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    @Column(nullable = false)
    private String email;

    @NotBlank(message = "O telefone é obrigatório")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "O endereço é obrigatório")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "A senha é obrigatória")
    @Column(nullable = false)
    private String password;

    @NotNull(message = "A data de nascimento é obrigatória")
    @Column(nullable = false)
    private LocalDate birthdate;

    @NotNull(message = "O cargo é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}