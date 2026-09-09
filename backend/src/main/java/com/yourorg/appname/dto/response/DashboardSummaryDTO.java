package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private PatientDTO patient;
    private AppointmentDTO activeAppointment;
    private List<AppointmentDTO> upcomingAppointments;
    private List<LabReportDTO> recentReports;
    private List<PrescriptionDTO> activePrescriptions;
    private List<PatientVitalDTO> vitalsHistory;
    private PatientVitalDTO latestVitals;
    private Integer upcomingCount;
    private Integer activePrescriptionCount;
    private Integer newReportsCount;
    private String outstandingBalance;
}
