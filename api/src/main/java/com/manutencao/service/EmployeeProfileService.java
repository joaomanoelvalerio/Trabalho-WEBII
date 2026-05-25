package com.manutencao.service;

import com.manutencao.entity.EmployeeProfile;
import com.manutencao.entity.User;
import com.manutencao.repository.EmployeeProfileRepository;
import com.manutencao.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeProfileService {

    @Autowired
    private EmployeeProfileRepository employeeProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public EmployeeProfile createEmployeeProfile(EmployeeProfile profile) {
        User user = userRepository.findById(profile.getUser().getIdUser())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        employeeProfileRepository.findByUserIdUser(user.getIdUser())
                .ifPresent(p -> {
                    throw new IllegalArgumentException("Este usuário já possui um perfil de funcionário");
                });
        
        profile.setUser(user);
        return employeeProfileRepository.save(profile);
    }

    public List<EmployeeProfile> getAllProfiles() {
        return employeeProfileRepository.findAll();
    }

    public Optional<EmployeeProfile> getProfileById(Long id) {
        return employeeProfileRepository.findById(id);
    }

    public Optional<EmployeeProfile> getProfileByUserId(Long userId) {
        return employeeProfileRepository.findByUserIdUser(userId);
    }

    public List<EmployeeProfile> getActiveEmployees() {
        return employeeProfileRepository.findByActiveTrueOrderByUserNameUserAsc();
    }

    public List<EmployeeProfile> getEmployeesByDepartment(String department) {
        return employeeProfileRepository.findByDepartment(department);
    }

    public EmployeeProfile updateEmployeeProfile(Long id, EmployeeProfile profileDetails) {
        EmployeeProfile profile = employeeProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado"));
        
        profile.setDepartment(profileDetails.getDepartment());
        profile.setSpecialties(profileDetails.getSpecialties());
        profile.setActive(profileDetails.getActive());
        profile.setCanQuote(profileDetails.getCanQuote());
        
        if (profileDetails.getResignationDate() != null) {
            profile.setResignationDate(profileDetails.getResignationDate());
        }
        
        return employeeProfileRepository.save(profile);
    }

    public void deactivateEmployee(Long id) {
        EmployeeProfile profile = employeeProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado"));
        profile.setActive(false);
        employeeProfileRepository.save(profile);
    }

    public void deleteEmployeeProfile(Long id) {
        employeeProfileRepository.deleteById(id);
    }
}
