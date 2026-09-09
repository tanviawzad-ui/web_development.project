package com.yourorg.appname.config;

import com.yourorg.appname.entity.*;
import com.yourorg.appname.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientVitalRepository patientVitalRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data ({} users found). Skipping initialization.", userRepository.count());
            return;
        }

        log.info("Initializing default clinical seed data...");

        // 1. Roles
        Role rolePatient = roleRepository.save(Role.builder().name("ROLE_PATIENT").build());
        Role roleDoctor = roleRepository.save(Role.builder().name("ROLE_DOCTOR").build());
        Role roleAdmin = roleRepository.save(Role.builder().name("ROLE_ADMIN").build());

        // 2. Users
        // BCrypt hash for 'Password123!'
        User patientUser = userRepository.save(User.builder()
                .email("ramesh.sharma@example.in")
                .password("$2a$10$mFcruWsNTHt/1hr1Els5jegCv4oYN5PBCZB7xJx8LcWd5ng0j2uV.")
                .fullName("Ramesh Chand Sharma")
                .phone("+91 98112 45678")
                .isActive(true)
                .roles(Set.of(rolePatient))
                .build());

        // BCrypt hash for 'Admin123!'
        User adminUser = userRepository.save(User.builder()
                .email("admin@medicare.com")
                .password("$2a$10$.X4lt2T/ZPibvoYya3X5red5I28E/nZcjHoUaPUeUqODQCuh6d4ie")
                .fullName("Hospital System Administrator")
                .phone("+91 1800 208 5555")
                .isActive(true)
                .roles(Set.of(roleAdmin))
                .build());

        // 3. Departments
        Department depCardio = departmentRepository.save(Department.builder()
                .name("Cardiology & Cardiac Sciences")
                .code("CARDIO")
                .description("Comprehensive adult and paediatric cardiac care, interventional cardiology, electrophysiology, and robotic cardiac bypass.")
                .icon("cardiology")
                .totalDoctors(18)
                .opdClinicHours("Mon - Sat (09:00 AM - 08:00 PM)")
                .isEmergencyActive(true)
                .build());

        Department depNeuro = departmentRepository.save(Department.builder()
                .name("Institute of Neurosciences")
                .code("NEURO")
                .description("Advanced stroke centre, stereotactic neurosurgery, deep brain stimulation, and comprehensive neurological rehab.")
                .icon("neurology")
                .totalDoctors(12)
                .opdClinicHours("Mon - Sat (09:00 AM - 07:00 PM)")
                .isEmergencyActive(true)
                .build());

        Department depOrtho = departmentRepository.save(Department.builder()
                .name("Orthopaedics & Joint Replacement")
                .code("ORTHO")
                .description("Mako robotic joint replacement, sports injury arthroscopy, paediatric orthopaedics, and complex revision surgeries.")
                .icon("orthopedics")
                .totalDoctors(14)
                .opdClinicHours("Mon - Sat (08:30 AM - 06:00 PM)")
                .isEmergencyActive(true)
                .build());

        Department depPaed = departmentRepository.save(Department.builder()
                .name("Paediatrics & Neonatology")
                .code("PAED")
                .description("Level-III NICU/PICU, developmental paediatrics, paediatric cardiology, and 24x7 emergency child care.")
                .icon("child_care")
                .totalDoctors(9)
                .opdClinicHours("Mon - Sat (08:00 AM - 08:00 PM)")
                .isEmergencyActive(true)
                .build());

        // 4. Doctors
        Doctor docMehra = doctorRepository.save(Doctor.builder()
                .name("Dr. Arvind Mehra")
                .title("Senior Consultant & Director")
                .speciality("Cardiology")
                .qualifications("MBBS, MD (Med), DM (Cardiology), FACC")
                .experienceYears(22)
                .consultationFee(BigDecimal.valueOf(1200.00))
                .rating(BigDecimal.valueOf(4.9))
                .reviewsCount(340)
                .opdRoom("OPD-304, Tower A")
                .opdTimings("Mon - Sat (09:00 AM - 01:00 PM)")
                .languagesSpoken("English, Hindi, Punjabi")
                .department(depCardio)
                .imageUrl("/assets/images/doctor-mehra.png")
                .isAvailableToday(true)
                .nextAvailableSlot("Today, 04:30 PM")
                .build());

        Doctor docKulkarni = doctorRepository.save(Doctor.builder()
                .name("Dr. Sunita Kulkarni")
                .title("Associate Director")
                .speciality("Interventional Cardiology")
                .qualifications("MBBS, MD, DNB (Cardiology), FSCAI")
                .experienceYears(17)
                .consultationFee(BigDecimal.valueOf(1000.00))
                .rating(BigDecimal.valueOf(4.8))
                .reviewsCount(215)
                .opdRoom("OPD-306, Tower A")
                .opdTimings("Tue, Thu, Sat (10:00 AM - 02:00 PM)")
                .languagesSpoken("English, Hindi, Marathi")
                .department(depCardio)
                .imageUrl("/assets/images/doctor-kulkarni.png")
                .isAvailableToday(true)
                .nextAvailableSlot("Tomorrow, 10:00 AM")
                .build());

        Doctor docSen = doctorRepository.save(Doctor.builder()
                .name("Dr. Rajeshwar Sen")
                .title("Principal Consultant")
                .speciality("Neurosurgery")
                .qualifications("MBBS, MS (Surgery), MCh (Neurosurgery)")
                .experienceYears(20)
                .consultationFee(BigDecimal.valueOf(1500.00))
                .rating(BigDecimal.valueOf(4.9))
                .reviewsCount(180)
                .opdRoom("OPD-201, Tower B")
                .opdTimings("Mon, Wed, Fri (11:00 AM - 03:00 PM)")
                .languagesSpoken("English, Hindi, Bengali")
                .department(depNeuro)
                .imageUrl("/assets/images/doctor-sen.png")
                .isAvailableToday(false)
                .nextAvailableSlot("Friday, 11:30 AM")
                .build());

        Doctor docSharma = doctorRepository.save(Doctor.builder()
                .name("Dr. Priya Sharma")
                .title("Consultant")
                .speciality("Paediatrics")
                .qualifications("MBBS, MD (Paediatrics), Fellowship Neonatology")
                .experienceYears(12)
                .consultationFee(BigDecimal.valueOf(800.00))
                .rating(BigDecimal.valueOf(4.7))
                .reviewsCount(410)
                .opdRoom("OPD-102, Tower B")
                .opdTimings("Mon - Fri (08:30 AM - 12:30 PM)")
                .languagesSpoken("English, Hindi")
                .department(depPaed)
                .imageUrl("/assets/images/doctor-sharma.png")
                .isAvailableToday(true)
                .nextAvailableSlot("Today, 05:00 PM")
                .build());

        // 5. Patient Profile
        Patient patient = patientRepository.save(Patient.builder()
                .user(patientUser)
                .uhid("MC-2024-88412")
                .abhaId("91-8841-2094-11")
                .fullName("Ramesh Chand Sharma")
                .email("ramesh.sharma@example.in")
                .mobileNumber("+91 98112 45678")
                .gender("Male")
                .dateOfBirth(LocalDate.of(1978, 5, 14))
                .ageYears(46)
                .bloodGroup("B+")
                .address("Flat 402, Royal Palms, Sector 62, Noida, UP - 201301")
                .emergencyContact("+91 98112 45679")
                .insuranceProvider("Star Health & Allied Insurance")
                .insurancePolicyNumber("SH-2023-99104812")
                .isCashlessPreapproved(true)
                .primaryDoctor(docMehra)
                .build());

        // 6. Confirmed Appointment (Token B-14)
        appointmentRepository.save(Appointment.builder()
                .appointmentNumber("APT-2026-00412")
                .tokenId("Token B-14")
                .patient(patient)
                .doctor(docMehra)
                .department(depCardio)
                .appointmentDate(LocalDate.now().plusDays(1))
                .appointmentTime("10:30 AM")
                .sessionType("MORNING")
                .consultationType("IN_HOSPITAL_OPD")
                .status("CONFIRMED")
                .paymentStatus("PAID")
                .feeAmount(BigDecimal.valueOf(1200.00))
                .reasonSymptoms("Routine 6-month hypertensive follow-up with lipid panel review.")
                .build());

        // 7. Lab Reports
        labReportRepository.save(LabReport.builder()
                .reportNumber("LAB-2026-9041")
                .patient(patient)
                .testName("Lipid Profile Extended (Serum)")
                .category("Biochemistry")
                .testDate(LocalDate.now().minusDays(3))
                .status("COMPLETED")
                .statusBadge("NORMAL VALUES")
                .metricHighlight("Cholesterol: 188 mg/dL")
                .resultSummary("Total Cholesterol: 188 mg/dL | LDL: 112 mg/dL | HDL: 46 mg/dL | Triglycerides: 150 mg/dL")
                .referringDoctor(docMehra)
                .build());

        labReportRepository.save(LabReport.builder()
                .reportNumber("LAB-2026-8812")
                .patient(patient)
                .testName("12-Lead Electrocardiogram (ECG)")
                .category("Cardiology Diagnostics")
                .testDate(LocalDate.now().minusDays(7))
                .status("COMPLETED")
                .statusBadge("NORMAL VALUES")
                .metricHighlight("Sinus Rhythm: 74 bpm")
                .resultSummary("Normal sinus rhythm with rate 74 bpm. No acute ST-T elevation.")
                .referringDoctor(docMehra)
                .build());

        // 8. Prescriptions
        Prescription rx = Prescription.builder()
                .prescriptionNumber("RX-2026-3391")
                .patient(patient)
                .doctor(docMehra)
                .issuedDate(LocalDate.now().minusDays(14))
                .lifestyleInstructions("Low sodium diet (< 2g/day), 45 min brisk walking 5 days a week.")
                .isActive(true)
                .items(new java.util.ArrayList<>())
                .build();

        rx.getItems().add(PrescriptionItem.builder()
                .prescription(rx)
                .medicineName("Telmisartan 40mg")
                .dosage("40 mg")
                .category("ANTIHYPERTENSIVE")
                .timingInstructions("Once daily (Morning after breakfast)")
                .durationDays(30)
                .daysLeft(16)
                .build());

        rx.getItems().add(PrescriptionItem.builder()
                .prescription(rx)
                .medicineName("Atorvastatin 10mg")
                .dosage("10 mg")
                .category("LIPID_LOWERING")
                .timingInstructions("Once daily (Night at bedtime)")
                .durationDays(30)
                .daysLeft(16)
                .build());

        prescriptionRepository.save(rx);

        // 9. Vitals History
        patientVitalRepository.save(PatientVital.builder()
                .patient(patient)
                .recordedAt(LocalDateTime.now().minusDays(14))
                .bloodPressureSystolic(128)
                .bloodPressureDiastolic(84)
                .heartRate(76)
                .oxygenSaturation(98)
                .bmi(BigDecimal.valueOf(24.2))
                .bpStatus("Normal Baseline")
                .hrStatus("Resting Regular")
                .spo2Status("Adequate Saturation")
                .bmiStatus("Healthy Range")
                .build());

        patientVitalRepository.save(PatientVital.builder()
                .patient(patient)
                .recordedAt(LocalDateTime.now().minusDays(1))
                .bloodPressureSystolic(120)
                .bloodPressureDiastolic(80)
                .heartRate(72)
                .oxygenSaturation(99)
                .bmi(BigDecimal.valueOf(24.0))
                .bpStatus("Normal Baseline")
                .hrStatus("Resting Regular")
                .spo2Status("Adequate Saturation")
                .bmiStatus("Healthy Range")
                .build());

        log.info("Default clinical seed data successfully created!");
    }
}
