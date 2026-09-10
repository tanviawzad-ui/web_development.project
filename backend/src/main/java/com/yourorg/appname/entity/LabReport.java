package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_number", nullable = false, unique = true, length = 50)
    private String reportNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referring_doctor_id")
    private Doctor referringDoctor;

    @Column(name = "test_name", nullable = false, length = 200)
    private String testName;

    @Column(length = 100)
    @Builder.Default
    private String category = "Pathology";

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "COMPLETED"; // COMPLETED, NORMAL_VALUES, PENDING_REVIEW

    @Column(name = "status_badge", length = 50)
    @Builder.Default
    private String statusBadge = "NORMAL VALUES";

    @Column(name = "metric_highlight", length = 150)
    private String metricHighlight;

    @Column(name = "result_summary", length = 2000)
    private String resultSummary;

    @Column(name = "lab_facility", length = 150)
    @Builder.Default
    private String labFacility = "NABL Certified Central Clinical Laboratories";

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
