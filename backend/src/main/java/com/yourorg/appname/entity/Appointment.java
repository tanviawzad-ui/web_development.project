package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class
Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_number", nullable = false, unique = true, length = 50)
    private String appointmentNumber;

    @Column(name = "token_id", nullable = false, length = 20)
    private String tokenId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false, length = 20)
    private String appointmentTime;

    @Column(name = "session_type", nullable = false, length = 20)
    @Builder.Default
    private String sessionType = "EVENING"; // MORNING, EVENING

    @Column(name = "consultation_type", nullable = false, length = 30)
    @Builder.Default
    private String consultationType = "IN_HOSPITAL_OPD"; // IN_HOSPITAL_OPD, VIDEO_CONSULTATION

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "CONFIRMED"; // PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED

    @Column(name = "reason_symptoms", columnDefinition = "NVARCHAR(MAX)")
    private String reasonSymptoms;

    @Column(name = "is_cashless_insurance", nullable = false)
    @Builder.Default
    private Boolean isCashlessInsurance = false;

    @Column(name = "insurance_provider", length = 100)
    private String insuranceProvider;

    @Column(name = "fee_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal feeAmount = BigDecimal.valueOf(1500.00);

    @Column(name = "registration_fee_waived", nullable = false)
    @Builder.Default
    private Boolean registrationFeeWaived = true;

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "PAID"; // PENDING, PAID, WAIVED

    @Column(name = "queue_number")
    @Builder.Default
    private Integer queueNumber = 1;

    @Column(name = "patients_ahead")
    @Builder.Default
    private Integer patientsAhead = 3;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
