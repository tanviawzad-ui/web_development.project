package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabReportDTO {
    private Long id;
    private String reportNumber;
    private Long patientId;
    private String patientName;
    private String patientUhid;
    private Long referringDoctorId;
    private String referringDoctorName;
    private String testName;
    private String category;
    private LocalDate testDate;
    private String status;
    private String statusBadge;
    private String metricHighlight;
    private String resultSummary;
    private String labFacility;
    private String fileUrl;
}
