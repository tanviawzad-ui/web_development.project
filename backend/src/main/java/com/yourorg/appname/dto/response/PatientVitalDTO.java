package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientVitalDTO {
    private Long id;
    private Long patientId;
    private LocalDateTime recordedAt;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private String bloodPressureReading; // e.g. "128/82"
    private Integer heartRate;
    private Integer oxygenSaturation;
    private BigDecimal bmi;
    private String bpStatus;
    private String hrStatus;
    private String spo2Status;
    private String bmiStatus;
}
