package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ReportLookupRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.LabReportDTO;
import com.yourorg.appname.dto.response.PatientDTO;
import com.yourorg.appname.service.LabReportService;
import com.yourorg.appname.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class LabReportController {

    private final LabReportService labReportService;
    private final PatientService patientService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LabReportDTO>>> getMyReports(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        PatientDTO patient = patientService.getPatientByEmail(authentication.getName());
        List<LabReportDTO> reports = labReportService.getPatientReports(patient.getId());
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @PostMapping("/lookup")
    public ResponseEntity<ApiResponse<List<LabReportDTO>>> lookupReports(@Valid @RequestBody ReportLookupRequest request) {
        List<LabReportDTO> reports = labReportService.lookupReportsByIdentifier(request.getIdentifier());
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabReportDTO>> getReportById(@PathVariable Long id) {
        LabReportDTO report = labReportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
