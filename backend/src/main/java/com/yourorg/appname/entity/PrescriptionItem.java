package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false, length = 150)
    private String medicineName;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String category = "GENERAL";

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(name = "timing_instructions", nullable = false, length = 150)
    private String timingInstructions;

    @Column(name = "timing_badge", length = 50)
    @Builder.Default
    private String timingBadge = "Morning Dose";

    @Column(name = "duration_days", nullable = false)
    @Builder.Default
    private Integer durationDays = 30;

    @Column(name = "days_left", nullable = false)
    @Builder.Default
    private Integer daysLeft = 30;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
