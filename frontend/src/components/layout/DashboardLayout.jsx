import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isNavActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col">
      {/* 1. TOP TRIAGE & EMERGENCY STRIP */}
      <aside aria-label="Critical Hotline" className="w-full bg-error text-on-error px-gutter-md py-2 flex flex-wrap items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-headline-sm animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            e911_emergency
          </span>
          <span className="font-headline-sm text-label-md uppercase tracking-wider">
            24x7 Trauma &amp; Resuscitation Hotline
          </span>
          <span className="hidden md:inline text-body-sm opacity-90">| Direct ICU &amp; Ambulance Dispatch</span>
        </div>
        <div className="flex items-center gap-space-md">
          <a
            className="flex items-center gap-space-2xs font-headline-sm text-label-md bg-surface-container-lowest text-error px-space-sm py-1 rounded-full shadow-sm hover:bg-error-container transition-colors"
            href="tel:1066"
          >
            <span className="material-symbols-outlined text-body-md">call</span>
            1066 / +91-11-4050-9999
          </a>
          <div className="hidden lg:flex items-center gap-space-2xs bg-on-error/20 px-space-xs py-1 rounded text-label-sm">
            <span className="material-symbols-outlined text-label-md">verified_user</span>
            NABH &amp; NABL Accredited Center
          </div>
        </div>
      </aside>

      {/* 2. WORKSPACE SHELL */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-space-lg p-space-md lg:p-gutter-lg flex-1">
        {/* Left Navigation Clinical Sidebar */}
        <nav aria-label="Patient Portal Navigation" className="w-full lg:w-72 shrink-0 flex flex-col gap-space-md">
          {/* Facility Header Micro-Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center gap-space-sm border border-surface-container">
            <Link
              to="/"
              title="Back to Hospital Home"
              className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-secondary-container hover:bg-primary/90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_hospital
              </span>
            </Link>
            <div className="min-w-0">
              <Link to="/" className="font-headline-sm text-title-md text-on-surface leading-tight truncate hover:text-secondary flex items-center gap-1 font-bold">
                MediCare Hospital <span className="material-symbols-outlined text-[14px]">home</span>
              </Link>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Indraprastha, New Delhi</p>
            </div>
          </div>

          {/* Navigation Tree */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xs flex flex-col gap-1 border border-surface-container">
            <Link
              to="/dashboard"
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-title-md text-body-md transition-all ${
                isNavActive('/dashboard')
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-headline-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard
              </span>
              <span>Dashboard</span>
            </Link>

            <a
              href="#profile"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-sm text-outline">badge</span>
                <span>My Profile</span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-space-2xs py-0.5 rounded">
                UHID
              </span>
            </a>

            <Link
              to="/book-appointment"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-sm text-outline">event_available</span>
                <span>Appointments</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </Link>

            <Link
              to="/doctors"
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <span className="material-symbols-outlined text-headline-sm text-outline">person_search</span>
              <span>Find Doctors</span>
            </Link>

            <a
              href="#prescriptions"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-sm text-outline">prescriptions</span>
                <span>Digital Rx</span>
              </div>
              <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded-full font-bold">
                3 Active
              </span>
            </a>

            <a
              href="#lab-reports"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-sm text-outline">science</span>
                <span>Lab &amp; Radiology</span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-high text-primary px-space-2xs rounded font-semibold">
                2 New
              </span>
            </a>

            <a
              href="#billing"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-title-md text-body-md"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-sm text-outline">receipt_long</span>
                <span>Billing &amp; TPA</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">Cashless</span>
            </a>

            <div className="my-space-xs h-px bg-surface-container"></div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-error hover:bg-error-container/30 transition-colors font-title-md text-body-md text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Government Schemes & Ayushman Desk Widget */}
          <div className="bg-surface-container-high rounded-xl p-space-md flex flex-col gap-space-xs text-on-surface border border-surface-container">
            <div className="flex items-center gap-space-xs text-secondary">
              <span className="material-symbols-outlined text-headline-sm">health_and_safety</span>
              <span className="font-headline-sm text-label-md uppercase tracking-wide font-bold">PM-JAY / ABHA Desk</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ABHA Health ID linked with instant cashless reimbursement eligibility.
            </p>
            <div className="mt-space-2xs flex items-center justify-between text-label-sm font-label-sm bg-surface-container-lowest px-space-sm py-space-2xs rounded-lg text-on-surface border border-surface-container">
              <span>ABHA ID:</span>
              <span className="font-semibold font-currency-stat text-body-sm text-primary">
                {user?.patient?.abhaId || '91-8841-2094-11'}
              </span>
            </div>
          </div>
        </nav>

        {/* Center Workspace / Clinical Dashboard Core */}
        <div className="flex-1 min-w-0 flex flex-col gap-space-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
