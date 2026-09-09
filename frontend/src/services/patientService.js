import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const patientService = {
  getDashboard: async () => {
    const res = await apiClient.get(ENDPOINTS.PATIENT.DASHBOARD);
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get(ENDPOINTS.PATIENT.PROFILE);
    return res.data;
  },

  getVitals: async () => {
    const res = await apiClient.get(ENDPOINTS.PATIENT.VITALS);
    return res.data;
  },

  getByUhid: async (uhid) => {
    const res = await apiClient.get(ENDPOINTS.PATIENT.BY_UHID(uhid));
    return res.data;
  },
};
