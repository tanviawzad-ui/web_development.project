package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.AppointmentBookingRequest;
import com.yourorg.appname.dto.request.AppointmentRescheduleRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.AppointmentDTO;
import com.yourorg.appname.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName() : null;

        AppointmentDTO response = appointmentService.bookAppointment(request, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success("Appointment successfully booked with Token: " + response.getTokenId(), response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        AppointmentDTO response = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/token/{tokenId}")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentByToken(@PathVariable String tokenId) {
        AppointmentDTO response = appointmentService.getAppointmentByToken(tokenId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getMyAppointments(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        List<AppointmentDTO> list = appointmentService.getCurrentUserAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentDTO>> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication != null ? authentication.getName() : null;
        AppointmentDTO response = appointmentService.cancelAppointment(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", response));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<AppointmentDTO>> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentRescheduleRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication != null ? authentication.getName() : null;
        AppointmentDTO response = appointmentService.rescheduleAppointment(id, request, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Appointment rescheduled successfully", response));
    }
}
