package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_vitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientVital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @CreationTimestamp
    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "blood_pressure_systolic", nullable = false)
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic", nullable = false)
    private Integer bloodPressureDiastolic;

    @Column(name = "heart_rate", nullable = false)
    private Integer heartRate;

    @Column(name = "oxygen_saturation", nullable = false)
    private Integer oxygenSaturation;

    @Column(nullable = false, precision = 4, scale = 1)
    private BigDecimal bmi;

    @Column(name = "bp_status", length = 50)
    @Builder.Default
    private String bpStatus = "Normal Baseline";

    @Column(name = "hr_status", length = 50)
    @Builder.Default
    private String hrStatus = "Resting Regular";

    @Column(name = "spo2_status", length = 50)
    @Builder.Default
    private String spo2Status = "Adequate Saturation";

    @Column(name = "bmi_status", length = 50)
    @Builder.Default
    private String bmiStatus = "Healthy Range";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
