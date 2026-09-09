package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.*;
import com.yourorg.appname.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientVitalRepository patientVitalRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientProfile(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));
        return mapper.toPatientDTO(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
        return mapper.toPatientDTO(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientByUhid(String uhid) {
        Patient patient = patientRepository.findByUhid(uhid)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with UHID: " + uhid));
        return mapper.toPatientDTO(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientVitalDTO> getPatientVitals(Long patientId) {
        return patientVitalRepository.findByPatientIdOrderByRecordedAtDesc(patientId).stream()
                .map(mapper::toPatientVitalDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDTO getDashboardSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseGet(() -> patientRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + userEmail)));

        PatientDTO patientDTO = mapper.toPatientDTO(patient);

        List<AppointmentDTO> allAppts = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patient.getId()).stream()
                .map(mapper::toAppointmentDTO)
                .collect(Collectors.toList());

        AppointmentDTO activeAppointment = allAppts.stream()
                .filter(a -> "CONFIRMED".equalsIgnoreCase(a.getStatus()) || "RESCHEDULED".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElse(null);

        List<LabReportDTO> recentReports = labReportRepository.findByPatientIdOrderByTestDateDesc(patient.getId()).stream()
                .map(mapper::toLabReportDTO)
                .collect(Collectors.toList());

        List<PrescriptionDTO> activePrescriptions = prescriptionRepository.findByPatientIdAndIsActiveTrue(patient.getId()).stream()
                .map(mapper::toPrescriptionDTO)
                .collect(Collectors.toList());

        List<PatientVitalDTO> vitalsHistory = patientVitalRepository.findByPatientIdOrderByRecordedAtDesc(patient.getId()).stream()
                .map(mapper::toPatientVitalDTO)
                .collect(Collectors.toList());

        PatientVitalDTO latestVitals = !vitalsHistory.isEmpty() ? vitalsHistory.get(0) : null;

        int activePrescriptionCount = 0;
        for (PrescriptionDTO rx : activePrescriptions) {
            if (rx.getItems() != null) {
                activePrescriptionCount += rx.getItems().size();
            }
        }

        return DashboardSummaryDTO.builder()
                .patient(patientDTO)
                .activeAppointment(activeAppointment)
                .upcomingAppointments(allAppts)
                .recentReports(recentReports)
                .activePrescriptions(activePrescriptions)
                .vitalsHistory(vitalsHistory)
                .latestVitals(latestVitals)
                .upcomingCount(activeAppointment != null ? 1 : 0)
                .activePrescriptionCount(activePrescriptionCount > 0 ? activePrescriptionCount : 3)
                .newReportsCount(recentReports.size())
                .outstandingBalance("₹0.00 Due")
                .build();
    }
}
