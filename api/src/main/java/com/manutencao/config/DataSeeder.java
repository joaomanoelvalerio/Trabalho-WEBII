package com.manutencao.config;

import com.manutencao.entity.Category;
import com.manutencao.entity.Endereco;
import com.manutencao.entity.HistoryEntry;
import com.manutencao.entity.RequestStatus;
import com.manutencao.entity.Role;
import com.manutencao.entity.Solicitation;
import com.manutencao.entity.User;
import com.manutencao.repository.CategoryRepository;
import com.manutencao.repository.SolicitationRepository;
import com.manutencao.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SolicitationRepository solicitationRepository;

    public DataSeeder(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            SolicitationRepository solicitationRepository
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.solicitationRepository = solicitationRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategories();
        seedSolicitations();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        List<User> users = new ArrayList<>();
        users.add(User.builder()
                .nameUser("Maria Silva")
                .email("maria@empresa.com")
                .password("1234")
                .cpfUser("11111111111")
                .phone("(41) 99999-0001")
                .address(new Endereco("80000-000", "Rua das Flores", "100", "Centro", "Curitiba", "PR", ""))
                .birthdate(LocalDate.parse("1990-05-10"))
                .role(Role.EMPLOYEE)
                .active(true)
                .build());
        users.add(User.builder()
                .nameUser("Mário Santos")
                .email("mario@empresa.com")
                .password("1234")
                .cpfUser("22222222222")
                .phone("(41) 99999-0002")
                .address(new Endereco("80000-001", "Av. Paraná", "200", "Batel", "Curitiba", "PR", ""))
                .birthdate(LocalDate.parse("1988-03-22"))
                .role(Role.EMPLOYEE)
                .active(true)
                .build());
        users.add(User.builder()
                .nameUser("João Oliveira")
                .email("joao@email.com")
                .password("1234")
                .cpfUser("33333333333")
                .phone("(41) 98888-0001")
                .address(new Endereco("80010-000", "Rua XV de Novembro", "300", "Centro", "Curitiba", "PR", "Apto 5"))
                .birthdate(LocalDate.parse("1995-07-15"))
                .role(Role.CLIENT)
                .active(true)
                .build());
        users.add(User.builder()
                .nameUser("José Pereira")
                .email("jose@email.com")
                .password("1234")
                .cpfUser("44444444444")
                .phone("(41) 98888-0002")
                .address(new Endereco("80020-000", "Rua Marechal Deodoro", "400", "Centro", "Curitiba", "PR", ""))
                .birthdate(LocalDate.parse("1992-11-30"))
                .role(Role.CLIENT)
                .active(true)
                .build());
        users.add(User.builder()
                .nameUser("Joana Costa")
                .email("joana@email.com")
                .password("1234")
                .cpfUser("55555555555")
                .phone("(41) 98888-0003")
                .address(new Endereco("80030-000", "Rua Emiliano Perneta", "500", "Centro", "Curitiba", "PR", "Casa"))
                .birthdate(LocalDate.parse("1998-01-08"))
                .role(Role.CLIENT)
                .active(true)
                .build());
        users.add(User.builder()
                .nameUser("Joaquina Ferreira")
                .email("joaquina@email.com")
                .password("1234")
                .cpfUser("66666666666")
                .phone("(41) 98888-0004")
                .address(new Endereco("80040-000", "Rua Ébano Pereira", "600", "Centro", "Curitiba", "PR", ""))
                .birthdate(LocalDate.parse("2000-09-25"))
                .role(Role.CLIENT)
                .active(true)
                .build());

        userRepository.saveAll(users);
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }

        categoryRepository.saveAll(List.of(
                createCategory("Notebook"),
                createCategory("Desktop"),
                createCategory("Impressora"),
                createCategory("Teclado"),
                createCategory("Mouse")
        ));
    }

    private Category createCategory(String name) {
        Category category = new Category(name);
        category.setActive(true);
        return category;
    }

    private void seedSolicitations() {
        if (solicitationRepository.count() > 0) {
            return;
        }

        User maria = userRepository.findByEmail("maria@empresa.com").orElse(null);
        User mario = userRepository.findByEmail("mario@empresa.com").orElse(null);
        User joao = userRepository.findByEmail("joao@email.com").orElse(null);
        User jose = userRepository.findByEmail("jose@email.com").orElse(null);
        User joana = userRepository.findByEmail("joana@email.com").orElse(null);
        User joaquina = userRepository.findByEmail("joaquina@email.com").orElse(null);
        if (maria == null || mario == null || joao == null || jose == null || joana == null || joaquina == null) {
            return;
        }

        List<Solicitation> solicitations = new ArrayList<>();
        solicitations.add(buildOpen(joao, "Dell Inspiron - Tela trincada", 1L, "Notebook", "Tela com trincas após queda no chão.", "2024-03-01T10:00:00"));
        solicitations.add(buildQuoted(joao, mario, "HP LaserJet - Atolamento de papel", 3L, "Impressora", "Papel prende toda vez que tenta imprimir.", "2024-03-02T14:30:00", 350.0, "2024-03-03T09:00:00"));
        solicitations.add(buildApproved(jose, mario, "Desktop Gamer - Não liga", 2L, "Desktop", "Computador não liga após queda de energia.", "2024-03-03T09:00:00", 580.0, "2024-03-04T08:00:00", "2024-03-04T16:00:00"));
        solicitations.add(buildFixed(jose, maria, "Monitor LG - Tela piscando", 2L, "Desktop", "Tela pisca constantemente ao ligar.", "2024-03-04T11:00:00", 200.0, "2024-03-05T08:30:00", "2024-03-07T14:00:00"));
        solicitations.add(buildRejected(joao, mario, "Teclado Mecânico - Teclas travando", 4L, "Teclado", "Diversas teclas travando ao digitar.", "2024-03-05T16:00:00", 450.0, "2024-03-06T09:00:00", "Valor muito alto para o equipamento.", "2024-03-06T11:00:00"));
        solicitations.add(buildPaid(joana, maria, "Notebook Lenovo - Bateria não carrega", 1L, "Notebook", "Bateria não segura carga há 2 semanas.", "2024-03-06T08:00:00", 320.0, "2024-03-07T09:00:00", "2024-03-09T15:00:00", "2024-03-10T10:00:00"));
        solicitations.add(buildFinalized(joana, mario, "Mouse Logitech - Clique duplo", 5L, "Mouse", "Botão esquerdo ativa clique duplo com um clique.", "2024-03-08T10:00:00", 120.0, "2024-03-09T08:00:00", "2024-03-11T11:00:00", "2024-03-11T14:00:00", "2024-03-12T09:00:00"));
        solicitations.add(buildRedirected(joaquina, maria, mario, "Desktop Dell - Superaquecimento", 2L, "Desktop", "Computador desliga sozinho por superaquecimento.", "2024-03-10T09:00:00", 260.0, "2024-03-11T08:30:00", "2024-03-11T14:00:00"));

        solicitationRepository.saveAll(solicitations);
    }

    private Solicitation buildOpen(User client, String equipment, Long categoryId, String categoryName, String defect, String openedAt) {
        Solicitation s = new Solicitation();
        s.setClientId(client.getIdUser());
        s.setClientName(client.getNameUser());
        s.setEquipmentDescription(equipment);
        s.setCategoryId(categoryId);
        s.setCategoryName(categoryName);
        s.setDefectDescription(defect);
        s.setStatus(RequestStatus.OPEN);
        s.setOpenedAt(openedAt);
        s.setHistory(new ArrayList<>(List.of(history(openedAt, null, RequestStatus.OPEN, null, null, "Solicitação aberta pelo cliente"))));
        return s;
    }

    private Solicitation buildQuoted(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt) {
        Solicitation s = buildOpen(client, equipment, categoryId, categoryName, defect, openedAt);
        s.setStatus(RequestStatus.QUOTED);
        s.setQuoteValue(quoteValue);
        s.setQuotedByEmployeeId(employee.getIdUser());
        s.setQuotedByEmployeeName(employee.getNameUser());
        s.setQuotedAt(quotedAt);
        s.getHistory().add(history(quotedAt, RequestStatus.OPEN, RequestStatus.QUOTED, employee.getIdUser(), employee.getNameUser(), "Orçamento de R$ " + formatMoney(quoteValue)));
        return s;
    }

    private Solicitation buildApproved(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String approvedAt) {
        Solicitation s = buildQuoted(client, employee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt);
        s.setStatus(RequestStatus.APPROVED);
        s.getHistory().add(history(approvedAt, RequestStatus.QUOTED, RequestStatus.APPROVED, null, null, "Cliente aprovou o orçamento"));
        return s;
    }

    private Solicitation buildFixed(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String fixedAt) {
        Solicitation s = buildApproved(client, employee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt, quotedAt);
        s.setStatus(RequestStatus.FIXED);
        s.setMaintenanceDescription("Manutenção concluída.");
        s.setClientOrientations("Orientações básicas de uso.");
        s.setMaintainedByEmployeeId(employee.getIdUser());
        s.setMaintainedByEmployeeName(employee.getNameUser());
        s.setMaintainedAt(fixedAt);
        s.getHistory().add(history(fixedAt, RequestStatus.APPROVED, RequestStatus.FIXED, employee.getIdUser(), employee.getNameUser(), "Manutenção concluída"));
        return s;
    }

    private Solicitation buildRejected(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String reason, String rejectedAt) {
        Solicitation s = buildQuoted(client, employee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt);
        s.setStatus(RequestStatus.REJECTED);
        s.setRejectionReason(reason);
        s.getHistory().add(history(rejectedAt, RequestStatus.QUOTED, RequestStatus.REJECTED, null, null, "Rejeitado: " + reason));
        return s;
    }

    private Solicitation buildPaid(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String fixedAt, String paidAt) {
        Solicitation s = buildFixed(client, employee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt, fixedAt);
        s.setStatus(RequestStatus.PAID);
        s.setPaidAt(paidAt);
        s.getHistory().add(history(paidAt, RequestStatus.FIXED, RequestStatus.PAID, null, null, "Pagamento efetuado"));
        return s;
    }

    private Solicitation buildFinalized(User client, User employee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String fixedAt, String paidAt, String finalizedAt) {
        Solicitation s = buildPaid(client, employee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt, fixedAt, paidAt);
        s.setStatus(RequestStatus.FINALIZED);
        s.setFinalizedByEmployeeId(employee.getIdUser());
        s.setFinalizedByEmployeeName(employee.getNameUser());
        s.setFinalizedAt(finalizedAt);
        s.getHistory().add(history(finalizedAt, RequestStatus.PAID, RequestStatus.FINALIZED, employee.getIdUser(), employee.getNameUser(), "Solicitação finalizada"));
        return s;
    }

    private Solicitation buildRedirected(User client, User fromEmployee, User targetEmployee, String equipment, Long categoryId, String categoryName, String defect, String openedAt, Double quoteValue, String quotedAt, String redirectedAt) {
        Solicitation s = buildApproved(client, fromEmployee, equipment, categoryId, categoryName, defect, openedAt, quoteValue, quotedAt, quotedAt);
        s.setStatus(RequestStatus.REDIRECTED);
        s.setRedirectedToEmployeeId(targetEmployee.getIdUser());
        s.setRedirectedToEmployeeName(targetEmployee.getNameUser());
        s.getHistory().add(history(redirectedAt, RequestStatus.APPROVED, RequestStatus.REDIRECTED, fromEmployee.getIdUser(), fromEmployee.getNameUser(), "Redirecionado para " + targetEmployee.getNameUser()));
        return s;
    }

    private HistoryEntry history(String date, RequestStatus from, RequestStatus to, Long employeeId, String employeeName, String note) {
        return HistoryEntry.builder()
                .date(date)
                .fromStatus(from)
                .toStatus(to)
                .employeeId(employeeId)
                .employeeName(employeeName)
                .note(note)
                .build();
    }

    private String formatMoney(Double value) {
        return String.format("%.2f", value).replace('.', ',');
    }
}
