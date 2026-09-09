-- MediCare Multispeciality Hospital Management System
-- Flyway Database Migration: V2__seed_data.sql
-- Database Engine: Microsoft SQL Server (MSSQL)

-- 1. Seed Roles
SET IDENTITY_INSERT roles ON;
IF NOT EXISTS (SELECT 1 FROM roles WHERE id = 1)
    INSERT INTO roles (id, name) VALUES (1, 'ROLE_PATIENT');
IF NOT EXISTS (SELECT 1 FROM roles WHERE id = 2)
    INSERT INTO roles (id, name) VALUES (2, 'ROLE_DOCTOR');
IF NOT EXISTS (SELECT 1 FROM roles WHERE id = 3)
    INSERT INTO roles (id, name) VALUES (3, 'ROLE_ADMIN');
SET IDENTITY_INSERT roles OFF;

-- 2. Seed Default Users
-- BCrypt hash for 'Password123!' is $2a$10$mFcruWsNTHt/1hr1Els5jegCv4oYN5PBCZB7xJx8LcWd5ng0j2uV.
-- BCrypt hash for 'Admin123!' is $2a$10$.X4lt2T/ZPibvoYya3X5red5I28E/nZcjHoUaPUeUqODQCuh6d4ie
SET IDENTITY_INSERT users ON;
IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1)
    INSERT INTO users (id, email, password, full_name, phone, is_active, created_at, updated_at)
    VALUES (1, 'ramesh.sharma@example.in', '$2a$10$mFcruWsNTHt/1hr1Els5jegCv4oYN5PBCZB7xJx8LcWd5ng0j2uV.', 'Ramesh Chand Sharma', '+91 98112 45678', 1, SYSUTCDATETIME(), SYSUTCDATETIME());

IF NOT EXISTS (SELECT 1 FROM users WHERE id = 2)
    INSERT INTO users (id, email, password, full_name, phone, is_active, created_at, updated_at)
    VALUES (2, 'admin@medicare.com', '$2a$10$.X4lt2T/ZPibvoYya3X5red5I28E/nZcjHoUaPUeUqODQCuh6d4ie', 'Hospital System Administrator', '+91 1800 208 5555', 1, SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT users OFF;

-- Assign Roles
IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 1 AND role_id = 1)
    INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 2 AND role_id = 3)
    INSERT INTO user_roles (user_id, role_id) VALUES (2, 3);

-- 3. Seed Departments
SET IDENTITY_INSERT departments ON;
IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 1)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (1, 'Cardiology & Cardiac Sciences', 'CARDIO', 'cardiology', 'Comprehensive heart failure clinics, 24x7 Primary Angioplasty (PAMI), TAVI, minimally invasive bypass surgery, and paediatric congenital cardiac corrections.', 'Cath Lab 24x7, TAVI/MitraClip, ECMO Unit', 18, 'Mon - Sat (09:00 AM - 08:00 PM)', 1);

IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 2)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (2, 'Institute of Neurosciences', 'NEURO', 'neurology', 'Advanced stroke thrombolysis code, brain tumor neuronavigation surgery, Deep Brain Stimulation (DBS) for Parkinson''s, and micro-endoscopic spine surgery.', 'Stroke Code 60m, Neuro ICU, Epilepsy Lab', 14, 'Mon - Sat (09:00 AM - 07:00 PM)', 1);

IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 3)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (3, 'Orthopaedics & Joint Care', 'ORTHO', 'orthopedics', 'Robotic total knee and hip replacements, arthroscopic sports ligament repairs, pediatric deformity corrections, and high-energy complex trauma care.', 'Mako Robotic System, Day Care Arthroscopy', 16, 'Mon - Sat (08:30 AM - 08:00 PM)', 1);

IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 4)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (4, 'Comprehensive Cancer Institute', 'ONCO', 'radiology', 'Organ-specific multidisciplinary tumor boards, TrueBeam linear accelerator radiation, immunotherapy, bone marrow transplant, and HIPEC surgical oncology.', 'TrueBeam LINAC, PET-CT Scan, Tumor Board', 22, 'Mon - Sat (09:00 AM - 06:00 PM)', 0);

IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 5)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (5, 'Paediatrics & Neonatology', 'PAED', 'child_care', 'Level-III Advanced NICU care for extreme preemies, pediatric intensive care, neonatal cardiac surgery, pediatric endocrinology, and childhood immunization clinic.', 'Level III NICU, Pediatric Emergency, Vaccine Desk', 15, 'Mon - Sat (09:00 AM - 08:00 PM)', 1);

IF NOT EXISTS (SELECT 1 FROM departments WHERE id = 6)
    INSERT INTO departments (id, name, code, icon, description, sub_specialties, total_doctors, opd_clinic_hours, is_emergency_active)
    VALUES (6, 'Nephrology, Urology & Dialysis', 'NEPHRO', 'file_copy', 'Renal transplant center with live-donor support, 36-station automated hemodialysis with ultrapure water systems, laser stone treatments, and prostate laser enucleation.', '36 Dialysis Beds, Kidney Transplant, Holmium Laser', 12, 'Mon - Sat (08:00 AM - 08:00 PM)', 1);
SET IDENTITY_INSERT departments OFF;

