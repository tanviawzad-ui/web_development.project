package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DoctorDTO;
import com.yourorg.appname.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String speciality,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Boolean availableToday
    ) {
        List<DoctorDTO> list;
        if (search != null || department != null || speciality != null || gender != null || minExperience != null || availableToday != null) {
            list = doctorService.filterDoctors(search, department, speciality, gender, minExperience, availableToday);
        } else {
            list = doctorService.getAllDoctors();
        }
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getFeaturedDoctors() {
        List<DoctorDTO> list = doctorService.getFeaturedDoctors();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorById(@PathVariable Long id) {
        DoctorDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        List<DoctorDTO> list = doctorService.getDoctorsByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
