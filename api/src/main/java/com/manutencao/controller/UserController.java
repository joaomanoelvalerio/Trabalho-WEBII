package com.manutencao.controller;

import com.manutencao.entity.Endereco;
import com.manutencao.entity.Role;
import com.manutencao.entity.User;
import com.manutencao.repository.UserRepository;
import com.manutencao.util.PasswordUtil;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/employees")
    public List<UserDto> getEmployees() {
        return userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getActive()))
                .filter(u -> u.getRole() == Role.EMPLOYEE || u.getRole() == Role.ADMIN)
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/register-client")
    public ResponseEntity<RegisterClientResponse> registerClient(@RequestBody RegisterClientRequest request) {
        requireNotBlank(request.name, "Nome é obrigatório.");
        requireNotBlank(request.email, "E-mail é obrigatório.");
        requireNotBlank(request.cpf, "CPF é obrigatório.");
        requireNotBlank(request.phone, "Telefone é obrigatório.");
        if (request.address == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço é obrigatório.");
        }

        String cpf = digitsOnly(request.cpf);
        if (cpf.length() != 11) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CPF inválido.");
        }
        if (userRepository.existsByCpfUser(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado.");
        }
        if (userRepository.existsByEmail(request.email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        String tempPassword = String.valueOf(ThreadLocalRandom.current().nextInt(1000, 10000));
        String salt = PasswordUtil.generateSalt();
        String hashedPassword = PasswordUtil.hash(tempPassword, salt);

        User user = User.builder()
                .cpfUser(cpf)
                .nameUser(request.name.trim())
                .email(request.email.trim().toLowerCase())
                .phone(request.phone.trim())
                .address(toEndereco(request.address))
                .password(hashedPassword)
                .salt(salt)
                .birthdate(parseOptionalDate(request.birthDate))
                .role(Role.CLIENT)
                .active(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterClientResponse(true, tempPassword));
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        requireNotBlank(request.email, "E-mail é obrigatório.");
        requireNotBlank(request.password, "Senha é obrigatória.");

        User user = userRepository.findByEmail(request.email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos."));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário inativo.");
        }

        String hashedInput = PasswordUtil.hash(request.password, user.getSalt());
        if (!hashedInput.equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
        }

        return new LoginResponse(true, toDto(user));
    }

    @PostMapping("/employees")
    public ResponseEntity<UserDto> createEmployee(@RequestBody EmployeeRequest request) {
        requireNotBlank(request.name, "Nome é obrigatório.");
        requireNotBlank(request.email, "E-mail é obrigatório.");
        requireNotBlank(request.password, "Senha é obrigatória.");
        requireNotBlank(request.birthDate, "Data de nascimento é obrigatória.");

        String email = request.email.trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        String salt = PasswordUtil.generateSalt();
        String hashedPassword = PasswordUtil.hash(request.password.trim(), salt);

        User user = User.builder()
                .nameUser(request.name.trim())
                .email(email)
                .password(hashedPassword)
                .salt(salt)
                .birthdate(parseRequiredDate(request.birthDate, "Data de nascimento inválida."))
                .role(Role.EMPLOYEE)
                .active(true)
                .build();

        user = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(user));
    }

    @PutMapping("/employees/{id}")
    public UserDto updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        if (user.getRole() != Role.EMPLOYEE && user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário informado não é funcionário.");
        }

        requireNotBlank(request.name, "Nome é obrigatório.");
        requireNotBlank(request.email, "E-mail é obrigatório.");
        requireNotBlank(request.birthDate, "Data de nascimento é obrigatória.");

        String email = request.email.trim().toLowerCase();
        if (userRepository.existsByEmailAndIdUserNot(email, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado por outro usuário.");
        }

        user.setNameUser(request.name.trim());
        user.setEmail(email);
        user.setBirthdate(parseRequiredDate(request.birthDate, "Data de nascimento inválida."));

        if (!isBlank(request.password)) {
            String salt = PasswordUtil.generateSalt();
            user.setSalt(salt);
            user.setPassword(PasswordUtil.hash(request.password.trim(), salt));
        }

        return toDto(userRepository.save(user));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deactivateEmployee(@PathVariable Long id, @RequestParam Long loggedUserId) {
        if (id.equals(loggedUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode remover seu próprio usuário.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        if (user.getRole() != Role.EMPLOYEE && user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário informado não é funcionário.");
        }

        long activeEmployees = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getActive()))
                .filter(u -> u.getRole() == Role.EMPLOYEE || u.getRole() == Role.ADMIN)
                .count();

        if (activeEmployees <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível remover o único funcionário.");
        }

        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.id = user.getIdUser();
        dto.cpf = user.getCpfUser() == null ? "" : user.getCpfUser();
        dto.name = user.getNameUser();
        dto.email = user.getEmail();
        dto.phone = user.getPhone() == null ? "" : user.getPhone();
        dto.role = user.getRole().name();
        dto.address = toAddressDto(user.getAddress());
        dto.birthDate = user.getBirthdate() == null ? null : user.getBirthdate().toString();
        dto.active = Boolean.TRUE.equals(user.getActive());
        return dto;
    }

    private AddressDto toAddressDto(Endereco endereco) {
        AddressDto dto = new AddressDto();
        if (endereco == null) {
            dto.zipCode = ""; dto.street = ""; dto.number = "";
            dto.complement = ""; dto.neighborhood = ""; dto.city = ""; dto.state = "";
            return dto;
        }
        dto.zipCode      = nullToEmpty(endereco.getCep());
        dto.street       = nullToEmpty(endereco.getRua());
        dto.number       = nullToEmpty(endereco.getNumero());
        dto.complement   = nullToEmpty(endereco.getComplemento());
        dto.neighborhood = nullToEmpty(endereco.getBairro());
        dto.city         = nullToEmpty(endereco.getCidade());
        dto.state        = nullToEmpty(endereco.getEstado());
        return dto;
    }

    private Endereco toEndereco(AddressDto dto) {
        requireNotBlank(dto.zipCode,      "CEP é obrigatório.");
        requireNotBlank(dto.street,       "Rua é obrigatória.");
        requireNotBlank(dto.number,       "Número é obrigatório.");
        requireNotBlank(dto.neighborhood, "Bairro é obrigatório.");
        requireNotBlank(dto.city,         "Cidade é obrigatória.");
        requireNotBlank(dto.state,        "Estado é obrigatório.");
        return new Endereco(
                dto.zipCode.trim(), dto.street.trim(), dto.number.trim(),
                dto.neighborhood.trim(), dto.city.trim(),
                dto.state.trim().toUpperCase(),
                dto.complement == null ? "" : dto.complement.trim()
        );
    }

    private String digitsOnly(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private LocalDate parseOptionalDate(String date) {
        if (isBlank(date)) return null;
        return parseRequiredDate(date, "Data de nascimento inválida.");
    }

    private LocalDate parseRequiredDate(String date, String errorMessage) {
        try {
            return LocalDate.parse(date.trim());
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }
    }

    private void requireNotBlank(String value, String message) {
        if (isBlank(value)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    // ── DTOs e inner classes ──────────────────────────────────────────────────

    public static class AddressDto {
        public String zipCode, street, number, complement, neighborhood, city, state;
    }

    public static class UserDto {
        public Long id;
        public String cpf, name, email, phone, role, birthDate;
        public AddressDto address;
        public Boolean active;
    }

    public static class RegisterClientRequest {
        public String name, email, cpf, phone, birthDate;
        public AddressDto address;
    }

    public static class RegisterClientResponse {
        public boolean success;
        public String temporaryPassword;
        public RegisterClientResponse(boolean success, String temporaryPassword) {
            this.success = success;
            this.temporaryPassword = temporaryPassword;
        }
    }

    public static class LoginRequest {
        public String email, password;
    }

    public static class LoginResponse {
        public boolean success;
        public UserDto user;
        public LoginResponse(boolean success, UserDto user) {
            this.success = success;
            this.user = user;
        }
    }

    public static class EmployeeRequest {
        public String name, email, password, birthDate;
    }
}