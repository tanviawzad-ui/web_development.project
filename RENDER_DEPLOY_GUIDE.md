# 🚀 MediCare Hospital Management System — Render Deployment Guide

This guide walks you through deploying the full-stack MediCare Hospital Appointment Management System (**Spring Boot 3 + PostgreSQL + React 18 + Vite**) to [Render](https://render.com).

---

## 🏗️ Architecture on Render

```mermaid
graph TD
    Client["User Browser"]
    
    subgraph RenderCloud ["Render Cloud Infrastructure"]
        StaticSite["Static Site: medicare-frontend<br/>(React 18 + Vite SPA)"]
        WebService["Web Service: medicare-backend<br/>(Spring Boot 3 Docker Container)"]
        PostgresDB[("Managed Database: medicare-db<br/>(PostgreSQL 16)")]
    end
    
    Client -->|HTTPS| StaticSite
    StaticSite -->|API Calls: Bearer JWT| WebService
    WebService -->|HikariCP SSL Pool| PostgresDB
```

---

## ⚡ Method 1: 1-Click Blueprint Deployment (Recommended)

Render Blueprints use the included [`render.yaml`](./render.yaml) file to automatically provision the database, backend, and frontend in one click.

### Steps:
1. **Push your repository to GitHub or GitLab**:
   ```bash
   git add .
   git commit -m "feat: configure cloud deployment for Render"
   git push origin main
   ```

2. **Open Render**:
   - Log in to your [Render Dashboard](https://dashboard.render.com).
   - Click the **New +** button in the top navigation bar and select **Blueprint**.

3. **Connect Repository**:
   - Select your `Hospital Appointment management` repository.
   - Render will parse `render.yaml` and display the 3 resources to be created:
     - `medicare-db` (PostgreSQL Database)
     - `medicare-backend` (Docker Web Service)
     - `medicare-frontend` (Static Site)

4. **Click "Apply"**:
   - Render will provision the database, build the backend Docker container, compile the React frontend, and deploy everything automatically.

---

## 🛠️ Method 2: Manual Dashboard Setup

If you prefer to configure each component manually through the Render web console, follow these steps:

### Step 1: Create the Managed PostgreSQL Database
1. In Render Dashboard, click **New +** -> **PostgreSQL**.
2. Configure settings:
   - **Name**: `medicare-db`
   - **Database**: `medicare_db`
   - **User**: `medicare_user`
   - **Region**: Choose the region closest to you (e.g., *Oregon (US West)* or *Frankfurt (EU)*).
   - **Plan**: **Free**
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgres://medicare_user:pass@dpg-xxxx-a:5432/medicare_db`).

---

### Step 2: Deploy the Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your repository.
3. Configure settings:
   - **Name**: `medicare-backend`
   - **Region**: Same region as your database.
   - **Root Directory**: `backend`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile`
   - **Plan**: **Free**
4. Expand **Advanced** -> **Add Environment Variables**:

| Variable Name | Value | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL configuration |
| `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Automatically parsed by `DatabaseConfig.java` |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit Base64 signing key |
| `JWT_EXPIRATION_MS` | `86400000` | 24-hour token validity (in milliseconds) |
| `CORS_ALLOWED_ORIGINS` | `https://*.onrender.com,http://localhost:5173` | Allows cross-origin requests from frontend |

5. Click **Create Web Service**.
6. Note the public URL generated (e.g., `https://medicare-backend.onrender.com`).

---

### Step 3: Deploy the Frontend Static Site
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select your repository.
3. Configure settings:
   - **Name**: `medicare-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects / Rewrites**, add the Single Page Application (SPA) rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures that clicking refresh on `/login`, `/dashboard`, or `/book-appointment` routes properly instead of returning 404).*
5. Under **Environment Variables**, add:

| Variable Name | Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://medicare-backend.onrender.com/api` | Full URL to your deployed backend from Step 2 |

6. Click **Create Static Site**.

---

## 🔑 Pre-Seeded Cloud Credentials

When Spring Boot boots against the empty PostgreSQL database on Render, `DataInitializer.java` automatically runs and populates initial clinical departments, doctors, and demo accounts:

| Account | Email | Password | Role & Features |
|---|---|---|---|
| **Patient Demo** | `ramesh.sharma@example.in` | `Password123!` | Active Token `B-14`, Vitals history, Lab reports, Prescriptions |
| **Admin** | `admin@medicare.com` | `Admin123!` | System Administrator access |

---

## 🩺 Verification & Health Checks

Once deployed:

1. **Backend Health Check**:
   Visit `https://<your-backend>.onrender.com/api/departments` in your browser.
   You should receive a `200 OK` JSON response listing all 4 clinical departments.

2. **Frontend Access**:
   Visit `https://<your-frontend>.onrender.com/login`.
   Click **👤 Demo Patient** and sign in.
   You will land on the Patient Portal Dashboard with active appointment Token `B-14` and live diagnostic records.

3. **Booking an Appointment**:
   Navigate to `/book-appointment`, choose a doctor, date, and slot, then click **Book Consultation**.
   The appointment will be permanently stored in your Render PostgreSQL database.

---

## 💡 Troubleshooting & Cloud Best Practices

### Free Tier "Spin Down" (Cold Starts)
On Render's Free Tier, services spin down after 15 minutes of inactivity. The first request after idle may take 30–50 seconds while the container initializes. Subsequent requests will be fast (< 200ms).

### CORS Issues
If you encounter `Cross-Origin Request Blocked`:
- Verify that `CORS_ALLOWED_ORIGINS` in your backend environment variables includes `https://*.onrender.com`.
- If you attach a custom domain (e.g. `https://hospital.yourdomain.com`), add it to `CORS_ALLOWED_ORIGINS` separated by a comma.

### Database Connection SSL
Render PostgreSQL requires SSL connections (`sslmode=require`). Our `DatabaseConfig.java` class automatically appends `?sslmode=require` and handles URL parsing without any manual configuration.
