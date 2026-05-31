package com.manutencao.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarSenhaCadastro(String emailDestino, String nomeUsuario, String senha) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailDestino);
        message.setSubject("Bem-vindo(a)! Seu cadastro foi concluído");
        message.setText("Olá " + nomeUsuario + ",\n\n" +
                "Seu autocadastro no sistema foi realizado com sucesso.\n" +
                "Seu login é o seu e-mail e sua senha temporária é: " + senha + "\n\n" +
                "Recomendamos alterar essa senha no seu primeiro acesso.");
        
        mailSender.send(message);
    }
}