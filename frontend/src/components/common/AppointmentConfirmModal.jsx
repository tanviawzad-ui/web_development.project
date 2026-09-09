import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const AppointmentConfirmModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container overflow-hidden text-on-surface">
        {/* Success Banner */}
        <div className="bg-secondary text-on-secondary p-space-lg text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm font-bold font-display">
            Appointment Confirmed!
          </h2>
          <p className="font-body-sm text-body-sm text-white/85 mt-1">
            Your outpatient consultation slot is locked in MediCare OPD System.
          </p>
        </div>

        {/* Token Card */}
        <div className="p-space-lg space-y-space-md">
          <div className="bg-surface-container-low p-space-md rounded-xl text-center border border-secondary/20">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
              Digital OPD Queue Token
            </span>
            <span className="font-display text-4xl text-primary font-bold tracking-tight block my-1">
              Token {appointment.tokenId || 'B-14'}
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              Slot Time: {appointment.appointmentTime} ({appointment.sessionType || 'EVENING'})
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-body-sm font-body-sm border-t border-b border-surface-container py-space-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Patient Name:</span>
              <span className="font-semibold text-primary">{appointment.patientName}</span>
            </div>
            {appointment.patientUhid && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">UHID:</span>
                <span className="font-mono font-semibold text-primary">{appointment.patientUhid}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Treating Doctor:</span>
              <span className="font-semibold text-primary">{appointment.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Department:</span>
              <span className="text-primary">{appointment.departmentName || 'Cardiology'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Date:</span>
              <span className="font-semibold text-primary">{formatDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Hospital Desk:</span>
              <span className="text-primary">{appointment.doctorOpdRoom || 'Block B, 2nd Floor, Room 204'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Payment Status:</span>
              <span className="text-secondary font-bold">
                {appointment.paymentStatus || 'PAID'} (₹{appointment.feeAmount || 1500})
              </span>
            </div>
          </div>

          <div className="bg-surface-container-high/40 p-space-xs rounded-lg flex items-center gap-2 text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
            <span>SMS &amp; WhatsApp confirmation sent with digital gate pass slip.</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex-1 bg-primary text-on-primary text-center py-3 rounded-xl font-label-md text-label-md font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Go to Patient Portal
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container text-primary text-center py-3 rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmModal;
