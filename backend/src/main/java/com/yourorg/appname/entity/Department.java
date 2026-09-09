package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String icon = "local_hospital";

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "sub_specialties", length = 500)
    private String subSpecialties;

    @Column(name = "total_doctors")
    @Builder.Default
    private Integer totalDoctors = 0;

    @Column(name = "opd_clinic_hours", length = 100)
    @Builder.Default
    private String opdClinicHours = "Mon - Sat (09:00 AM - 08:00 PM)";

    @Column(name = "is_emergency_active")
    @Builder.Default
    private Boolean isEmergencyActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
