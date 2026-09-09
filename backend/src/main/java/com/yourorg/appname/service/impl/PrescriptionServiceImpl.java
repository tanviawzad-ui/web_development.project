package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.PrescriptionDTO;
import com.yourorg.appname.entity.Prescription;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.PrescriptionRepository;
import com.yourorg.appname.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDTO> getActivePrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientIdAndIsActiveTrue(patientId).stream()
                .map(mapper::toPrescriptionDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrescriptionDTO refillPrescription(Long prescriptionId) {
        Prescription rx = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + prescriptionId));

        // Reset days left to full duration for all items
        if (rx.getItems() != null) {
            rx.getItems().forEach(item -> item.setDaysLeft(item.getDurationDays()));
        }
        rx.setNextReviewDate(LocalDate.now().plusMonths(1));

        Prescription updated = prescriptionRepository.save(rx);
        return mapper.toPrescriptionDTO(updated);
    }
}