-- 4. Seed Doctors
SET IDENTITY_INSERT doctors ON;
IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = 1)
    INSERT INTO doctors (id, department_id, name, title, qualifications, speciality, experience_years, consultation_fee, languages_spoken, rating, reviews_count, opd_room, opd_timings, gender, image_url, is_available_today, next_available_slot)
    VALUES (1, 1, 'Dr. Arvind Mehra', 'Chairman & Chief Cardiothoracic Surgeon', 'MBBS, MS, MCh (AIIMS New Delhi)', 'Cardiology', 26, 1500.00, 'English, Hindi, Punjabi', 4.9, 1480, 'Block B, 2nd Floor, Room 204', 'Mon - Sat (09:00 AM - 08:00 PM)', 'Male', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJGA_lDSpDnTLIjHwe4_Maru5dFK4OnpkeGl-RyJ37BkYz9U_aAimCWkHJmsDRiKXylbE-sfVXuyABEUu2eHte9jTWXFCIRLqLae7WUuqzIyrWAVwEwiLsZj40UhCY6HphFaaCggJlomqVRcQ5KmHmZP2KJljbsRHNuUQ3s_1_sMyZ7MBMo7yrFwC68xbbHxBgKU4q1bpCe7Bodz8nbfVOl7hwlJLr2fhXIokvGY8XaHM2DkpBYlb6HQ', 1, 'Today, 04:30 PM');

IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = 2)
    INSERT INTO doctors (id, department_id, name, title, qualifications, speciality, experience_years, consultation_fee, languages_spoken, rating, reviews_count, opd_room, opd_timings, gender, image_url, is_available_today, next_available_slot)
    VALUES (2, 1, 'Dr. Sunita Kulkarni', 'Senior Interventional Cardiologist', 'MBBS, MD, DM (Cardiology)', 'Interventional Cardiology', 18, 1200.00, 'English, Hindi, Marathi', 4.8, 920, 'Block B, 2nd Floor, Room 208', 'Mon - Sat (10:00 AM - 06:00 PM)', 'Female', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUWbit4P2YI2zKQMAITL22aafLR1hvB1vh-GFcqFx_gZyWdYWBn5hCzETncEflsxLUpxq68eZZ38RrOR2uBtF0sSOb4ZEDw8cRNmPst7osqicz_rgZ8fakMQoHBL_mkpkK4KrEGXtxvB_3t3FSPZznzli0kZaOnsN_Ma-zQueDfP84ndT6nk39-Rmah5mQ-caikYB_OEZoSJBtNQkB3GbIibw4Jn_u6S9tpWJu0N-uaBj_bwKjIPxZ5g', 1, 'Today, 05:15 PM');

IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = 3)
    INSERT INTO doctors (id, department_id, name, title, qualifications, speciality, experience_years, consultation_fee, languages_spoken, rating, reviews_count, opd_room, opd_timings, gender, image_url, is_available_today, next_available_slot)
    VALUES (3, 2, 'Dr. Rajeshwar Sen', 'Director, Institute of Neurosciences', 'MBBS, MS, MCh (Neurosurgery)', 'Neurosurgery', 24, 1600.00, 'English, Hindi, Bengali', 4.9, 1150, 'Block A, 3rd Floor, Room 312', 'Mon - Fri (09:00 AM - 05:00 PM)', 'Male', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz3SbS251l4Vygb38E6L_jVs1vSocuPEMXC89YlS7qGByey42SHzoOKYmqgMsBF1xGNsCbBhZKtHz4-F0K-56xYJYhBVv_jYoj8n2EToVwVSHlnDzdAgr_r_ddLWkZh76jkIy-4eOsFAxITmKUqsKDf5oZSPxxcpePF_iGWTiG2JjnULqJW1-jpQkY-BkTjgxq2_dn5oDgimNf4YQatigoOVW8Iy0fKcO1hh5RExhuhVN8cwfIfUZhcg', 1, 'Tomorrow, 10:00 AM');

IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = 4)
    INSERT INTO doctors (id, department_id, name, title, qualifications, speciality, experience_years, consultation_fee, languages_spoken, rating, reviews_count, opd_room, opd_timings, gender, image_url, is_available_today, next_available_slot)
    VALUES (4, 5, 'Dr. Priya Sharma', 'Chief of Paediatrics & Child Health', 'MBBS, MD (Pediatrics, AIIMS)', 'Paediatrics', 14, 1000.00, 'English, Hindi', 4.8, 860, 'Block C, 1st Floor, Room 102', 'Mon - Sat (09:30 AM - 07:00 PM)', 'Female', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPp3ZXfiy-0fMeS-m_Y1TjT7kNKbfLlCdjk9cnK56ANR9LbfoQkBQ97rKVE89pGRDYIAH_Ye5M24kE2IvhypWm8d6ItFWzBENInRplt4T0WbZoZTKU-JIJ20877GT0OBB6KSWz-j_qzx3ceaPIciTSO382prDZWpWnb_Sn5ks42A8bXT0JUGCw6Wnl0eARtLmnwSatQOXgxfe2zFXPLgL3PVtZDdk4RaLTLTaPfL54b4hEqFORjS87fA', 1, 'Today, 06:00 PM');
SET IDENTITY_INSERT doctors OFF;

-- 5. Seed Patients
SET IDENTITY_INSERT patients ON;
IF NOT EXISTS (SELECT 1 FROM patients WHERE id = 1)
    INSERT INTO patients (id, user_id, uhid, abha_id, full_name, email, mobile_number, date_of_birth, age_years, gender, blood_group, address, emergency_contact, insurance_provider, insurance_policy_number, is_cashless_preapproved, primary_doctor_id)
    VALUES (1, 1, 'MC-2024-88412', '91-8841-2094-11', 'Ramesh Chand Sharma', 'ramesh.sharma@example.in', '+91 98112 45678', '1972-06-15', 52, 'Male', 'B+', 'C-42 Greater Kailash I, New Delhi', '+91 98112 99887', 'Star Health', 'SH-POL-9920184', 1, 1);
SET IDENTITY_INSERT patients OFF;

-- 6. Seed Appointments
SET IDENTITY_INSERT appointments ON;
IF NOT EXISTS (SELECT 1 FROM appointments WHERE id = 1)
    INSERT INTO appointments (id, appointment_number, token_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, session_type, consultation_type, status, reason_symptoms, is_cashless_insurance, insurance_provider, fee_amount, registration_fee_waived, payment_status, queue_number, patients_ahead)
    VALUES (1, 'APT-2024-1024-001', 'B-14', 1, 1, 1, CAST(GETDATE() AS DATE), '04:30 PM', 'EVENING', 'IN_HOSPITAL_OPD', 'CONFIRMED', 'Routine cardiac follow-up, mild shortness of breath during morning walk, ECG review.', 1, 'Star Health', 1500.00, 1, 'PAID', 14, 3);
SET IDENTITY_INSERT appointments OFF;

-- 7. Seed Diagnostic Lab Reports
SET IDENTITY_INSERT lab_reports ON;
IF NOT EXISTS (SELECT 1 FROM lab_reports WHERE id = 1)
    INSERT INTO lab_reports (id, report_number, patient_id, referring_doctor_id, test_name, category, test_date, status, status_badge, metric_highlight, result_summary, lab_facility, file_url)
    VALUES (1, 'LAB-2024-9901', 1, 1, 'Lipid Profile Extended (Serum)', 'Biochemistry', DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'NORMAL_VALUES', 'NORMAL VALUES', 'Cholesterol: 174 mg/dL', 'Total Cholesterol 174 mg/dL (Normal <200), HDL 48 mg/dL, LDL 102 mg/dL, Triglycerides 130 mg/dL. Values well controlled within baseline therapeutic targets.', 'NABL Certified Central Clinical Laboratories', '/reports/lipid-profile.pdf');

IF NOT EXISTS (SELECT 1 FROM lab_reports WHERE id = 2)
    INSERT INTO lab_reports (id, report_number, patient_id, referring_doctor_id, test_name, category, test_date, status, status_badge, metric_highlight, result_summary, lab_facility, file_url)
    VALUES (2, 'LAB-2024-9902', 1, 1, '12-Lead Electrocardiogram (ECG)', 'Cardiac Diagnostics', DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'PENDING_REVIEW', 'OPD REVIEW PENDING', 'Sinus Rhythm @ 72 bpm', 'Normal sinus rhythm at 72 bpm, normal axis, no acute ST-T wave changes detected. Awaiting physical clinical review by Dr. Arvind Mehra during OPD.', 'Cardiac Telemetry Lab, Block B', '/reports/ecg-report.pdf');

IF NOT EXISTS (SELECT 1 FROM lab_reports WHERE id = 3)
    INSERT INTO lab_reports (id, report_number, patient_id, referring_doctor_id, test_name, category, test_date, status, status_badge, metric_highlight, result_summary, lab_facility, file_url)
    VALUES (3, 'LAB-2024-9903', 1, 1, 'HbA1c & Fasting Blood Sugar', 'Endocrinology', DATEADD(DAY, -9, CAST(GETDATE() AS DATE)), 'COMPLETED', 'COMPLETED', 'HbA1c: 5.8% (Optimal)', 'HbA1c estimated at 5.8% representing optimal glycaemic control over past 90 days. Fasting blood sugar 94 mg/dL.', 'Central Clinical Laboratories', '/reports/hba1c-report.pdf');
SET IDENTITY_INSERT lab_reports OFF;

-- 8. Seed Prescriptions & Prescription Items
SET IDENTITY_INSERT prescriptions ON;
IF NOT EXISTS (SELECT 1 FROM prescriptions WHERE id = 1)
    INSERT INTO prescriptions (id, prescription_number, patient_id, doctor_id, issued_date, next_review_date, lifestyle_instructions, is_active)
    VALUES (1, 'RX-2024-8841-01', 1, 1, DATEADD(MONTH, -1, CAST(GETDATE() AS DATE)), CAST(GETDATE() AS DATE), 'Strictly maintain low-sodium diet (< 2g salt/day). Avoid fried snacks and saturated oils. Continue brisk 30-minute morning walks at steady pace. Schedule repeat Lipid Profile and Serum Creatinine test after 4 weeks before next follow-up.', 1);
SET IDENTITY_INSERT prescriptions OFF;

SET IDENTITY_INSERT prescription_items ON;
IF NOT EXISTS (SELECT 1 FROM prescription_items WHERE id = 1)
    INSERT INTO prescription_items (id, prescription_id, medicine_name, category, dosage, timing_instructions, timing_badge, duration_days, days_left)
    VALUES (1, 1, 'Atorvastatin 20mg', 'STATIN', '20mg', '1 Tablet at Bedtime (HS)', 'Night Dose', 30, 18);

IF NOT EXISTS (SELECT 1 FROM prescription_items WHERE id = 2)
    INSERT INTO prescription_items (id, prescription_id, medicine_name, category, dosage, timing_instructions, timing_badge, duration_days, days_left)
    VALUES (2, 1, 'Telmisartan 40mg', 'ANTI-HYPERTENSIVE', '40mg', '1 Tablet Morning after food (PC)', 'Morning Dose', 30, 18);

IF NOT EXISTS (SELECT 1 FROM prescription_items WHERE id = 3)
    INSERT INTO prescription_items (id, prescription_id, medicine_name, category, dosage, timing_instructions, timing_badge, duration_days, days_left)
    VALUES (3, 1, 'Aspirin 75mg (EC)', 'BLOOD THINNER', '75mg Enteric Coated', '1 Tablet Post-Lunch', 'Afternoon Dose', 30, 18);
SET IDENTITY_INSERT prescription_items OFF;

-- 9. Seed Patient Vitals History
SET IDENTITY_INSERT patient_vitals ON;
IF NOT EXISTS (SELECT 1 FROM patient_vitals WHERE id = 1)
    INSERT INTO patient_vitals (id, patient_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, oxygen_saturation, bmi, bp_status, hr_status, spo2_status, bmi_status)
    VALUES (1, 1, SYSUTCDATETIME(), 128, 82, 72, 98, 24.2, 'Normal Baseline', 'Resting Regular', 'Adequate Saturation', 'Healthy Range');

IF NOT EXISTS (SELECT 1 FROM patient_vitals WHERE id = 2)
    INSERT INTO patient_vitals (id, patient_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, oxygen_saturation, bmi, bp_status, hr_status, spo2_status, bmi_status)
    VALUES (2, 1, DATEADD(MONTH, -1, SYSUTCDATETIME()), 132, 84, 75, 98, 24.5, 'Normal Baseline', 'Resting Regular', 'Adequate Saturation', 'Healthy Range');

IF NOT EXISTS (SELECT 1 FROM patient_vitals WHERE id = 3)
    INSERT INTO patient_vitals (id, patient_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, oxygen_saturation, bmi, bp_status, hr_status, spo2_status, bmi_status)
    VALUES (3, 1, DATEADD(MONTH, -2, SYSUTCDATETIME()), 136, 86, 78, 97, 24.8, 'Prehypertension', 'Resting Regular', 'Adequate Saturation', 'Healthy Range');

IF NOT EXISTS (SELECT 1 FROM patient_vitals WHERE id = 4)
    INSERT INTO patient_vitals (id, patient_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, oxygen_saturation, bmi, bp_status, hr_status, spo2_status, bmi_status)
    VALUES (4, 1, DATEADD(MONTH, -3, SYSUTCDATETIME()), 140, 90, 80, 98, 25.1, 'Stage 1 HTN', 'Resting Regular', 'Adequate Saturation', 'Overweight');

IF NOT EXISTS (SELECT 1 FROM patient_vitals WHERE id = 5)
    INSERT INTO patient_vitals (id, patient_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, oxygen_saturation, bmi, bp_status, hr_status, spo2_status, bmi_status)
    VALUES (5, 1, DATEADD(MONTH, -4, SYSUTCDATETIME()), 142, 92, 82, 97, 25.3, 'Stage 1 HTN', 'Resting Regular', 'Adequate Saturation', 'Overweight');
SET IDENTITY_INSERT patient_vitals OFF;
