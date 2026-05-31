package com.manutencao.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarSenhaCadastro(String emailDestino, String nomeUsuario, String senha) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailUsername, "Manutenção de Equipamentos");
            helper.setTo(emailDestino);
            helper.setSubject("Bem-vindo(a)! Seu cadastro foi concluído");
            helper.setText(
                "Olá " + nomeUsuario + ",\n\n" +
                "Seu autocadastro no sistema foi realizado com sucesso.\n" +
                "Seu login é o seu e-mail e sua senha temporária é: " + senha + "\n\n"
            );
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }
}