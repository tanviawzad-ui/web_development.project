package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.PatientDTO;
import com.yourorg.appname.dto.response.PrescriptionDTO;
import com.yourorg.appname.service.PatientService;
import com.yourorg.appname.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PatientService patientService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getMyPrescriptions(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        PatientDTO patient = patientService.getPatientByEmail(authentication.getName());
        List<PrescriptionDTO> list = prescriptionService.getActivePrescriptions(patient.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/refill")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> refillPrescription(@PathVariable Long id) {
        PrescriptionDTO refilled = prescriptionService.refillPrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription refill successfully requested at Hospital Pharmacy", refilled));
    }
}
