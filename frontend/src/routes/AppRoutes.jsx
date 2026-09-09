import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

import HomePage from '../pages/Home/HomePage';
import DoctorsPage from '../pages/Doctors/DoctorsPage';
import BookAppointmentPage from '../pages/Appointments/BookAppointmentPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Main Website Flow */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
      </Route>

      {/* Protected Patient Clinical Workspace */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
