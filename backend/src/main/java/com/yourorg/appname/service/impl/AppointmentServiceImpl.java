package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.AppointmentBookingRequest;
import com.yourorg.appname.dto.request.AppointmentRescheduleRequest;
import com.yourorg.appname.dto.response.AppointmentDTO;
import com.yourorg.appname.entity.Appointment;
import com.yourorg.appname.entity.Department;
import com.yourorg.appname.entity.Doctor;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.AppointmentRepository;
import com.yourorg.appname.repository.DepartmentRepository;
import com.yourorg.appname.repository.DoctorRepository;
import com.yourorg.appname.repository.PatientRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional
    public AppointmentDTO bookAppointment(AppointmentBookingRequest request, String currentUserEmail) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Patient patient = null;

        // Try finding by logged in user first
        if (currentUserEmail != null && !currentUserEmail.isBlank()) {
            User user = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (user != null) {
                patient = patientRepository.findByUserId(user.getId()).orElse(null);
            }
        }

        // If still null, try by provided patientId or UHID or Mobile
        if (patient == null && request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId()).orElse(null);
        }
        if (patient == null && request.getUhid() != null && !request.getUhid().isBlank()) {
            patient = patientRepository.findByUhid(request.getUhid()).orElse(null);
        }
        if (patient == null && request.getMobileNumber() != null && !request.getMobileNumber().isBlank()) {
            patient = patientRepository.findByMobileNumber(request.getMobileNumber()).orElse(null);
        }

        // If still not found, create new guest patient record
        if (patient == null) {
            String uhid = "MC-2025-" + String.format("%05d", (int) (Math.random() * 90000) + 10000);
            patient = Patient.builder()
                    .uhid(uhid)
                    .fullName(request.getPatientName())
                    .mobileNumber(request.getMobileNumber())
                    .email(request.getEmail())
                    .gender(request.getGender() != null ? request.getGender() : "Male")
                    .bloodGroup(request.getBloodGroup() != null ? request.getBloodGroup() : "B+")
                    .primaryDoctor(doctor)
                    .isCashlessPreapproved(Boolean.TRUE.equals(request.getIsCashlessInsurance()))
                    .insuranceProvider(request.getInsuranceProvider())
                    .build();
            patient = patientRepository.save(patient);
        }

        // Generate Token ID like 'B-15'
        char block = 'B';
        int nextQueue = (int) (Math.random() * 20) + 10;
        String tokenId = block + "-" + nextQueue;

        String appointmentNumber = "APT-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Appointment appointment = Appointment.builder()
                .appointmentNumber(appointmentNumber)
                .tokenId(tokenId)
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .sessionType(request.getSessionType() != null ? request.getSessionType() : "EVENING")
                .consultationType(request.getConsultationType() != null ? request.getConsultationType() : "IN_HOSPITAL_OPD")
                .status("CONFIRMED")
                .reasonSymptoms(request.getReasonSymptoms())
                .isCashlessInsurance(Boolean.TRUE.equals(request.getIsCashlessInsurance()))
                .insuranceProvider(request.getInsuranceProvider() != null ? request.getInsuranceProvider() : "Star Health")
                .feeAmount(doctor.getConsultationFee())
                .registrationFeeWaived(true)
                .paymentStatus("PAID")
                .queueNumber(nextQueue)
                .patientsAhead(Math.max(1, nextQueue - 11))
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapper.toAppointmentDTO(savedAppointment);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapper.toAppointmentDTO(appt);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO getAppointmentByToken(String tokenId) {
        Appointment appt = appointmentRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with token: " + tokenId));
        return mapper.toAppointmentDTO(appt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId).stream()
                .map(mapper::toAppointmentDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> getCurrentUserAppointments(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + currentUserEmail));

        return getPatientAppointments(patient.getId());
    }

    @Override
    @Transactional
    public AppointmentDTO cancelAppointment(Long id, String currentUserEmail) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appt.setStatus("CANCELLED");
        return mapper.toAppointmentDTO(appointmentRepository.save(appt));
    }

    @Override
    @Transactional
    public AppointmentDTO rescheduleAppointment(Long id, AppointmentRescheduleRequest request, String currentUserEmail) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appt.setAppointmentDate(request.getNewDate());
        appt.setAppointmentTime(request.getNewTime());
        if (request.getSessionType() != null) {
            appt.setSessionType(request.getSessionType());
        }
        appt.setStatus("RESCHEDULED");
        return mapper.toAppointmentDTO(appointmentRepository.save(appt));
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO getActiveAppointmentForPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId).stream()
                .filter(a -> "CONFIRMED".equalsIgnoreCase(a.getStatus()) || "PENDING".equalsIgnoreCase(a.getStatus()) || "RESCHEDULED".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .map(mapper::toAppointmentDTO)
                .orElse(null);
    }
}
