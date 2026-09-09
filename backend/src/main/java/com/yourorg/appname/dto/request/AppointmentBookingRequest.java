package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentBookingRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    // Optional patient ID if logged in, otherwise guest details
    private Long patientId;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    private String email;
    private String uhid;
    private String age;
    private String gender;
    private String bloodGroup;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotBlank(message = "Appointment time slot is required")
    private String appointmentTime;

    private String sessionType; // MORNING, EVENING
    private String consultationType; // IN_HOSPITAL_OPD, VIDEO_CONSULTATION

    private String reasonSymptoms;
    private Boolean isCashlessInsurance;
    private String insuranceProvider;
}
