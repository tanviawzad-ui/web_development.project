# Medicare - Hospital Appointment Management System

A full-stack, enterprise-grade Hospital Appointment Management web application built around pixel-perfect Stitch UI designs. Features interactive appointment booking, doctor directory with real-time filtering, patient health dashboard, lab report lookup, digital prescriptions, and end-to-end JWT security.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios | Component-based SPA with custom design tokens matching Stitch specifications |
| **Backend** | Spring Boot 3.3.3, Java 17+, Spring Data JPA, Spring Security 6, JJWT 0.12.6, Flyway | RESTful microservice architecture with stateless JWT authentication and role-based access |
| **Database** | Microsoft SQL Server (MSSQL) 2019/2022 | Relational schema with normalized tables, Flyway version-controlled migrations |
| **Design System** | Stitch Design System | Full token mapping: Plus Jakarta Sans / Inter fonts, Material Symbols, custom Tailwind color tokens |

---

## 📁 Repository Structure

```
Hospital Appointment management/
├── backend/
│   ├── src/main/java/com/yourorg/appname/
│   │   ├── Application.java               # Spring Boot Application Entrypoint
│   │   ├── config/                        # SecurityConfig, CorsConfig
│   │   ├── controller/                    # REST API Controllers (Auth, Doctors, Appointments, etc.)
│   │   ├── dto/                           # Request & Response DTOs
│   │   ├── entity/                        # JPA Entities (User, Role, Doctor, Appointment, etc.)
│   │   ├── exception/                     # Custom Exceptions & GlobalExceptionHandler
│   │   ├── mapper/                        # Entity-DTO mapping utilities
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── security/                      # JwtUtil, JwtAuthFilter, UserPrincipal, CustomUserDetailsService
│   │   └── service/                       # Service interfaces & implementation classes
│   ├── src/main/resources/
│   │   ├── application.properties         # MSSQL & JWT configurations
│   │   └── db/migration/                  # Flyway migrations (V1 schema, V2 seed data)
│   ├── pom.xml                            # Maven dependencies & build configuration
│   └── mvnw.cmd                           # Windows Maven Wrapper
├── frontend/
│   ├── src/
│   │   ├── assets/                        # Local images, doctor avatars, hospital photography
│   │   ├── components/
│   │   │   ├── common/                    # Header, Footer, Modals (AppointmentConfirmModal, ReportLookupModal)
│   │   │   └── layout/                    # MainLayout (public pages), DashboardLayout (patient portal)
│   │   ├── context/                       # AuthContext & AuthProvider
│   │   ├── hooks/                         # useAuth custom hook
│   │   ├── pages/
│   │   │   ├── Home/                      # HomePage (Stitch Hero, Highlights, Quick Actions)
│   │   │   ├── Doctors/                   # DoctorsPage (Directory, Department/Experience/Availability filters)
│   │   │   ├── Appointments/              # BookAppointmentPage (Multi-step booking flow, doctor selection)
│   │   │   ├── Dashboard/                 # DashboardPage (Vitals, Active Token B-14, Reports, Prescriptions)
│   │   │   └── Auth/                      # LoginPage & RegisterPage
│   │   ├── routes/                        # AppRoutes & ProtectedRoute
│   │   ├── services/                      # apiClient (Axios + JWT interceptor) & module API services
│   │   ├── utils/                         # Date/Time formatters & currency helpers
│   │   └── constants/                     # apiEndpoints.js
│   ├── tailwind.config.js                 # Exact Stitch color tokens & styling extensions
│   ├── vite.config.js                     # Vite build config with /api proxy to 8080
│   └── package.json                       # Frontend dependencies & scripts
├── database/
│   └── migrations/
│       ├── V1__init_schema.sql            # Normalized MSSQL DDL with foreign keys & indexes
│       └── V2__seed_data.sql              # Seed departments, doctors, demo patient, appointments
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Java Development Kit (JDK)**: Java 17 or higher (tested on Java 25 LTS)
- **Node.js**: Node 18+ and `npm`
- **Database**: Microsoft SQL Server (2019, 2022, or Azure SQL Edge)
  - You can also run MSSQL via Docker:
    ```bash
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword123!" -p 1433:1433 --name mssql -d mcr.microsoft.com/mssql/server:2022-latest
    ```

---

### 2. Database Configuration

1. Connect to your MSSQL instance (via SSMS, Azure Data Studio, or SQLCMD) and create the database:
   ```sql
   CREATE DATABASE medicare_db;
   GO
   ```

2. Configure backend database credentials in `backend/src/main/resources/application-mssql.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=medicare_db;encrypt=false;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=YourStrong@Passw0rd
   ```

3. **Automatic Migrations**: When the Spring Boot application starts, **Flyway** will automatically run:
   - `V1__init_schema.sql`: Creates 11 tables (`roles`, `users`, `user_roles`, `departments`, `doctors`, `patients`, `appointments`, `lab_reports`, `prescriptions`, `prescription_items`, `patient_vitals`).
   - `V2__seed_data.sql`: Seeds 6 clinical departments, 4 specialized doctors, default patient and admin accounts, active appointments, vitals history, and sample lab reports.

---

### 3. Backend Setup & Startup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   - Using the included Maven wrapper on Windows:
     ```cmd
     .\mvnw.cmd spring-boot:run
     ```
   - Or using system Maven:
     ```bash
     mvn spring-boot:run
     ```

3. The backend will start on **`http://localhost:8081`**.
   - Health check: `GET http://localhost:8081/api/departments`

