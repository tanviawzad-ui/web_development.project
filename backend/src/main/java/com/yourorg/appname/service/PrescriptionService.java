package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.PrescriptionDTO;

import java.util.List;

public interface PrescriptionService {
    List<PrescriptionDTO> getActivePrescriptions(Long patientId);
    PrescriptionDTO refillPrescription(Long prescriptionId);
}
