package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public DepartmentDTO toDepartmentDTO(Department department) {
        if (department == null) return null;

        List<String> tags = Collections.emptyList();
        if (department.getSubSpecialties() != null && !department.getSubSpecialties().isBlank()) {
            tags = Arrays.stream(department.getSubSpecialties().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        return DepartmentDTO.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .icon(department.getIcon())
                .description(department.getDescription())
                .subSpecialties(department.getSubSpecialties())
                .tags(tags)
                .totalDoctors(department.getTotalDoctors())
                .opdClinicHours(department.getOpdClinicHours())
                .isEmergencyActive(department.getIsEmergencyActive())
                .build();
    }

    public DoctorDTO toDoctorDTO(Doctor doctor) {
        if (doctor == null) return null;

        List<String> languages = Collections.emptyList();
        if (doctor.getLanguagesSpoken() != null && !doctor.getLanguagesSpoken().isBlank()) {
            languages = Arrays.stream(doctor.getLanguagesSpoken().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        return DoctorDTO.builder()
                .id(doctor.getId())
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .departmentCode(doctor.getDepartment() != null ? doctor.getDepartment().getCode() : null)
                .name(doctor.getName())
                .title(doctor.getTitle())
                .qualifications(doctor.getQualifications())
                .speciality(doctor.getSpeciality())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .languagesSpoken(doctor.getLanguagesSpoken())
                .languagesList(languages)
                .rating(doctor.getRating())
                .reviewsCount(doctor.getReviewsCount())
                .opdRoom(doctor.getOpdRoom())
                .opdTimings(doctor.getOpdTimings())
                .gender(doctor.getGender())
                .imageUrl(doctor.getImageUrl())
                .isAvailableToday(doctor.getIsAvailableToday())
                .nextAvailableSlot(doctor.getNextAvailableSlot())
                .build();
    }

    public PatientDTO toPatientDTO(Patient patient) {
        if (patient == null) return null;

        return PatientDTO.builder()
                .id(patient.getId())
                .userId(patient.getUser() != null ? patient.getUser().getId() : null)
                .uhid(patient.getUhid())
                .abhaId(patient.getAbhaId())
                .fullName(patient.getFullName())
                .email(patient.getEmail())
                .mobileNumber(patient.getMobileNumber())
                .dateOfBirth(patient.getDateOfBirth())
                .ageYears(patient.getAgeYears())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .insuranceProvider(patient.getInsuranceProvider())
                .insurancePolicyNumber(patient.getInsurancePolicyNumber())
                .isCashlessPreapproved(patient.getIsCashlessPreapproved())
                .primaryDoctorId(patient.getPrimaryDoctor() != null ? patient.getPrimaryDoctor().getId() : null)
                .primaryDoctorName(patient.getPrimaryDoctor() != null ? patient.getPrimaryDoctor().getName() : null)
                .primaryDoctorSpeciality(patient.getPrimaryDoctor() != null ? patient.getPrimaryDoctor().getSpeciality() : null)
                .build();
    }

    public AppointmentDTO toAppointmentDTO(Appointment appointment) {
        if (appointment == null) return null;

        return AppointmentDTO.builder()
                .id(appointment.getId())
                .appointmentNumber(appointment.getAppointmentNumber())
                .tokenId(appointment.getTokenId())
                .patientId(appointment.getPatient() != null ? appointment.getPatient().getId() : null)
                .patientName(appointment.getPatient() != null ? appointment.getPatient().getFullName() : null)
                .patientUhid(appointment.getPatient() != null ? appointment.getPatient().getUhid() : null)
                .patientMobile(appointment.getPatient() != null ? appointment.getPatient().getMobileNumber() : null)
                .doctorId(appointment.getDoctor() != null ? appointment.getDoctor().getId() : null)
                .doctorName(appointment.getDoctor() != null ? appointment.getDoctor().getName() : null)
                .doctorSpeciality(appointment.getDoctor() != null ? appointment.getDoctor().getSpeciality() : null)
                .doctorQualifications(appointment.getDoctor() != null ? appointment.getDoctor().getQualifications() : null)
                .doctorImageUrl(appointment.getDoctor() != null ? appointment.getDoctor().getImageUrl() : null)
                .doctorOpdRoom(appointment.getDoctor() != null ? appointment.getDoctor().getOpdRoom() : null)
                .departmentId(appointment.getDepartment() != null ? appointment.getDepartment().getId() : null)
                .departmentName(appointment.getDepartment() != null ? appointment.getDepartment().getName() : null)
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .sessionType(appointment.getSessionType())
                .consultationType(appointment.getConsultationType())
                .status(appointment.getStatus())
                .reasonSymptoms(appointment.getReasonSymptoms())
                .isCashlessInsurance(appointment.getIsCashlessInsurance())
                .insuranceProvider(appointment.getInsuranceProvider())
                .feeAmount(appointment.getFeeAmount())
                .registrationFeeWaived(appointment.getRegistrationFeeWaived())
                .paymentStatus(appointment.getPaymentStatus())
                .queueNumber(appointment.getQueueNumber())
                .patientsAhead(appointment.getPatientsAhead())
                .createdAt(appointment.getCreatedAt())
                .build();
    }

    public LabReportDTO toLabReportDTO(LabReport report) {
        if (report == null) return null;

        return LabReportDTO.builder()
                .id(report.getId())
                .reportNumber(report.getReportNumber())
                .patientId(report.getPatient() != null ? report.getPatient().getId() : null)
                .patientName(report.getPatient() != null ? report.getPatient().getFullName() : null)
                .patientUhid(report.getPatient() != null ? report.getPatient().getUhid() : null)
                .referringDoctorId(report.getReferringDoctor() != null ? report.getReferringDoctor().getId() : null)
                .referringDoctorName(report.getReferringDoctor() != null ? report.getReferringDoctor().getName() : null)
                .testName(report.getTestName())
                .category(report.getCategory())
                .testDate(report.getTestDate())
                .status(report.getStatus())
                .statusBadge(report.getStatusBadge())
                .metricHighlight(report.getMetricHighlight())
                .resultSummary(report.getResultSummary())
                .labFacility(report.getLabFacility())
                .fileUrl(report.getFileUrl())
                .build();
    }

    public PrescriptionItemDTO toPrescriptionItemDTO(PrescriptionItem item) {
        if (item == null) return null;

        return PrescriptionItemDTO.builder()
                .id(item.getId())
                .medicineName(item.getMedicineName())
                .category(item.getCategory())
                .dosage(item.getDosage())
                .timingInstructions(item.getTimingInstructions())
                .timingBadge(item.getTimingBadge())
                .durationDays(item.getDurationDays())
                .daysLeft(item.getDaysLeft())
                .build();
    }

    public PrescriptionDTO toPrescriptionDTO(Prescription prescription) {
        if (prescription == null) return null;

        List<PrescriptionItemDTO> items = Collections.emptyList();
        if (prescription.getItems() != null) {
            items = prescription.getItems().stream()
                    .map(this::toPrescriptionItemDTO)
                    .collect(Collectors.toList());
        }

        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .prescriptionNumber(prescription.getPrescriptionNumber())
                .patientId(prescription.getPatient() != null ? prescription.getPatient().getId() : null)
                .patientName(prescription.getPatient() != null ? prescription.getPatient().getFullName() : null)
                .patientUhid(prescription.getPatient() != null ? prescription.getPatient().getUhid() : null)
                .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getId() : null)
                .doctorName(prescription.getDoctor() != null ? prescription.getDoctor().getName() : null)
                .doctorSpeciality(prescription.getDoctor() != null ? prescription.getDoctor().getSpeciality() : null)
                .issuedDate(prescription.getIssuedDate())
                .nextReviewDate(prescription.getNextReviewDate())
                .lifestyleInstructions(prescription.getLifestyleInstructions())
                .isActive(prescription.getIsActive())
                .items(items)
                .build();
    }

    public PatientVitalDTO toPatientVitalDTO(PatientVital vital) {
        if (vital == null) return null;

        return PatientVitalDTO.builder()
                .id(vital.getId())
                .patientId(vital.getPatient() != null ? vital.getPatient().getId() : null)
                .recordedAt(vital.getRecordedAt())
                .bloodPressureSystolic(vital.getBloodPressureSystolic())
                .bloodPressureDiastolic(vital.getBloodPressureDiastolic())
                .bloodPressureReading(vital.getBloodPressureSystolic() + "/" + vital.getBloodPressureDiastolic())
                .heartRate(vital.getHeartRate())
                .oxygenSaturation(vital.getOxygenSaturation())
                .bmi(vital.getBmi())
                .bpStatus(vital.getBpStatus())
                .hrStatus(vital.getHrStatus())
                .spo2Status(vital.getSpo2Status())
                .bmiStatus(vital.getBmiStatus())
                .build();
    }
}