---

### 4. Frontend Setup & Startup

1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   *(Vite automatically proxies all `/api/*` requests to the Spring Boot backend at `http://localhost:8081`).*

5. To create an optimized production build:
   ```bash
   npm run build
   ```

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Patient** | `ramesh.sharma@example.in` | `Password123!` | Has active confirmed appointment (Token B-14), vitals history, and lab reports |
| **Administrator** | `admin@medicare.com` | `Admin123!` | System administrator privileges |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate with email & password, returns JWT token and user profile.
- `POST /api/auth/register`: Register new patient account, returns JWT and patient record.
- `GET /api/auth/me`: Get current authenticated user details.

### Clinical Departments (`/api/departments`)
- `GET /api/departments`: List all active hospital departments.

### Doctors (`/api/doctors`)
- `GET /api/doctors`: Query doctors with optional filtering (`departmentId`, `search`, `experienceMin`, `availableToday`).
- `GET /api/doctors/{id}`: Get doctor profile, credentials, and consultation fee.

### Appointments (`/api/appointments`)
- `POST /api/appointments`: Book an appointment (generates unique queue token, e.g., `Token B-14`).
- `GET /api/appointments/my`: List authenticated patient appointments.
- `PUT /api/appointments/{id}/cancel`: Cancel an existing appointment.
- `PUT /api/appointments/{id}/reschedule`: Reschedule appointment date and slot.

### Patient Portal (`/api/patients`)
- `GET /api/patients/me`: Get patient profile information.
- `PUT /api/patients/me`: Update emergency contact and personal details.
- `GET /api/patients/me/vitals`: Retrieve vital signs history (Blood Pressure, Heart Rate, SpO2, BMI).
- `GET /api/patients/me/dashboard-summary`: Unified summary for dashboard header (vitals, current queue status, upcoming count).

### Lab Reports & Prescriptions (`/api/reports`, `/api/prescriptions`)
- `GET /api/reports/my`: List all diagnostic reports for the authenticated patient.
- `POST /api/reports/lookup`: Public lookup by Report ID and Patient DOB / Registration Number.
- `GET /api/prescriptions/my`: List patient digital prescriptions with dosage instructions.
- `GET /api/prescriptions/{id}`: Detailed prescription view including medication items.

---

## 🔒 Security Architecture

- **Stateless Authentication**: JJWT generates signed HS256 tokens with configurable expiration (24 hours).
- **Security Filter Chain**: `JwtAuthFilter` extracts and validates the Bearer token from the `Authorization` header on protected endpoints.
- **Client Interceptor**: `apiClient.js` automatically attaches the active JWT token from `localStorage` to all outbound Axios requests.
- **Automatic 401 Handling**: If a token expires or is rejected, Axios response interceptor clears the session and smoothly navigates the user to `/login`.

---

## 🎨 Stitch UI Visual Fidelity

The application faithfully preserves all Stitch design elements:
- **Design Tokens**: Direct implementation of colors (`primary`: `#000f22`, `secondary`: `#006b5f`, `surface-container`: `#e8f0fe`, `tertiary`: `#005792`).
- **Typography**: Inter and Plus Jakarta Sans font families.
- **Iconography**: Google Material Symbols Outlined.
- **Responsive Layouts**: Desktop, tablet, and mobile navigation with high-contrast healthcare indicators and accessible contrast ratios.
#   w e b _ d e v e l o p m e n t . p r o j e c t  
 