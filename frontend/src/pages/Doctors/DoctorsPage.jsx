import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { formatCurrency } from '../../utils/formatters';

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [speciality, setSpeciality] = useState(searchParams.get('speciality') || 'all');
  const [department, setDepartment] = useState(searchParams.get('department') || 'all');
  const [experience, setExperience] = useState(searchParams.get('experience') || 'any');
  const [gender, setGender] = useState(searchParams.get('gender') || 'any');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'any');
  const [fee, setFee] = useState(searchParams.get('fee') || 'any');

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load departments list for filter
  useEffect(() => {
    departmentService.getAllDepartments()
      .then(res => {
        if (res.success && res.data) setDepartments(res.data);
      })
      .catch(console.error);
  }, []);

  // Fetch doctors on filter changes
  useEffect(() => {
    const fetchFilteredDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (department && department !== 'all') params.department = department;
        if (speciality && speciality !== 'all') params.speciality = speciality;
        if (gender && gender !== 'any') params.gender = gender;
        if (experience && experience !== 'any') params.minExperience = parseInt(experience, 10);
        if (availability === 'today') params.availableToday = true;

        const res = await doctorService.getDoctors(params);
        if (res.success && res.data) {
          let list = res.data;
          // Apply fee filter client-side if needed
          if (fee === 'under800') {
            list = list.filter(d => Number(d.consultationFee) < 800);
          } else if (fee === '800to1500') {
            list = list.filter(d => Number(d.consultationFee) >= 800 && Number(d.consultationFee) <= 1500);
          } else if (fee === 'above1500') {
            list = list.filter(d => Number(d.consultationFee) > 1500);
          }
          setDoctors(list);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredDoctors();
  }, [search, department, speciality, gender, experience, availability, fee]);

  const handleClearFilters = () => {
    setSearch('');
    setSpeciality('all');
    setDepartment('all');
    setExperience('any');
    setGender('any');
    setAvailability('any');
    setFee('any');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Breadcrumb & Top Indicator Bar */}
      <div className="bg-surface-container-low py-space-sm px-gutter-md border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="opacity-40">/</span>
            <span className="hover:text-primary transition-colors">Find a Doctor</span>
            <span className="opacity-40">/</span>
            <span className="text-secondary font-semibold">Specialist Directory</span>
          </nav>
          <div className="flex items-center gap-space-xs text-label-sm font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>112 Specialists On-Duty Across 25+ Clinical Wings</span>
          </div>
        </div>
      </div>

      {/* 2. Header & Live Triage Highlights */}
      <header className="bg-surface-container-lowest px-gutter-md pt-space-xl pb-space-lg shadow-sm border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="space-y-space-xs max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-label-sm text-primary font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                  NABH &amp; NABL Accredited Consultants
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-secondary-container/40 text-on-secondary-container px-2.5 py-1 rounded-full text-label-sm font-medium">
                  Verified Medical Council Registrations (MCI/NMC)
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-display font-bold">
                Find Expert Doctors &amp; Specialists
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Browse over 100+ accredited medical specialists and surgeons across 25+ clinical departments in New Delhi &amp; NCR. Book guaranteed instant OPD slots or online tele-consultations.
              </p>
            </div>

            {/* Quick Stats Pill Badge */}
            <div className="flex items-center gap-space-md p-space-sm bg-surface-container-low rounded-xl border border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">stethoscope</span>
                </div>
                <div>
                  <p className="font-title-md text-title-md text-primary leading-none font-bold">15 Min</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Avg OPD Wait</p>
                </div>
              </div>
              <div className="h-8 w-px bg-surface-container-highest"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">shield_person</span>
                </div>
                <div>
                  <p className="font-title-md text-title-md text-primary leading-none font-bold">100%</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Cashless TPA Desks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Filter & Search Section */}
      <section className="bg-surface-container-low px-gutter-md py-space-lg shadow-sm border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto space-y-space-md">
          {/* Search Field with Instant Auto-focus Feeling */}
          <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-2 flex flex-col md:flex-row items-center gap-2 border border-surface-container">
            <div className="relative flex-1 w-full flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[22px] text-outline">search</span>
              <input
                className="w-full pl-11 pr-10 py-3 bg-transparent text-on-surface placeholder:text-on-surface-variant/70 font-body-md text-body-md focus:outline-none"
                id="doctorSearchInput"
                placeholder="Search doctor name, department, disease, symptom (e.g., Angioplasty, Knee Pain)..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  aria-label="Clear input"
                  className="text-on-surface-variant hover:text-primary px-2 transition-colors absolute right-2"
                  onClick={() => setSearch('')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <div className="h-8 w-px bg-surface-container-highest hidden md:block"></div>
              <div className="flex items-center gap-1 text-on-surface-variant px-2 py-1">
                <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
                <span className="font-label-md text-label-md font-semibold text-primary">Delhi NCR Hub</span>
              </div>
              <button
                type="button"
                className="w-full md:w-auto bg-primary hover:bg-primary-container text-on-primary px-space-lg py-3 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Find Specialist</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Advanced Multi-parameter Filter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs">
            {/* Speciality Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Speciality</label>
              <div className="relative">
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="all">All Specialties</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology &amp; Spine</option>
                  <option value="orthopaedics">Orthopaedics</option>
                  <option value="paediatrics">Paediatrics</option>
                  <option value="oncology">Oncology</option>
                  <option value="nephrology">Nephrology &amp; Urology</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Department</label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.code}>{d.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>

            {/* Experience Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Experience</label>
              <div className="relative">
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="any">Any Experience</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                  <option value="20">20+ Years</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>

            {/* Gender Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Doctor Gender</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="any">Any Gender</option>
                  <option value="male">Male Doctor</option>
                  <option value="female">Female Doctor</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Availability</label>
              <div className="relative">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="any">Any Availability</option>
                  <option value="today">Available Today</option>
                  <option value="tomorrow">Available Tomorrow</option>
                  <option value="weekend">This Weekend</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>

            {/* Consultation Fee Filter */}
            <div className="relative">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 font-semibold">Consultation Fee</label>
              <div className="relative">
                <select
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-2.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-high transition-colors font-medium cursor-pointer border border-surface-container"
                >
                  <option value="any">Any Fee</option>
                  <option value="under800">Under ₹800</option>
                  <option value="800to1500">₹800 - ₹1,500</option>
                  <option value="above1500">Above ₹1,500</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">expand_more</span>
              </div>
            </div>
          </div>

          {/* Active Filters Row & Sort Controller */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Active filters:</span>
              {speciality !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-primary px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-surface-container">
                  <span>{speciality}</span>
                  <button onClick={() => setSpeciality('all')} className="text-on-surface-variant hover:text-error transition-colors flex items-center">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              {availability === 'today' && (
                <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-primary px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-surface-container">
                  <span>Available Today</span>
                  <button onClick={() => setAvailability('any')} className="text-on-surface-variant hover:text-error transition-colors flex items-center">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              {department !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-primary px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-surface-container">
                  <span>Dept: {department}</span>
                  <button onClick={() => setDepartment('all')} className="text-on-surface-variant hover:text-error transition-colors flex items-center">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="font-label-sm text-label-sm text-secondary font-semibold hover:underline px-2 py-1"
              >
                Clear All Filters
              </button>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              Showing <strong className="text-primary font-bold">{doctors.length}</strong> matching specialists
            </div>
          </div>
        </div>
      </section>

      {/* 4. Doctors Directory Grid */}
      <section className="max-w-[1280px] mx-auto px-gutter-md w-full py-space-xl">
        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-secondary text-[48px] animate-spin">progress_activity</span>
            <p className="font-body-md text-on-surface-variant mt-3">Loading accredited doctors directory...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl border border-surface-container p-8">
            <span className="material-symbols-outlined text-outline text-[48px]">person_off</span>
            <h3 className="font-headline-sm text-primary font-bold mt-2">No Specialists Found</h3>
            <p className="font-body-md text-on-surface-variant mt-1">Try adjusting your filters or search keywords.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-5 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {doctors.map((doc) => (
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
                  <button
                    type="button"
                    onClick={() => alert(`Doctor Profile:\n${doc.name}\n${doc.title}\nRoom: ${doc.opdRoom}\nTimings: ${doc.opdTimings}`)}
                    className="flex-1 text-center py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
                  >
                    Profile
                  </button>
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
        )}
      </section>
    </div>
  );
};

export default DoctorsPage;
