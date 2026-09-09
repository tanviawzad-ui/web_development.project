package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.LabReportDTO;

import java.util.List;

public interface LabReportService {
    List<LabReportDTO> getPatientReports(Long patientId);
    List<LabReportDTO> lookupReportsByIdentifier(String identifier); // UHID or Mobile
    LabReportDTO getReportById(Long id);
}
