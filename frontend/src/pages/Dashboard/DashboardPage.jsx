import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { prescriptionService } from '../../services/prescriptionService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboard = async () => {
    try {
      const res = await patientService.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCancelSlot = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this outpatient appointment?')) return;
    try {
      const res = await appointmentService.cancelAppointment(appointmentId);
      if (res.success) {
        setActionMessage('Appointment slot successfully cancelled.');
        loadDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleRefill = async (prescriptionId) => {
    try {
      const res = await prescriptionService.refillPrescription(prescriptionId);
      if (res.success) {
        setActionMessage('Prescription refill order confirmed with MediCare 24x7 E-Pharmacy!');
        loadDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Refill request error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[40px] animate-spin">progress_activity</span>
          <span className="font-body-md">Loading your clinical health dossier...</span>
        </div>
      </div>
    );
  }

  const patient = dashboardData?.patient || user?.patient;
  const activeAppt = dashboardData?.activeAppointment;
  const reports = dashboardData?.recentReports || [];
  const prescriptions = dashboardData?.activePrescriptions || [];
  const latestVitals = dashboardData?.latestVitals;

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {actionMessage && (
        <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container font-label-md flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage('')} className="p-1 hover:opacity-80">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* 1. Patient Welcome & Demographics Banner */}
      <header className="bg-primary text-on-primary rounded-xl p-space-lg shadow-md relative overflow-hidden flex flex-col gap-space-md border border-primary-container">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-surface-container-highest/5 pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md z-10">
          <div className="flex flex-col gap-space-2xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-label-sm bg-secondary text-on-secondary px-space-xs py-0.5 rounded-full uppercase tracking-wider font-bold">
                OPD Registered
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container-highest/20 text-surface-container-lowest px-space-xs py-0.5 rounded font-mono font-semibold">
                UHID: {patient?.uhid || 'MC-2024-88412'}
              </span>
            </div>
            <h1 className="font-display text-headline-lg text-on-primary tracking-tight font-bold">
              Welcome back, {patient?.fullName || user?.fullName || 'Ramesh Sharma'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-on-primary/80 font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-body-md text-secondary-fixed">person</span>
                {patient?.ageYears || 52} Y, {patient?.gender || 'Male'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-body-md text-error-container">bloodtype</span>
                Blood Group: <strong className="text-on-primary">{patient?.bloodGroup || 'B+ Positive'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-body-md text-secondary-container">stethoscope</span>
                Primary: <strong>{patient?.primaryDoctorName || 'Dr. Arvind Mehra (Cardiology)'}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-xs shrink-0">
            <Link
              to="/book-appointment"
              className="flex items-center gap-space-2xs bg-secondary text-on-secondary hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed px-space-md py-space-xs rounded-lg font-title-md text-body-md shadow transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-headline-sm">add_circle</span>
              <span>Book OPD Slot</span>
            </Link>
            <button
              type="button"
              onClick={() => alert('Generating Comprehensive Patient Health Dossier (PDF)...')}
              className="flex items-center gap-space-2xs bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors px-space-sm py-space-xs rounded-lg font-title-md text-body-md shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-headline-sm">file_download</span>
              <span>Health Summary</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Hospital OCR Document Scanner ready for prescription upload.')}
              className="flex items-center gap-space-2xs bg-surface-container-highest/20 text-on-primary hover:bg-surface-container-highest/30 transition-colors px-space-sm py-space-xs rounded-lg font-title-md text-body-md font-semibold"
            >
              <span className="material-symbols-outlined text-headline-sm">upload_file</span>
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 4 Stat Metric Cards */}
      <section aria-label="Quick Clinical Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Metric 1: Upcoming Appointments */}
        <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Upcoming Visit
            </span>
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-headline-sm">calendar_clock</span>
            </div>
          </div>
          <div>
            <div className="font-display text-headline-md text-on-surface font-bold">
              {activeAppt ? '1 Confirmed' : '0 Scheduled'}
            </div>
            <p className="font-body-sm text-body-sm text-secondary font-semibold mt-0.5">
              {activeAppt
                ? `${formatDate(activeAppt.appointmentDate)} at ${activeAppt.appointmentTime}`
                : 'No pending appointments'}
            </p>
          </div>
        </article>

        {/* Metric 2: Active Prescriptions */}
        <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Active Prescriptions
            </span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-headline-sm">medication</span>
            </div>
          </div>
          <div>
            <div className="font-display text-headline-md text-on-surface font-bold">
              {dashboardData?.activePrescriptionCount || 3} Medications
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Cardiac maintenance regimen
            </p>
          </div>
        </article>

        {/* Metric 3: Lab Reports Available */}
        <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Diagnostic Tests
            </span>
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-headline-sm">chips</span>
            </div>
          </div>
          <div>
            <div className="font-display text-headline-md text-on-surface font-bold">
              {reports.length} Reports Ready
            </div>
            <p className="font-body-sm text-body-sm text-secondary font-semibold mt-0.5 truncate">
              {reports.length > 0 ? reports[0].testName : 'All results uploaded'}
            </p>
          </div>
        </article>

        {/* Metric 4: Outstanding Invoices */}
        <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Billing Ledger
            </span>
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-headline-sm">credit_score</span>
            </div>
          </div>
          <div>
            <div className="font-display text-headline-md text-primary font-currency-stat font-bold">
              {dashboardData?.outstandingBalance || '₹0.00 Due'}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Star Health Cashless Pre-Approved
            </p>
          </div>
        </article>
      </section>

      {/* 3. Prominent Upcoming Appointment & Live Queue Stage */}
      {activeAppt ? (
        <section aria-label="Active Consultation Stage" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Active Appointment Desk</span>
              <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                {activeAppt.status || 'CONFIRMED'}
              </span>
            </div>
            <div className="flex items-center gap-space-xs font-label-md text-label-md bg-surface-container px-space-sm py-1 rounded-full text-on-surface border border-surface-container">
              <span className="material-symbols-outlined text-body-md text-secondary">timer</span>
              <span>Live OPD Queue: Token {activeAppt.tokenId} ({activeAppt.patientsAhead || 3} Patients Ahead)</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-center gap-space-lg border border-surface-container">
            {/* Doctor Portrait */}
            <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-surface-container">
              <img
                className="w-full h-full object-cover object-top"
                alt={activeAppt.doctorName}
                src={activeAppt.doctorImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiwaQQBqdzAi0DvLvKN0L36_xHgovW0MRvdKLtQVXO4aRQCUuBYjsTdw50xiXMTXtVVusNdJ_V-Qwe2b60za9mMUltH-csvwaMuL0sMwKhQzuC9lmLjhhk5wisAiCT6UplkULak7VF5hPlaSK2wwFSuz8k1gWEJmxDYSKWErFU8HRiWHCIO60vvpKSgPFX7CxnzLI9Xav1tvbMkmX1W_Kx8rNyZGFbs6MufomQYGOePc0jGKw9HC-1BA'}
              />
              <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
            </div>

            {/* Doctor & Slot Meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <h2 className="font-display text-headline-md text-on-surface font-bold">{activeAppt.doctorName}</h2>
                <span className="font-label-sm text-label-sm bg-surface-container-lowest text-primary px-space-xs py-0.5 rounded font-semibold border border-surface-container">
                  {activeAppt.doctorQualifications || 'MBBS, MD, DM (Cardiology)'}
                </span>
              </div>
              <p className="font-title-md text-title-md text-secondary font-semibold">
                Chairman &amp; Senior Interventional Cardiologist
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-space-md gap-y-space-xs mt-space-2xs text-body-sm font-body-sm text-on-surface-variant">
                <div className="flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-body-md text-primary">schedule</span>
                  <span>{formatDate(activeAppt.appointmentDate)} • <strong>{activeAppt.appointmentTime}</strong></span>
                </div>
                <div className="flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-body-md text-primary">pin_drop</span>
                  <span>{activeAppt.doctorOpdRoom || 'OPD Block B, 2nd Floor, Room 204'}</span>
                </div>
                <div className="flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-body-md text-primary">confirmation_number</span>
                  <span>Token ID: <strong className="text-on-surface font-mono">{activeAppt.tokenId}</strong> (Slot #{activeAppt.queueNumber || 4})</span>
                </div>
                <div className="flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-body-md text-primary">translate</span>
                  <span>Hindi, English, Punjabi</span>
                </div>
              </div>
            </div>

            {/* Appointment Actions Stack */}
            <div className="flex flex-col gap-space-xs w-full md:w-48 shrink-0">
              <button
                type="button"
                onClick={() => alert(`Gate Pass Token: ${activeAppt.tokenId}\nPatient: ${activeAppt.patientName}\nAuthorized for Hospital OPD Block B`)}
                className="w-full bg-primary text-on-primary py-space-xs px-space-sm rounded-lg font-title-md text-body-md hover:bg-primary-container transition-colors flex items-center justify-center gap-space-2xs shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined text-headline-sm">qr_code_2</span>
                <span>Gate Pass QR</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Opening MediCare Indoor Hospital Wayfinding Map...')}
                className="w-full bg-surface-container-lowest text-on-surface py-space-xs px-space-sm rounded-lg font-title-md text-body-md hover:bg-surface-container transition-colors flex items-center justify-center gap-space-2xs shadow-sm border border-surface-container font-semibold"
              >
                <span className="material-symbols-outlined text-body-md text-secondary">explore</span>
                <span>Indoor Wayfinding</span>
              </button>
              <div className="flex items-center justify-between gap-space-xs pt-1">
                <Link
                  to={`/book-appointment?doctorId=${activeAppt.doctorId}`}
                  className="text-label-md font-label-md text-primary hover:underline font-bold"
                >
                  Reschedule
                </Link>
                <button
                  type="button"
                  onClick={() => handleCancelSlot(activeAppt.id)}
                  className="text-label-md font-label-md text-error hover:underline font-bold"
                >
                  Cancel Slot
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex items-center justify-between border border-surface-container">
          <div>
            <h3 className="font-title-lg font-bold text-primary">No Active Appointment Booked</h3>
            <p className="font-body-sm text-on-surface-variant">Schedule an OPD consultation with our renowned specialists.</p>
          </div>
          <Link
            to="/book-appointment"
            className="px-5 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md font-bold shadow-sm"
          >
            Book Appointment
          </Link>
        </section>
      )}

      {/* 4. Split Clinical Grid: Lab Reports & Vitals Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
        {/* Left: Diagnostic Tests & Reports (7 Cols) */}
        <section aria-label="Diagnostic Investigations" className="xl:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-headline-md text-primary">lab_profile</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold font-display">Recent Lab &amp; Imaging Reports</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Validated by NABL Certified Central Clinical Laboratories</p>
              </div>
            </div>
            <button
              onClick={() => alert('All historical laboratory records are listed below.')}
              className="font-title-md text-body-sm text-secondary hover:underline font-semibold"
            >
              View All ({reports.length})
            </button>
          </div>

          {/* Reports List Table-Card */}
          <div className="flex flex-col gap-space-xs">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-surface-container-low p-space-md rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-surface-container"
              >
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-headline-sm">
                      {rep.category?.toLowerCase().includes('cardiac') ? 'ecg_heart' : 'bloodtype'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-bold">{rep.testName}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Done {formatDate(rep.testDate)} • Ref: {rep.referringDoctorName || 'Dr. Arvind Mehra'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-label-sm text-[10px] bg-secondary-container/60 text-on-secondary-container px-space-xs py-0.5 rounded font-bold">
                        {rep.statusBadge || 'NORMAL VALUES'}
                      </span>
                      {rep.metricHighlight && (
                        <span className="font-body-sm text-xs text-on-surface-variant">{rep.metricHighlight}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified PDF report: ${rep.testName}`)}
                  className="self-end sm:self-center flex items-center gap-space-2xs bg-surface-container-lowest text-primary px-space-sm py-space-xs rounded-lg font-title-md text-body-sm hover:bg-surface-container transition-colors shadow-sm border border-surface-container font-semibold"
                >
                  <span className="material-symbols-outlined text-body-md text-secondary">picture_as_pdf</span>
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Vitals Matrix & Sparkline Visualization (5 Cols) */}
        <section aria-label="Biometric Trends" className="xl:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-headline-md text-secondary">vital_signs</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold font-display">Recorded Patient Vitals</h3>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Today, 10:15 AM</span>
          </div>

          {/* 4 Vitals Tiles */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Blood Pressure</span>
              <div className="font-currency-stat text-currency-stat text-on-surface font-bold">
                {latestVitals?.bloodPressureReading || '128/82'}{' '}
                <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">mmHg</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                {latestVitals?.bpStatus || 'Normal Baseline'}
              </span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Heart Rate</span>
              <div className="font-currency-stat text-currency-stat text-on-surface font-bold">
                {latestVitals?.heartRate || 72}{' '}
                <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">bpm</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                {latestVitals?.hrStatus || 'Resting Regular'}
              </span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Oxygen (SpO2)</span>
              <div className="font-currency-stat text-currency-stat text-on-surface font-bold">
                {latestVitals?.oxygenSaturation || 98}%{' '}
                <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Room Air</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                {latestVitals?.spo2Status || 'Adequate Saturation'}
              </span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">BMI / Body Mass</span>
              <div className="font-currency-stat text-currency-stat text-on-surface font-bold">
                {latestVitals?.bmi || 24.2}{' '}
                <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">kg/m²</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                {latestVitals?.bmiStatus || 'Healthy Range'}
              </span>
            </div>
          </div>

          {/* Trend Chart (BP Stability SVG) */}
          <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-2xs border border-surface-container">
            <div className="flex items-center justify-between text-body-sm">
              <span className="font-title-md text-title-md text-on-surface font-bold">BP Stability (Last 5 Visits)</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">Controlled</span>
            </div>
            <div className="w-full h-24 pt-2">
              <svg className="w-full h-full overflow-visible text-secondary" preserveAspectRatio="none" viewBox="0 0 300 70">
                <defs>
                  <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" x1="0" x2="300" y1="20" y2="20"></line>
                <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" x1="0" x2="300" y1="48" y2="48"></line>
                <path d="M 0,32 Q 40,24 75,28 T 150,22 T 225,26 T 300,20 L 300,68 L 0,68 Z" fill="url(#chartGrad)"></path>
                <path d="M 0,32 Q 40,24 75,28 T 150,22 T 225,26 T 300,20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="0" cy="32" fill="#006b5f" r="3.5"></circle>
                <circle cx="75" cy="28" fill="#006b5f" r="3.5"></circle>
                <circle cx="150" cy="22" fill="#006b5f" r="3.5"></circle>
                <circle cx="225" cy="26" fill="#006b5f" r="3.5"></circle>
                <circle cx="300" cy="20" fill="#0a2540" r="4.5"></circle>
              </svg>
            </div>
            <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-1 font-semibold">
              <span>June</span>
              <span>July</span>
              <span>Aug</span>
              <span>Sept</span>
              <span className="font-bold text-primary">Today</span>
            </div>
          </div>
        </section>
      </div>

      {/* 5. Active Medications / Digital E-Prescription Card */}
      <section aria-label="E-Prescriptions" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-headline-md text-primary">pill</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold font-display">Active Digital E-Prescription (Rx)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Digitally Signed • Validated by Dr. Arvind Mehra • MediCare Pharmacy Integrated</p>
            </div>
          </div>
          {prescriptions.length > 0 && (
            <button
              type="button"
              onClick={() => handleRefill(prescriptions[0].id)}
              className="flex items-center gap-space-2xs bg-secondary text-on-secondary px-space-md py-space-xs rounded-lg font-title-md text-body-md hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed transition-colors shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-headline-sm">local_pharmacy</span>
              <span>Refill at Hospital Pharmacy</span>
            </button>
          )}
        </div>

        {/* Medicine Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {prescriptions[0]?.items?.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm border border-surface-container"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm bg-surface-container-lowest text-primary px-space-xs py-0.5 rounded font-bold border border-surface-container">
                    {item.category || 'GENERAL'}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">
                    {item.timingBadge || 'Daily'}
                  </span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold mt-1">{item.medicineName}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.timingInstructions}</p>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Duration: {item.durationDays} Days</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">{item.daysLeft} Days Left</span>
              </div>
            </div>
          ))}
        </div>

        {/* Doctor's Advice Box */}
        <div className="bg-surface-container p-space-md rounded-xl flex items-start gap-space-sm border border-surface-container-high">
          <span className="material-symbols-outlined text-headline-md text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            medical_information
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-title-md text-title-md text-primary font-bold">Consultant's Clinical Lifestyle Instructions</span>
            <p className="font-body-md text-body-md text-on-surface">
              {prescriptions[0]?.lifestyleInstructions ||
                '“Strictly maintain low-sodium diet (< 2g salt/day). Avoid fried snacks and saturated oils. Continue brisk 30-minute morning walks at steady pace. Schedule repeat Lipid Profile and Serum Creatinine test after 4 weeks before next follow-up.”'}
            </p>
            <div className="flex items-center gap-space-md mt-1 font-label-sm text-label-sm text-on-surface-variant">
              <span>Issued: {prescriptions[0]?.issuedDate ? formatDate(prescriptions[0].issuedDate) : '24 Sept 2024'}</span>
              <span>•</span>
              <span>Next Review: {prescriptions[0]?.nextReviewDate ? formatDate(prescriptions[0].nextReviewDate) : 'Today'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
