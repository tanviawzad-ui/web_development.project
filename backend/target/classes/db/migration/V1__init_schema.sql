-- MediCare Multispeciality Hospital Management System
-- Flyway Database Migration: V1__init_schema.sql
-- Database Engine: Microsoft SQL Server (MSSQL)

-- 1. Roles Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'roles')
BEGIN
    CREATE TABLE roles (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL UNIQUE
    );
END;

-- 2. Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(150) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(150) NOT NULL,
        phone NVARCHAR(30),
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

-- 3. User Roles Mapping Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_roles')
BEGIN
    CREATE TABLE user_roles (
        user_id BIGINT NOT NULL,
        role_id BIGINT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );
END;

-- 4. Departments Table (Centres of Excellence)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'departments')
BEGIN
    CREATE TABLE departments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        code NVARCHAR(50) NOT NULL UNIQUE,
        icon NVARCHAR(50) NOT NULL DEFAULT 'local_hospital',
        description NVARCHAR(MAX),
        sub_specialties NVARCHAR(500),
        total_doctors INT DEFAULT 0,
        opd_clinic_hours NVARCHAR(100) DEFAULT 'Mon - Sat (09:00 AM - 08:00 PM)',
        is_emergency_active BIT DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

-- 5. Doctors Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'doctors')
BEGIN
    CREATE TABLE doctors (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        department_id BIGINT NOT NULL,
        name NVARCHAR(150) NOT NULL,
        title NVARCHAR(150) NOT NULL,
        qualifications NVARCHAR(200) NOT NULL,
        speciality NVARCHAR(100) NOT NULL,
        experience_years INT NOT NULL DEFAULT 0,
        consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
        languages_spoken NVARCHAR(200) DEFAULT 'English, Hindi',
        rating DECIMAL(3,2) DEFAULT 4.9,
        reviews_count INT DEFAULT 100,
        opd_room NVARCHAR(100) DEFAULT 'Block B, 2nd Floor, Room 204',
        opd_timings NVARCHAR(100) DEFAULT 'Mon - Sat (09:00 AM - 08:00 PM)',
        gender NVARCHAR(20) DEFAULT 'Male',
        image_url NVARCHAR(500),
        is_available_today BIT DEFAULT 1,
        next_available_slot NVARCHAR(50) DEFAULT 'Today, 04:30 PM',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_doctors_department FOREIGN KEY (department_id) REFERENCES departments(id)
    );
END;

-- 6. Patients Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'patients')
BEGIN
    CREATE TABLE patients (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NULL,
        uhid NVARCHAR(50) NOT NULL UNIQUE,
        abha_id NVARCHAR(50),
        full_name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150),
        mobile_number NVARCHAR(30) NOT NULL,
        date_of_birth DATE,
        age_years INT,
        gender NVARCHAR(20) DEFAULT 'Male',
        blood_group NVARCHAR(10) DEFAULT 'B+',
        address NVARCHAR(300),
        emergency_contact NVARCHAR(30),
        insurance_provider NVARCHAR(100),
        insurance_policy_number NVARCHAR(100),
        is_cashless_preapproved BIT DEFAULT 0,
        primary_doctor_id BIGINT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_patients_primary_doctor FOREIGN KEY (primary_doctor_id) REFERENCES doctors(id)
    );
END;

-- 7. Appointments Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'appointments')
BEGIN
    CREATE TABLE appointments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        appointment_number NVARCHAR(50) NOT NULL UNIQUE,
        token_id NVARCHAR(20) NOT NULL,
        patient_id BIGINT NOT NULL,
        doctor_id BIGINT NOT NULL,
        department_id BIGINT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time NVARCHAR(20) NOT NULL,
        session_type NVARCHAR(20) NOT NULL DEFAULT 'EVENING', -- MORNING, EVENING
        consultation_type NVARCHAR(30) NOT NULL DEFAULT 'IN_HOSPITAL_OPD', -- IN_HOSPITAL_OPD, VIDEO_CONSULTATION
        status NVARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED
        reason_symptoms NVARCHAR(MAX),
        is_cashless_insurance BIT NOT NULL DEFAULT 0,
        insurance_provider NVARCHAR(100),
        fee_amount DECIMAL(10,2) NOT NULL DEFAULT 1500.00,
        registration_fee_waived BIT NOT NULL DEFAULT 1,
        payment_status NVARCHAR(30) NOT NULL DEFAULT 'PAID', -- PENDING, PAID, WAIVED
        queue_number INT DEFAULT 1,
        patients_ahead INT DEFAULT 3,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
        CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        CONSTRAINT fk_appointments_department FOREIGN KEY (department_id) REFERENCES departments(id)
    );
