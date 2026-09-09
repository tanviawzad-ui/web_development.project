import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { formatCurrency } from '../../utils/formatters';

const HomePage = () => {
  const { openReportModal } = useOutletContext() || {};
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          doctorService.getFeaturedDoctors(),
          departmentService.getAllDepartments()
        ]);
        if (docRes.success && docRes.data) setFeaturedDoctors(docRes.data);
        if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION WITH FULL-BLEED EXTERIOR IMAGE */}
      <section className="relative w-full overflow-hidden bg-primary text-on-primary">
        {/* Background Image with Gradient Scrim */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/images/hospital-exterior.png'), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzpriLbzoQ7qv2oEV6B70l7wxdylZbTmpDxZMf8eCtxT6RGw61umbsCkhqcGGLWChaBZqmKMnmXAbHPRI7cTk-uzwQPLcVLiFa8TkHWhPLl-vOFuxsy7lJQUhtHSuJkiEL9qVP83HSWEEh4-t7ljQKSLamiLwLcNLVH-eOml79eczGRFVZCu1tuUvCyP2jkaAs8xnQ948MODncesjcibJ7PztoBBLypbWsKw9otsHXq3Q2p8kfLIzcYA')"
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-gutter-md pt-space-2xl pb-space-3xl lg:pb-space-3xl">
          {/* Accreditation Pill Badge */}
          <div className="inline-flex items-center gap-space-xs bg-surface-container-highest/20 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-space-md shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
            <span className="font-label-md text-label-md tracking-wide text-surface-bright font-semibold">
              NABH &amp; NABL Accredited | Ranked #1 Multispeciality Hospital in Delhi NCR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-8 space-y-space-md">
              <h1 className="font-display text-display tracking-tight text-surface-lowest leading-[1.1] max-w-3xl">
                Your Health, Our Priority: <span className="text-secondary-fixed underline decoration-secondary-fixed/40 decoration-wavy">World-Class</span> Compassionate Care
              </h1>
              <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl leading-relaxed">
                Experience state-of-the-art medical technology, 100+ distinguished senior super-specialists, and 24x7 emergency trauma care designed around patient comfort and safety.
              </p>

              <div className="pt-space-xs flex flex-wrap items-center gap-space-sm sm:gap-space-md">
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-space-lg py-3 rounded-lg font-label-md text-label-md font-bold shadow-md hover:bg-on-secondary-container hover:text-on-secondary transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                  <span>Book an Appointment</span>
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 bg-surface-container-highest/20 text-surface-bright px-space-lg py-3 rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container-highest/30 transition-colors backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">person_search</span>
                  <span>Find a Specialist</span>
                </Link>
                <a
                  href="tel:18002085555"
                  className="inline-flex items-center gap-2 bg-error text-on-error px-4 py-3 rounded-full font-label-md text-label-md font-bold shadow-[0_0_0_3px_rgba(225,29,72,0.25)] hover:bg-error/90 transition-all animate-pulse"
                >
                  <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
                  <span>24x7 Emergency: +91 1800-208-5555</span>
                </a>
              </div>

              {/* Quick Hospital Status Indicator */}
              <div className="pt-space-sm flex flex-wrap items-center gap-space-md font-label-sm text-label-sm text-surface-container-highest">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping"></span>
                  <span className="font-semibold text-surface-lowest">Trauma ER: Operational (0 Wait)</span>
                </div>
                <span className="opacity-30">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">bloodtype</span>
                  <span>All Rare Blood Groups Available</span>
                </div>
                <span className="opacity-30">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">policy</span>
                  <span>Ayushman Bharat (PM-JAY) &amp; All Major TPAs</span>
                </div>
              </div>
            </div>

            {/* Hero Side Graphic / Bed & Queue Mini-Monitor */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-space-sm">
              <div className="bg-surface-container-lowest/10 backdrop-blur-xl p-space-md rounded-xl text-surface-bright space-y-space-sm shadow-xl border border-white/10">
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[20px]">monitor_heart</span>
                    <span className="font-title-md text-title-md font-bold">Real-Time Clinical Status</span>
                  </div>
                  <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="bg-surface-container-highest/10 p-space-xs rounded-lg">
                    <span className="text-body-sm font-body-sm text-surface-container-high block">ICU Bed Availability</span>
                    <span className="font-currency-stat text-currency-stat text-secondary-fixed font-bold">14 Available</span>
                  </div>
                  <div className="bg-surface-container-highest/10 p-space-xs rounded-lg">
                    <span className="text-body-sm font-body-sm text-surface-container-high block">Avg. Ambulance Reach</span>
                    <span className="font-currency-stat text-currency-stat text-surface-bright font-bold">11 Mins</span>
                  </div>
                </div>
                <div className="p-space-xs bg-surface-container-highest/10 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">medical_services</span>
                    <span className="text-body-sm font-body-sm text-surface-container-high">OPD Clinics On Duty</span>
                  </div>
                  <span className="font-bold text-surface-bright font-label-md">64 Doctors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING QUICK-ACCESS 6-COLUMN ACTION CARDS */}
      <section className="max-w-[1280px] mx-auto px-gutter-md w-full -mt-10 lg:-mt-14 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-space-sm">
          {/* Card 1 */}
          <Link
            to="/doctors"
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <span className="bg-surface-container text-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">100+</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors">Find Doctor</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Senior specialists</p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to="/book-appointment"
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <span className="bg-secondary/10 text-secondary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">Instant</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors">Book Appt</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Zero wait booking</p>
            </div>
          </Link>

          {/* Card 3 */}
          <a
            href="tel:1066"
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-error/10 flex items-center justify-center text-error group-hover:bg-error group-hover:text-on-error transition-colors">
                <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
              </div>
              <span className="bg-error/10 text-error font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">24x7</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-error font-bold">Emergency</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Trauma &amp; 108 Ambu</p>
            </div>
          </a>

          {/* Card 4 */}
          <a
            href="#packages"
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">40% Off</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors">Health Checks</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Curated packages</p>
            </div>
          </a>

          {/* Card 5 */}
          <button
            type="button"
            onClick={openReportModal}
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">science</span>
              </div>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">UHID</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors">Lab Reports</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Direct PDF access</p>
            </div>
          </button>

          {/* Card 6 */}
          <a
            href="#pharmacy"
            className="group bg-surface-container-lowest p-space-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 border border-surface-container/60"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">medication</span>
              </div>
              <span className="bg-secondary/10 text-secondary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">2 Hrs</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors">E-Pharmacy</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Express delivery</p>
            </div>
          </a>
        </div>
      </section>

      {/* 3. HOSPITAL KEY CLINICAL STATS SECTION */}
      <section className="max-w-[1280px] mx-auto px-gutter-md w-full pt-space-2xl pb-space-xl">
        <div className="bg-surface-container-low rounded-2xl p-space-lg lg:p-space-xl shadow-sm border border-surface-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-lg text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-secondary text-[32px]">clinical_notes</span>
              <span className="font-currency-stat text-[32px] text-primary font-bold">100+</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Super-Specialists</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">Full-time faculty</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-secondary text-[32px]">domain</span>
              <span className="font-currency-stat text-[32px] text-primary font-bold">25+</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Centres of Excellence</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">Dedicated wings</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-secondary text-[32px]">hotel</span>
              <span className="font-currency-stat text-[32px] text-primary font-bold">500+</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Inpatient Beds</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">Deluxe &amp; suites</span>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-secondary text-[32px]">vital_signs</span>
              <span className="font-currency-stat text-[32px] text-primary font-bold">120+</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">ICU / NICU Beds</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">1:1 nursing ratio</span>
            </div>
            {/* Stat 5 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-secondary text-[32px]">precision_manufacturing</span>
              <span className="font-currency-stat text-[32px] text-primary font-bold">18</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Modular OTs</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">With Da Vinci Robot</span>
            </div>
            {/* Stat 6 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="material-symbols-outlined text-error text-[32px]">ambulance</span>
              <span className="font-currency-stat text-[32px] text-error font-bold">&lt;15 min</span>
              <span className="font-label-md text-label-md text-primary font-semibold">Trauma Dispatch</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant opacity-75">GPS telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLINICAL CENTRES OF EXCELLENCE (DEPARTMENTS) */}
      <section className="max-w-[1280px] mx-auto px-gutter-md w-full py-space-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 bg-secondary rounded-full"></span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                Medical Disciplines
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-display font-bold">
              Centres of Excellence
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Equipped with cutting-edge robotic tools, continuous telemetry, and international clinical protocols delivering unmatched clinical success rates.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-bold hover:text-on-secondary-container transition-colors group"
          >
            <span>Explore All 25 Departments</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 6 Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-surface-container"
            >
              <div className="space-y-space-sm">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[32px]">{dept.icon || 'local_hospital'}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold group-hover:text-secondary transition-colors">
                  {dept.name}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {dept.description}
                </p>
                {dept.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dept.tags.map((tag, idx) => (
                      <span key={idx} className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-space-md pt-space-sm">
                <Link
                  to={`/doctors?department=${dept.code}`}
                  className="inline-flex items-center gap-1.5 text-secondary font-label-md text-label-md font-bold group-hover:underline"
                >
                  <span>Learn More &amp; View Doctors</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SENIOR SUPER-SPECIALISTS (DOCTOR DIRECTORY) */}
      <section className="w-full bg-surface-container-low py-space-3xl" id="featured-doctors">
        <div className="max-w-[1280px] mx-auto px-gutter-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-6 bg-secondary rounded-full"></span>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                  Distinguished Clinicians
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-display font-bold">
                Consult with Renowned Super-Specialists
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Our department chairs and senior consultants bring decades of clinical excellence from AIIMS, PGI, and premier international academic medical centres.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container-lowest text-primary px-3 py-1.5 rounded-lg text-label-sm font-semibold flex items-center gap-1 shadow-sm border border-surface-container">
                <span className="material-symbols-outlined text-[16px] text-secondary">event_available</span>
                <span>Same-Day Slots Open</span>
              </span>
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-surface-container"
              >
                <div>
                  <div className="relative h-64 w-full bg-surface-container-highest overflow-hidden">
                    <img
                      alt={doc.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      src={doc.imageUrl}
                    />
                    <div className="absolute top-3 left-3 bg-primary text-on-primary px-2.5 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-[14px] text-secondary-fixed">stars</span>
                      <span>{doc.experienceYears} Yrs Exp</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-bold text-secondary shadow-sm">
                      Verified Expert
                    </div>
                  </div>

                  <div className="p-space-md space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                        {doc.speciality}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                        Fee: {formatCurrency(doc.consultationFee)}
                      </span>
                    </div>
                    <h3 className="font-title-lg text-title-lg text-primary font-bold leading-snug font-display">
                      {doc.name}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      {doc.qualifications}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                      {doc.title}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-outline">translate</span>
                      <span>{doc.languagesSpoken}</span>
                    </div>

                    {/* Next Available */}
                    <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between mt-2 border border-surface-container">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Next Slot:</span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">
                        {doc.nextAvailableSlot || 'Today, 04:30 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-space-md pt-0 flex gap-2">
                  <Link
                    to={`/doctors?search=${encodeURIComponent(doc.name)}`}
                    className="flex-1 text-center py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book-appointment?doctorId=${doc.id}`}
                    className="flex-1 text-center py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-on-secondary-container transition-colors shadow-sm"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
