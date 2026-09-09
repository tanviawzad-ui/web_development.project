import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onOpenReportModal }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* 1. TOP EMERGENCY & ACCREDITATION BAR */}
      <div className="bg-primary text-on-primary">
        <div className="max-w-[1280px] mx-auto px-gutter-md h-10 flex items-center justify-between font-label-sm text-label-sm">
          <div className="flex items-center gap-space-md overflow-x-auto py-1">
            <div className="flex items-center gap-space-2xs text-error-container font-semibold">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>24x7 Emergency: +91 1800-208-5555</span>
            </div>
            <span className="opacity-40 hidden sm:inline">|</span>
            <div className="flex items-center gap-space-2xs text-secondary-fixed-dim">
              <span className="material-symbols-outlined text-[16px]">ambulance</span>
              <span>Ambulance: 108</span>
            </div>
            <span className="opacity-40 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-space-2xs text-tertiary-fixed">
              <span className="material-symbols-outlined text-[16px]">bloodtype</span>
              <span>Blood Bank: +91 98201-44332</span>
            </div>
          </div>
          <div className="flex items-center gap-space-md shrink-0">
            <div className="hidden lg:flex items-center gap-space-xs bg-surface-container-highest/20 px-space-xs py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed-dim">verified</span>
              <span className="text-surface-bright">NABH &amp; NABL Accredited</span>
            </div>
            <div className="flex items-center gap-space-2xs text-surface-container-highest">
              <span className="material-symbols-outlined text-[16px]">language</span>
              <button className="hover:text-on-primary transition-colors font-medium">English</button>
              <span className="opacity-40">/</span>
              <button className="hover:text-on-primary transition-colors font-medium">हिन्दी</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <div className="h-20 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-container/40">
        <div className="max-w-[1280px] mx-auto px-gutter-md h-full flex items-center justify-between gap-space-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-space-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-secondary-container shadow-sm">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_hospital
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-lg text-title-lg tracking-tight text-primary leading-tight font-display font-bold">
                MediCare
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Multispeciality Hospital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-space-md font-body-md text-body-md">
            <Link
              to="/"
              className={`transition-colors py-2 ${
                isActive('/') ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`transition-colors py-2 ${
                isActive('/doctors') ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/book-appointment"
              className={`transition-colors py-2 ${
                isActive('/book-appointment') ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Appointments
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors py-2 ${
                isActive('/dashboard') ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Patient Portal
            </Link>
            {onOpenReportModal && (
              <button
                type="button"
                onClick={onOpenReportModal}
                className="text-on-surface-variant hover:text-on-surface transition-colors py-2"
              >
                Lab Reports
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
            {/* SOS Emergency Call Button */}
            <a
              className="inline-flex items-center gap-1 bg-error text-on-error px-space-sm py-1.5 rounded-full font-label-sm text-label-sm font-bold shadow-[0_0_0_3px_rgba(225,29,72,0.15)] hover:bg-error/90 hover:text-on-error transition-all"
              href="tel:1066"
            >
              <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
              <span className="hidden sm:inline">SOS</span>
            </a>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error font-label-sm text-[10px] leading-tight flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </button>

            {/* User Auth or Dashboard Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 sm:pl-2 hover:opacity-90 transition-opacity"
                >
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-secondary"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJGA_lDSpDnTLIjHwe4_Maru5dFK4OnpkeGl-RyJ37BkYz9U_aAimCWkHJmsDRiKXylbE-sfVXuyABEUu2eHte9jTWXFCIRLqLae7WUuqzIyrWAVwEwiLsZj40UhCY6HphFaaCggJlomqVRcQ5KmHmZP2KJljbsRHNuUQ3s_1_sMyZ7MBMo7yrFwC68xbbHxBgKU4q1bpCe7Bodz8nbfVOl7hwlJLr2fhXIokvGY8XaHM2DkpBYlb6HQ"
                  />
                  <span className="hidden md:inline font-label-md text-label-md text-primary font-semibold">
                    {user?.fullName?.split(' ')[0] || 'Patient'}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline">expand_more</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container py-2 z-50">
                    <div className="px-4 py-2 border-b border-surface-container">
                      <p className="font-label-md text-primary font-bold truncate">{user?.fullName}</p>
                      <p className="font-body-sm text-on-surface-variant text-xs truncate">{user?.email}</p>
                      {user?.patient?.uhid && (
                        <p className="mt-1 inline-block bg-surface-container-low text-secondary font-label-sm text-[10px] px-2 py-0.5 rounded font-bold">
                          UHID: {user.patient.uhid}
                        </p>
                      )}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-body-sm text-primary hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">dashboard</span>
                      <span>Patient Dashboard</span>
                    </Link>
                    <Link
                      to="/book-appointment"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-body-sm text-primary hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                      <span>Book Appointment</span>
                    </Link>
                    <div className="my-1 border-t border-surface-container"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-body-sm text-error hover:bg-error-container/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center font-label-md text-label-md text-primary font-semibold px-space-sm py-2 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                Login / Register
              </Link>
            )}

            {/* Book Appointment CTA */}
            <Link
              to="/book-appointment"
              className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-space-md py-2.5 rounded-lg font-label-md text-label-md font-semibold hover:bg-on-secondary-container hover:text-on-secondary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span className="hidden md:inline">Book Appointment</span>
              <span className="md:hidden">Book</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-primary hover:bg-surface-container"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container px-gutter-md py-4 space-y-2 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-title-md text-primary hover:text-secondary"
            >
              Home
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-title-md text-primary hover:text-secondary"
            >
              Doctors Directory
            </Link>
            <Link
              to="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-title-md text-primary hover:text-secondary"
            >
              Book Appointment
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-title-md text-primary hover:text-secondary"
            >
              Patient Dashboard
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-title-md text-secondary font-bold"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