END;

-- 8. Lab & Diagnostic Reports Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lab_reports')
BEGIN
    CREATE TABLE lab_reports (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        report_number NVARCHAR(50) NOT NULL UNIQUE,
        patient_id BIGINT NOT NULL,
        referring_doctor_id BIGINT NULL,
        test_name NVARCHAR(200) NOT NULL,
        category NVARCHAR(100) DEFAULT 'Pathology',
        test_date DATE NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, NORMAL_VALUES, PENDING_REVIEW
        status_badge NVARCHAR(50) DEFAULT 'NORMAL VALUES',
        metric_highlight NVARCHAR(150),
        result_summary NVARCHAR(MAX),
        lab_facility NVARCHAR(150) DEFAULT 'NABL Certified Central Clinical Laboratories',
        file_url NVARCHAR(500),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_lab_reports_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
        CONSTRAINT fk_lab_reports_doctor FOREIGN KEY (referring_doctor_id) REFERENCES doctors(id)
    );
END;

-- 9. Prescriptions Table (Digital Rx)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'prescriptions')
BEGIN
    CREATE TABLE prescriptions (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        prescription_number NVARCHAR(50) NOT NULL UNIQUE,
        patient_id BIGINT NOT NULL,
        doctor_id BIGINT NOT NULL,
        issued_date DATE NOT NULL,
        next_review_date DATE,
        lifestyle_instructions NVARCHAR(MAX),
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_prescriptions_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
        CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );
END;

-- 10. Prescription Items Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'prescription_items')
BEGIN
    CREATE TABLE prescription_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        prescription_id BIGINT NOT NULL,
        medicine_name NVARCHAR(150) NOT NULL,
        category NVARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- STATIN, ANTI-HYPERTENSIVE, BLOOD THINNER, etc.
        dosage NVARCHAR(100) NOT NULL,
        timing_instructions NVARCHAR(150) NOT NULL,
        timing_badge NVARCHAR(50) DEFAULT 'Morning Dose',
        duration_days INT NOT NULL DEFAULT 30,
        days_left INT NOT NULL DEFAULT 30,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_prescription_items_rx FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
    );
END;

-- 11. Patient Vitals History Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'patient_vitals')
BEGIN
    CREATE TABLE patient_vitals (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        patient_id BIGINT NOT NULL,
        recorded_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        blood_pressure_systolic INT NOT NULL,
        blood_pressure_diastolic INT NOT NULL,
        heart_rate INT NOT NULL,
        oxygen_saturation INT NOT NULL,
        bmi DECIMAL(4,1) NOT NULL,
        bp_status NVARCHAR(50) DEFAULT 'Normal Baseline',
        hr_status NVARCHAR(50) DEFAULT 'Resting Regular',
        spo2_status NVARCHAR(50) DEFAULT 'Adequate Saturation',
        bmi_status NVARCHAR(50) DEFAULT 'Healthy Range',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_patient_vitals_patient FOREIGN KEY (patient_id) REFERENCES patients(id)
    );
END;

-- Indexes for Optimal Query Performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_patients_uhid')
    CREATE NONCLUSTERED INDEX idx_patients_uhid ON patients(uhid);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_patients_mobile')
    CREATE NONCLUSTERED INDEX idx_patients_mobile ON patients(mobile_number);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_doctors_department')
    CREATE NONCLUSTERED INDEX idx_doctors_department ON doctors(department_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_appointments_date')
    CREATE NONCLUSTERED INDEX idx_appointments_date ON appointments(appointment_date);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_appointments_patient')
    CREATE NONCLUSTERED INDEX idx_appointments_patient ON appointments(patient_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_appointments_doctor')
    CREATE NONCLUSTERED INDEX idx_appointments_doctor ON appointments(doctor_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_lab_reports_patient')
    CREATE NONCLUSTERED INDEX idx_lab_reports_patient ON lab_reports(patient_id);
