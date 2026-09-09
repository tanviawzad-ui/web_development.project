package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.LabReportDTO;
import com.yourorg.appname.entity.LabReport;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.LabReportRepository;
import com.yourorg.appname.repository.PatientRepository;
import com.yourorg.appname.service.LabReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabReportServiceImpl implements LabReportService {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<LabReportDTO> getPatientReports(Long patientId) {
        return labReportRepository.findByPatientIdOrderByTestDateDesc(patientId).stream()
                .map(mapper::toLabReportDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LabReportDTO> lookupReportsByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Collections.emptyList();
        }

        String clean = identifier.trim();

        // Try UHID first
        Optional<Patient> patientOpt = patientRepository.findByUhid(clean);

        // Then try mobile
        if (patientOpt.isEmpty()) {
            patientOpt = patientRepository.findByMobileNumber(clean);
        }

        // Try normalized mobile if +91 prefix or without
        if (patientOpt.isEmpty() && clean.startsWith("+91")) {
            patientOpt = patientRepository.findByMobileNumber(clean.substring(3).trim());
        }

        if (patientOpt.isPresent()) {
            return getPatientReports(patientOpt.get().getId());
        }

        return Collections.emptyList();
    }

    @Override
    @Transactional(readOnly = true)
    public LabReportDTO getReportById(Long id) {
        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab report not found with id: " + id));
        return mapper.toLabReportDTO(report);
    }
}
