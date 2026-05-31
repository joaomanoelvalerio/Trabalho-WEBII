package com.manutencao.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.manutencao.entity.User;
import com.manutencao.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

   public User createUser(User user) {
        if (userRepository.existsByCpfUser(user.getCpfUser())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        String senhaAleatoria = String.format("%04d", new Random().nextInt(10000));
        
        user.setPassword(senhaAleatoria);
        user.setSalt("gerar_salt_aqui"); 
        User savedUser = userRepository.save(user);
        emailService.enviarSenhaCadastro(savedUser.getEmail(), savedUser.getNameUser(), senhaAleatoria);

        return savedUser;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByCpf(String cpf) {
        return userRepository.findByCpfUser(cpf);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        
        user.setNameUser(userDetails.getNameUser());

        user.setEmail(userDetails.getEmail());

        user.setPhone(userDetails.getPhone());
        
        user.setAddress(userDetails.getAddress());
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
