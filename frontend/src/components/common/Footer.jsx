import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-on-primary pt-space-3xl pb-space-xl border-t border-surface-container/20">
      <div className="max-w-[1280px] mx-auto px-gutter-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl border-b border-surface-container/15">
          {/* Col 1: Brand & Accreditation */}
          <div className="lg:col-span-2 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest/20 flex items-center justify-center text-secondary-fixed shadow-sm">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-lg text-title-lg text-surface-bright font-display font-bold">
                  MediCare
                </span>
                <span className="font-label-sm text-label-sm text-surface-container-high font-medium">
                  Multispeciality Hospital
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-surface-container-high max-w-sm leading-relaxed">
              A premier healthcare institution committed to clinical excellence, patient dignity, and world-class tertiary healthcare across Delhi NCR.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-surface-container-highest/20 px-2.5 py-1 rounded-full text-label-sm font-semibold text-secondary-fixed">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                NABH Accredited Hospital
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-highest/20 px-2.5 py-1 rounded-full text-label-sm font-semibold text-secondary-fixed">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                NABL Diagnostic Labs
              </span>
            </div>
          </div>

          {/* Col 2: Centres of Excellence */}
          <div className="space-y-space-sm">
            <h4 className="font-title-md text-title-md text-surface-bright font-bold">Centres of Excellence</h4>
            <ul className="space-y-2 font-body-sm text-surface-container-high">
              <li><Link to="/doctors?department=CARDIO" className="hover:text-secondary-fixed transition-colors">Cardiology &amp; Cardiac Sciences</Link></li>
              <li><Link to="/doctors?department=NEURO" className="hover:text-secondary-fixed transition-colors">Institute of Neurosciences</Link></li>
              <li><Link to="/doctors?department=ORTHO" className="hover:text-secondary-fixed transition-colors">Orthopaedics &amp; Joint Care</Link></li>
              <li><Link to="/doctors?department=ONCO" className="hover:text-secondary-fixed transition-colors">Comprehensive Cancer Institute</Link></li>
              <li><Link to="/doctors?department=PAED" className="hover:text-secondary-fixed transition-colors">Paediatrics &amp; Neonatology</Link></li>
              <li><Link to="/doctors?department=NEPHRO" className="hover:text-secondary-fixed transition-colors">Nephrology &amp; Renal Care</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-space-sm">
            <h4 className="font-title-md text-title-md text-surface-bright font-bold">Quick Access</h4>
            <ul className="space-y-2 font-body-sm text-surface-container-high">
              <li><Link to="/book-appointment" className="hover:text-secondary-fixed transition-colors">Book OPD Slot</Link></li>
              <li><Link to="/doctors" className="hover:text-secondary-fixed transition-colors">Find a Specialist</Link></li>
              <li><Link to="/dashboard" className="hover:text-secondary-fixed transition-colors">Patient Portal &amp; Rx</Link></li>
              <li><a href="#reportModal" className="hover:text-secondary-fixed transition-colors">Lab Reports Online</a></li>
              <li><a href="#insurance" className="hover:text-secondary-fixed transition-colors">Cashless Insurance &amp; TPA</a></li>
              <li><a href="#emergency" className="hover:text-secondary-fixed transition-colors">24x7 Trauma ER</a></li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="space-y-space-sm">
            <h4 className="font-title-md text-title-md text-surface-bright font-bold">Emergency &amp; Help</h4>
            <div className="space-y-2 font-body-sm text-surface-container-high">
              <div className="flex items-center gap-2 text-error-container font-semibold">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                <span>Trauma ER: 1066</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">ambulance</span>
                <span>Ambulance: 108</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">call</span>
                <span>Toll-Free: 1800-208-5555</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">location_on</span>
                <span>Indraprastha, New Delhi 110025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-surface-container-high text-xs">
          <p>© {new Date().getFullYear()} MediCare Multispeciality Hospital Network. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <a href="#terms" className="hover:text-surface-bright transition-colors">Patient Charter</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-surface-bright transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#compliance" className="hover:text-surface-bright transition-colors">Clinical Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
