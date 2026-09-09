package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DashboardSummaryDTO;
import com.yourorg.appname.dto.response.PatientDTO;
import com.yourorg.appname.dto.response.PatientVitalDTO;

import java.util.List;

public interface PatientService {
    PatientDTO getPatientProfile(Long patientId);
    PatientDTO getPatientByEmail(String email);
    PatientDTO getPatientByUhid(String uhid);
    List<PatientVitalDTO> getPatientVitals(Long patientId);
    DashboardSummaryDTO getDashboardSummary(String userEmail);
}
