package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.LoginRequest;
import com.yourorg.appname.dto.request.RegisterRequest;
import com.yourorg.appname.dto.response.AuthResponse;
import com.yourorg.appname.dto.response.PatientDTO;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.entity.Role;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.PatientRepository;
import com.yourorg.appname.repository.RoleRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.security.JwtUtil;
import com.yourorg.appname.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = jwtUtil.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        PatientDTO patientDTO = patientRepository.findByUserId(user.getId())
                .map(mapper::toPatientDTO)
                .orElse(null);

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .roles(roles)
                .patient(patientDTO)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role patientRole = roleRepository.findByName("ROLE_PATIENT")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_PATIENT").build()));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .isActive(true)
                .roles(Set.of(patientRole))
                .build();

        User savedUser = userRepository.save(user);

        // Generate UHID (e.g., MC-2025-XXXXX)
        String uhidSuffix = String.format("%05d", (int) (Math.random() * 90000) + 10000);
        String uhid = "MC-2025-" + uhidSuffix;

        // Auto create patient profile
        Patient patient = Patient.builder()
                .user(savedUser)
                .uhid(uhid)
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .mobileNumber(savedUser.getPhone())
                .gender(request.getGender() != null ? request.getGender() : "Male")
                .bloodGroup(request.getBloodGroup() != null ? request.getBloodGroup() : "B+")
                .ageYears(request.getAge() != null ? request.getAge() : 30)
                .address(request.getAddress())
                .isCashlessPreapproved(false)
                .build();

        Patient savedPatient = patientRepository.save(patient);

        String jwt = jwtUtil.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .phone(savedUser.getPhone())
                .roles(List.of(patientRole.getName()))
                .patient(mapper.toPatientDTO(savedPatient))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        PatientDTO patientDTO = patientRepository.findByUserId(user.getId())
                .map(mapper::toPatientDTO)
                .orElse(null);

        String token = jwtUtil.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .roles(roles)
                .patient(patientDTO)
                .build();
    }
}
