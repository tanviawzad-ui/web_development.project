export const API_BASE_URL = '/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    BY_CODE: (code) => `/departments/code/${code}`,
  },
  DOCTORS: {
    BASE: '/doctors',
    FEATURED: '/doctors/featured',
    BY_ID: (id) => `/doctors/${id}`,
    BY_DEPT: (deptId) => `/doctors/department/${deptId}`,
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id) => `/appointments/${id}`,
    BY_TOKEN: (token) => `/appointments/token/${token}`,
    MY: '/appointments/my',
    CANCEL: (id) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
  },
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    PROFILE: '/patient/profile',
    VITALS: '/patient/vitals',
    BY_UHID: (uhid) => `/patient/uhid/${uhid}`,
  },
  REPORTS: {
    MY: '/reports/my',
    LOOKUP: '/reports/lookup',
    BY_ID: (id) => `/reports/${id}`,
  },
  PRESCRIPTIONS: {
    MY: '/prescriptions/my',
    REFILL: (id) => `/prescriptions/${id}/refill`,
  },
};
