package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    private String appointmentNumber;
    private String tokenId;
    private Long patientId;
    private String patientName;
    private String patientUhid;
    private String patientMobile;
    private Long doctorId;
    private String doctorName;
    private String doctorSpeciality;
    private String doctorQualifications;
    private String doctorImageUrl;
    private String doctorOpdRoom;
    private Long departmentId;
    private String departmentName;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String sessionType;
    private String consultationType;
    private String status;
    private String reasonSymptoms;
    private Boolean isCashlessInsurance;
    private String insuranceProvider;
    private BigDecimal feeAmount;
    private Boolean registrationFeeWaived;
    private String paymentStatus;
    private Integer queueNumber;
    private Integer patientsAhead;
    private LocalDateTime createdAt;
}
