package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.DoctorDTO;
import com.yourorg.appname.entity.Doctor;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.DoctorRepository;
import com.yourorg.appname.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(mapper::toDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapper.toDoctorDTO(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getFeaturedDoctors() {
        return doctorRepository.findAll().stream()
                .limit(4)
                .map(mapper::toDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> filterDoctors(String search, String departmentCode, String speciality, String gender, Integer minExperience, Boolean availableToday) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanDept = (departmentCode != null && !departmentCode.equalsIgnoreCase("all")) ? departmentCode.trim() : null;
        String cleanSpec = (speciality != null && !speciality.equalsIgnoreCase("all")) ? speciality.trim() : null;
        String cleanGender = (gender != null && !gender.equalsIgnoreCase("any")) ? gender.trim() : null;

        return doctorRepository.searchAndFilter(cleanSearch, cleanDept, cleanSpec, cleanGender, minExperience, availableToday)
                .stream()
                .map(mapper::toDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(mapper::toDoctorDTO)
                .collect(Collectors.toList());
    }
}
