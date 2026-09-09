import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import AppointmentConfirmModal from '../../components/common/AppointmentConfirmModal';
import { formatCurrency } from '../../utils/formatters';

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const queryDoctorId = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Form State
  const [patientType, setPatientType] = useState('existing');
  const [fullName, setFullName] = useState(user?.patient?.fullName || user?.fullName || 'Ramesh Chand Sharma');
  const [mobileNumber, setMobileNumber] = useState(user?.patient?.mobileNumber || user?.phone || '98112 45678');
  const [email, setEmail] = useState(user?.patient?.email || user?.email || 'ramesh.sharma@example.in');
  const [age, setAge] = useState(user?.patient?.ageYears ? `${user.patient.ageYears} Yrs` : '52 Yrs');
  const [gender, setGender] = useState(user?.patient?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(user?.patient?.bloodGroup || 'B+');
  const [uhid, setUhid] = useState(user?.patient?.uhid || 'MC-2024-88412');

  const [consultationMode, setConsultationMode] = useState('IN_HOSPITAL_OPD'); // or VIDEO_CONSULTATION
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSlot, setSelectedSlot] = useState('04:30 PM');
  const [sessionType, setSessionType] = useState('EVENING');

  const [clinicalNotes, setClinicalNotes] = useState('Routine cardiac follow-up, mild shortness of breath during morning walk, ECG review.');
  const [isCashless, setIsCashless] = useState(true);
  const [insuranceProvider, setInsuranceProvider] = useState('Star Health');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Submission & Confirmation State
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Load initial doctors & departments
  useEffect(() => {
    Promise.all([
      doctorService.getDoctors(),
      departmentService.getAllDepartments(),
    ]).then(([docRes, deptRes]) => {
      if (docRes.success && docRes.data) {
        setDoctors(docRes.data);
        const doc = queryDoctorId
          ? docRes.data.find(d => String(d.id) === String(queryDoctorId))
          : docRes.data[0];
        setSelectedDoctor(doc || docRes.data[0]);
      }
      if (deptRes.success && deptRes.data) {
        setDepartments(deptRes.data);
        setSelectedDepartment(deptRes.data[0]);
      }
    }).catch(console.error);
  }, [queryDoctorId]);

  // Sync when selected doctor changes
  const handleDoctorChange = (docId) => {
    const doc = doctors.find(d => String(d.id) === String(docId));
    if (doc) {
      setSelectedDoctor(doc);
      if (doc.departmentId) {
        const dept = departments.find(d => String(d.id) === String(doc.departmentId));
        if (dept) setSelectedDepartment(dept);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setSubmitting(true);
    try {
      // Build real appointment date
      const today = new Date();
      let appointmentDate = today.toISOString().split('T')[0];
      if (selectedDate === 'tomorrow') {
        const d = new Date(today);
        d.setDate(d.getDate() + 1);
        appointmentDate = d.toISOString().split('T')[0];
      } else if (selectedDate === 'sat') {
        const d = new Date(today);
        d.setDate(d.getDate() + 2);
        appointmentDate = d.toISOString().split('T')[0];
      } else if (selectedDate === 'mon') {
        const d = new Date(today);
        d.setDate(d.getDate() + 4);
        appointmentDate = d.toISOString().split('T')[0];
      }

      const payload = {
        doctorId: selectedDoctor.id,
        departmentId: selectedDepartment?.id || selectedDoctor.departmentId || 1,
        patientId: user?.patient?.id || null,
        patientName: fullName,
        mobileNumber: mobileNumber,
        email: email,
        uhid: uhid,
        age: age,
        gender: gender,
        bloodGroup: bloodGroup,
        appointmentDate: appointmentDate,
        appointmentTime: selectedSlot,
        sessionType: sessionType,
        consultationType: consultationMode,
        reasonSymptoms: clinicalNotes,
        isCashlessInsurance: isCashless,
        insuranceProvider: insuranceProvider,
      };

      const res = await appointmentService.bookAppointment(payload);
      if (res.success && res.data) {
        setConfirmedAppointment(res.data);
        setIsConfirmModalOpen(true);
      } else {
        alert(res.message || 'Error creating appointment');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert(err.response?.data?.message || 'Error connecting to hospital server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Progress Header & Breadcrumbs Strip */}
      <div className="w-full bg-surface-container-low py-space-sm border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto px-gutter-md flex flex-wrap items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <Link to="/book-appointment" className="hover:text-primary transition-colors">Appointments</Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-primary font-semibold">Book Doctor Appointment</span>
          </nav>

          {/* Live Clinical OPD Status */}
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full text-label-sm font-semibold text-secondary shadow-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>OPD Live Queue Active</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-surface-container-highest/60 px-2 py-1 rounded text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
              NABH Digital Token Service
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Booking Studio Container */}
      <div className="w-full py-space-xl">
        <div className="max-w-[1280px] mx-auto px-gutter-md">
          {/* Top Title & Urgency Ticker Banner */}
          <div className="mb-space-lg flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 text-secondary font-label-sm text-label-sm tracking-wider uppercase mb-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Direct Consultant Scheduling
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-display font-bold">
                Book Outpatient Consultation
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Instant digital confirmation with paperless OPD slip &amp; fast-track hospital desk routing.
              </p>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-highest/40 p-2 rounded-lg text-on-surface-variant font-label-sm text-label-sm border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
              <span>Zero pre-payment penalty. Free rescheduling up to 2 hours before OPD slot.</span>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* LEFT COLUMN: Selected Doctor & Guidelines (Sticky Panel) (col-span-5) */}
            <div className="lg:col-span-5 space-y-space-lg lg:sticky lg:top-28">
              {/* Selected Doctor Summary Card */}
              {selectedDoctor && (
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md overflow-hidden relative border border-surface-container">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
                  <div className="flex items-start gap-space-md">
                    <div className="relative shrink-0">
                      <img
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm border border-surface-container"
                        alt={selectedDoctor.name}
                        src={selectedDoctor.imageUrl}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest p-1 rounded-full shadow">
                        <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-surface-container-high text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold">
                          Chairman
                        </span>
                        <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold">
                          {selectedDoctor.experienceYears}+ Yrs Exp
                        </span>
                      </div>
                      <h2 className="font-title-lg text-title-lg text-primary mt-1.5 font-display font-bold truncate">
                        {selectedDoctor.name}
                      </h2>
                      <p className="font-label-md text-label-md text-secondary font-semibold">
                        {selectedDoctor.qualifications}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-1">
                        {selectedDoctor.title}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                        <div className="flex items-center text-amber-500">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="ml-0.5 font-bold text-on-surface">{selectedDoctor.rating}</span>
                        </div>
                        <span>•</span>
                        <span>({selectedDoctor.reviewsCount}+ Reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* OPD Cabin & Schedule Micro-Bar */}
                  <div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-sm space-y-2 border border-surface-container">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary">meeting_room</span>
                        OPD Location
                      </span>
                      <span className="font-semibold text-primary">{selectedDoctor.opdRoom}</span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                        Hospital OPD Timings
                      </span>
                      <span className="font-semibold text-primary">{selectedDoctor.opdTimings}</span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary">payments</span>
                        Consultation Fee
                      </span>
                      <span className="font-currency-stat text-title-md text-primary font-bold">
                        {formatCurrency(selectedDoctor.consultationFee)}
                      </span>
                    </div>
                  </div>

                  {/* TPA Insurance Badges */}
                  <div className="mt-space-md">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5 uppercase tracking-wide font-semibold">
                      Empanelled Cashless Insurers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-surface-container px-2 py-1 rounded text-[11px] font-semibold text-primary">Star Health</span>
                      <span className="bg-surface-container px-2 py-1 rounded text-[11px] font-semibold text-primary">HDFC ERGO</span>
                      <span className="bg-surface-container px-2 py-1 rounded text-[11px] font-semibold text-primary">Care Health</span>
                      <span className="bg-surface-container px-2 py-1 rounded text-[11px] font-semibold text-primary">Ayushman Bharat (PM-JAY)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* What to Bring Checklist */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container">
                <h3 className="font-title-md text-title-md text-primary flex items-center gap-2 mb-space-sm font-display font-bold">
                  <span className="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
                  What to Bring for Your OPD Visit
                </h3>
                <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Government Photo ID:</strong> Aadhaar Card, Voter ID, or Passport (mandatory for hospital security check-in).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Medical Dossier:</strong> Previous ECG strips, 2D Echocardiogram disks, Angiography CD, or lipid profile reports.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Active Medication List:</strong> Present prescription slips, dosage schedules, or actual medicine strips.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>TPA / Insurance Card:</strong> Physical health card or digital policy e-card if processing cashless desk claims.</span>
                  </li>
                </ul>
                <div className="mt-space-md p-space-xs bg-surface-container rounded flex items-center gap-2 text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
                  <span>Patient Assistance Desk: Ext <strong>2404</strong> from hospital lobby</span>
                </div>
              </div>

              {/* Real-Time Queue Metric Card */}
              <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-space-md shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">timelapse</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary font-semibold">Average Consultation Delay</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Expected wait time today: ~12 minutes</p>
                  </div>
                </div>
                <span className="bg-[#FEF3C7] text-[#B45309] font-label-sm text-label-sm px-2.5 py-1 rounded font-semibold">
                  On Schedule
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Appointment Form (col-span-7) */}
            <div className="lg:col-span-7 space-y-space-lg">
              <form className="space-y-space-lg" onSubmit={handleSubmit}>
                {/* SECTION 1: Patient Details */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-surface-container">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">1</span>
                      <h3 className="font-title-lg text-title-lg text-primary font-display font-bold">Patient Identification</h3>
                    </div>
                    {/* Patient Type Radio Switch */}
                    <div className="inline-flex bg-surface-container-low p-1 rounded-lg border border-surface-container">
                      <button
                        type="button"
                        onClick={() => {
                          setPatientType('new');
                          setFullName('');
                          setUhid('');
                        }}
                        className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                          patientType === 'new' ? 'bg-secondary text-on-secondary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        New Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientType('existing');
                          setFullName(user?.patient?.fullName || 'Ramesh Chand Sharma');
                          setUhid(user?.patient?.uhid || 'MC-2024-88412');
                        }}
                        className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                          patientType === 'existing' ? 'bg-secondary text-on-secondary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        Existing Patient
                      </button>
                    </div>
                  </div>

                  {/* UHID Alert Banner */}
                  <div className="bg-surface-container-high/60 p-space-xs rounded-lg flex items-center justify-between font-label-sm text-label-sm text-primary">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
                      <span>Active Universal Hospital ID: <strong>{uhid || 'Auto-generated on confirmation'}</strong></span>
                    </div>
                    <span className="text-secondary font-semibold">Verified via Aadhaar</span>
                  </div>

                  {/* Form Inputs Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div>
                      <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Patient Full Name *</label>
                      <div className="relative">
                        <input
                          className="w-full h-12 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all shadow-inner border border-surface-container"
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-3 text-secondary text-[20px]">person</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Mobile Number (SMS/WhatsApp) *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg bg-surface-container-high text-primary font-label-md text-label-md border border-r-0 border-surface-container">
                          🇮🇳 +91
                        </span>
                        <input
                          className="w-full h-12 px-space-sm rounded-r-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all shadow-inner border border-surface-container"
                          required
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
                    <div className="md:col-span-6">
                      <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Email ID (For PDF Report / Slip) *</label>
                      <input
                        className="w-full h-12 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all shadow-inner border border-surface-container"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-6 grid grid-cols-3 gap-2">
                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">DOB / Age</label>
                        <input
                          className="w-full h-12 px-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md text-center focus:outline-none border border-surface-container"
                          type="text"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Gender</label>
                        <input
                          className="w-full h-12 px-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md text-center focus:outline-none border border-surface-container"
                          type="text"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Blood</label>
                        <input
                          className="w-full h-12 px-2.5 rounded-lg bg-surface-container-low text-error font-body-md text-body-md text-center font-bold focus:outline-none border border-surface-container"
                          type="text"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Consultation Channel & Doctor */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">2</span>
                    <h3 className="font-title-lg text-title-lg text-primary font-display font-bold">Consultation Channel &amp; Mode</h3>
                  </div>

                  {/* Consultation Type Select Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    {/* Selected: In-Hospital OPD */}
                    <div
                      onClick={() => setConsultationMode('IN_HOSPITAL_OPD')}
                      className={`p-space-md rounded-xl cursor-pointer shadow-sm relative overflow-hidden border transition-all ${
                        consultationMode === 'IN_HOSPITAL_OPD'
                          ? 'bg-surface-container-low/80 border-secondary ring-2 ring-secondary/20'
                          : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[22px]">domain</span>
                        </div>
                        <span className={`material-symbols-outlined text-[24px] ${consultationMode === 'IN_HOSPITAL_OPD' ? 'text-secondary' : 'text-outline-variant'}`} style={{ fontVariationSettings: consultationMode === 'IN_HOSPITAL_OPD' ? "'FILL' 1" : "''" }}>
                          {consultationMode === 'IN_HOSPITAL_OPD' ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      <h4 className="font-title-md text-title-md text-primary mt-2 font-bold">In-Hospital OPD Visit</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Face-to-face clinical examination at OPD Block B, New Delhi Campus.</p>
                      <div className="mt-2 text-label-sm font-semibold text-secondary">Physical checkup &amp; ECG review included</div>
                    </div>

                    {/* Video Option */}
                    <div
                      onClick={() => setConsultationMode('VIDEO_CONSULTATION')}
                      className={`p-space-md rounded-xl cursor-pointer shadow-sm relative overflow-hidden border transition-all ${
                        consultationMode === 'VIDEO_CONSULTATION'
                          ? 'bg-surface-container-low/80 border-secondary ring-2 ring-secondary/20'
                          : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[22px]">videocam</span>
                        </div>
                        <span className={`material-symbols-outlined text-[24px] ${consultationMode === 'VIDEO_CONSULTATION' ? 'text-secondary' : 'text-outline-variant'}`} style={{ fontVariationSettings: consultationMode === 'VIDEO_CONSULTATION' ? "'FILL' 1" : "''" }}>
                          {consultationMode === 'VIDEO_CONSULTATION' ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      <h4 className="font-title-md text-title-md text-primary mt-2 font-bold">Video Teleconsultation</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">High-definition encrypted video call via MediCare Patient Portal.</p>
                      <div className="mt-2 text-label-sm text-on-surface-variant font-medium">Digital e-prescription via SMS</div>
                    </div>
                  </div>

                  {/* Department & Doctor Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                    <div>
                      <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Speciality Department</label>
                      <select
                        value={selectedDepartment?.id || ''}
                        onChange={(e) => {
                          const dept = departments.find(d => String(d.id) === e.target.value);
                          if (dept) {
                            setSelectedDepartment(dept);
                            const matchingDoc = doctors.find(d => d.departmentId === dept.id);
                            if (matchingDoc) setSelectedDoctor(matchingDoc);
                          }
                        }}
                        className="w-full h-12 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-surface-container focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">Treating Consultant</label>
                      <select
                        value={selectedDoctor?.id || ''}
                        onChange={(e) => handleDoctorChange(e.target.value)}
                        className="w-full h-12 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-surface-container focus:outline-none font-bold"
                      >
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.speciality}) - {formatCurrency(d.consultationFee)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Date & Slot Booking */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-surface-container">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">3</span>
                      <h3 className="font-title-lg text-title-lg text-primary font-display font-bold">Select Appointment Date &amp; Slot</h3>
                    </div>
                    <span className="text-label-sm text-secondary font-semibold hidden sm:inline">Indian Standard Time (IST)</span>
                  </div>

                  {/* Quick Date Selection Bar */}
                  <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
                    {/* Today */}
                    <button
                      type="button"
                      onClick={() => setSelectedDate('today')}
                      className={`shrink-0 px-space-md py-2.5 rounded-xl text-left shadow-sm min-w-[120px] transition-transform active:scale-95 border ${
                        selectedDate === 'today'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                      }`}
                    >
                      <span className={`block font-label-sm text-label-sm uppercase tracking-wider ${selectedDate === 'today' ? 'text-secondary-fixed-dim font-bold' : 'text-on-surface-variant'}`}>Today</span>
                      <span className="block font-title-md text-title-md font-bold mt-0.5">24 Oct</span>
                      <span className={`block font-label-sm text-label-sm ${selectedDate === 'today' ? 'text-surface-container-highest' : 'text-on-surface-variant'}`}>Thursday</span>
                    </button>

                    {/* Tomorrow */}
                    <button
                      type="button"
                      onClick={() => setSelectedDate('tomorrow')}
                      className={`shrink-0 px-space-md py-2.5 rounded-xl text-left min-w-[120px] transition-all border ${
                        selectedDate === 'tomorrow'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                      }`}
                    >
                      <span className={`block font-label-sm text-label-sm uppercase tracking-wider ${selectedDate === 'tomorrow' ? 'text-secondary-fixed-dim font-bold' : 'text-on-surface-variant'}`}>Tomorrow</span>
                      <span className="block font-title-md text-title-md font-bold mt-0.5">25 Oct</span>
                      <span className={`block font-label-sm text-label-sm ${selectedDate === 'tomorrow' ? 'text-surface-container-highest' : 'text-on-surface-variant'}`}>Friday</span>
                    </button>

                    {/* Sat 26 */}
                    <button
                      type="button"
                      onClick={() => setSelectedDate('sat')}
                      className={`shrink-0 px-space-md py-2.5 rounded-xl text-left min-w-[120px] transition-all border ${
                        selectedDate === 'sat'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                      }`}
                    >
                      <span className={`block font-label-sm text-label-sm uppercase tracking-wider ${selectedDate === 'sat' ? 'text-secondary-fixed-dim font-bold' : 'text-on-surface-variant'}`}>Available</span>
                      <span className="block font-title-md text-title-md font-bold mt-0.5">26 Oct</span>
                      <span className={`block font-label-sm text-label-sm ${selectedDate === 'sat' ? 'text-surface-container-highest' : 'text-on-surface-variant'}`}>Saturday</span>
                    </button>

                    {/* Mon 28 */}
                    <button
                      type="button"
                      onClick={() => setSelectedDate('mon')}
                      className={`shrink-0 px-space-md py-2.5 rounded-xl text-left min-w-[120px] transition-all border ${
                        selectedDate === 'mon'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                      }`}
                    >
                      <span className={`block font-label-sm text-label-sm uppercase tracking-wider ${selectedDate === 'mon' ? 'text-secondary-fixed-dim font-bold' : 'text-on-surface-variant'}`}>Available</span>
                      <span className="block font-title-md text-title-md font-bold mt-0.5">28 Oct</span>
                      <span className={`block font-label-sm text-label-sm ${selectedDate === 'mon' ? 'text-surface-container-highest' : 'text-on-surface-variant'}`}>Monday</span>
                    </button>
                  </div>

                  {/* Slot Grid Container */}
                  <div className="space-y-space-md pt-space-xs">
                    {/* Morning Session */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[18px] text-amber-600">wb_twilight</span>
                        <span className="font-label-md text-label-md font-semibold text-primary">Morning Session (09:00 AM – 01:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="h-11 rounded-lg bg-surface-container-highest/40 flex items-center justify-center gap-1.5 text-outline-variant font-label-md text-label-md cursor-not-allowed border border-surface-container">
                          <span className="material-symbols-outlined text-[14px]">block</span>
                          <span className="line-through">09:30 AM</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('10:00 AM');
                            setSessionType('MORNING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-semibold transition-all border ${
                            selectedSlot === '10:00 AM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          10:00 AM
                        </button>
                        <div className="h-11 rounded-lg bg-surface-container-highest/40 flex items-center justify-center gap-1.5 text-outline-variant font-label-md text-label-md cursor-not-allowed border border-surface-container">
                          <span className="material-symbols-outlined text-[14px]">block</span>
                          <span className="line-through">10:30 AM</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('11:15 AM');
                            setSessionType('MORNING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-semibold transition-all border ${
                            selectedSlot === '11:15 AM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          11:15 AM
                        </button>
                      </div>
                    </div>

                    {/* Evening Session */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[18px] text-indigo-600">dark_mode</span>
                        <span className="font-label-md text-label-md font-semibold text-primary">Evening Session (04:00 PM – 08:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('04:30 PM');
                            setSessionType('EVENING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-all border ${
                            selectedSlot === '04:30 PM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          {selectedSlot === '04:30 PM' && (
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          )}
                          04:30 PM
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('05:00 PM');
                            setSessionType('EVENING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-semibold transition-all border ${
                            selectedSlot === '05:00 PM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          05:00 PM
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('05:30 PM');
                            setSessionType('EVENING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-semibold transition-all border ${
                            selectedSlot === '05:30 PM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          05:30 PM
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSlot('06:00 PM');
                            setSessionType('EVENING');
                          }}
                          className={`h-11 rounded-lg font-label-md text-label-md font-semibold transition-all border ${
                            selectedSlot === '06:00 PM'
                              ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low hover:bg-surface-container text-primary border-surface-container'
                          }`}
                        >
                          06:00 PM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Reason for Visit & Insurance Claim */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">4</span>
                    <h3 className="font-title-lg text-title-lg text-primary font-display font-bold">Clinical Notes &amp; Payment Routing</h3>
                  </div>

                  {/* Clinical Notes Field */}
                  <div>
                    <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">
                      Reason for Consultation / Symptoms *
                    </label>
                    <textarea
                      className="w-full p-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all shadow-inner border border-surface-container"
                      required
                      rows="3"
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                    ></textarea>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      This clinical note is directly pre-loaded into {selectedDoctor?.name || "the doctor"}'s consultation workstation.
                    </p>
                  </div>

                  {/* TPA / Cashless Claim Box */}
                  <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-surface-container">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          checked={isCashless}
                          onChange={(e) => setIsCashless(e.target.checked)}
                          className="w-5 h-5 accent-secondary rounded cursor-pointer"
                          id="insuranceCheckbox"
                          type="checkbox"
                        />
                        <label className="font-title-md text-title-md text-primary font-bold cursor-pointer" htmlFor="insuranceCheckbox">
                          Avail Cashless / TPA Insurance Fast-Track Desk
                        </label>
                      </div>
                      <span className="bg-secondary/15 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                        Pre-Approved
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant pl-7">
                      Covered under Star Health, HDFC ERGO, ICICI Lombard, New India Assurance, or Ayushman Bharat PM-JAY. Present your policy card at Block B reception for direct pre-authorization.
                    </p>
                  </div>

                  {/* Fee Breakdown Receipt Box */}
                  <div className="bg-surface-container-high/40 rounded-xl p-space-md space-y-2 border border-surface-container">
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Specialist Consultation Fee</span>
                      <span className="text-primary font-semibold">{formatCurrency(selectedDoctor?.consultationFee || 1500)}</span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Hospital Digital Registration Fee</span>
                      <span className="text-secondary font-semibold">WAIVED (Returning UHID)</span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>GST / Healthcare Service Tax</span>
                      <span className="text-on-surface-variant">₹0.00 (Exempt)</span>
                    </div>
                    <div className="pt-2 flex justify-between items-center text-primary font-bold border-t border-surface-container">
                      <span className="font-title-md text-title-md font-bold">Total Payable at Hospital Desk</span>
                      <span className="font-currency-stat text-currency-stat text-secondary font-bold">
                        {formatCurrency(selectedDoctor?.consultationFee || 1500)}
                      </span>
                    </div>
                  </div>

                  {/* Terms & Submission CTA */}
                  <div className="space-y-space-md pt-space-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 accent-secondary rounded mt-0.5"
                        required
                        type="checkbox"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        I verify that the above medical history and patient information is accurate. I agree to MediCare's <a className="text-secondary underline" href="#terms">Patient Charter</a> and privacy regulations.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-headline-sm text-title-lg font-bold py-3.5 px-space-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                      {submitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                          <span>Securing OPD Slot...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[22px]">lock</span>
                          <span>Confirm &amp; Generate OPD Digital Token</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AppointmentConfirmModal
        isOpen={isConfirmModalOpen}
        appointment={confirmedAppointment}
        onClose={() => {
          setIsConfirmModalOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default BookAppointmentPage;
