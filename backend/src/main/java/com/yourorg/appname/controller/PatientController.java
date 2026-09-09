package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DashboardSummaryDTO;
import com.yourorg.appname.dto.response.PatientDTO;
import com.yourorg.appname.dto.response.PatientVitalDTO;
import com.yourorg.appname.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getDashboard(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        DashboardSummaryDTO summary = patientService.getDashboardSummary(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<PatientDTO>> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        PatientDTO patient = patientService.getPatientByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @GetMapping("/vitals")
    public ResponseEntity<ApiResponse<List<PatientVitalDTO>>> getVitals(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        PatientDTO patient = patientService.getPatientByEmail(authentication.getName());
        List<PatientVitalDTO> vitals = patientService.getPatientVitals(patient.getId());
        return ResponseEntity.ok(ApiResponse.success(vitals));
    }

    @GetMapping("/uhid/{uhid}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientByUhid(@PathVariable String uhid) {
        PatientDTO patient = patientService.getPatientByUhid(uhid);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }
}
