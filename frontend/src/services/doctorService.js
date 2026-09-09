import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const doctorService = {
  getDoctors: async (params = {}) => {
    const res = await apiClient.get(ENDPOINTS.DOCTORS.BASE, { params });
    return res.data;
  },

  getFeaturedDoctors: async () => {
    const res = await apiClient.get(ENDPOINTS.DOCTORS.FEATURED);
    return res.data;
  },

  getDoctorById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.DOCTORS.BY_ID(id));
    return res.data;
  },

  getDoctorsByDepartment: async (deptId) => {
    const res = await apiClient.get(ENDPOINTS.DOCTORS.BY_DEPT(deptId));
    return res.data;
  },
};
