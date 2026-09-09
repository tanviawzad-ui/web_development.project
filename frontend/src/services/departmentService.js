import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const departmentService = {
  getAllDepartments: async () => {
    const res = await apiClient.get(ENDPOINTS.DEPARTMENTS.BASE);
    return res.data;
  },

  getDepartmentById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return res.data;
  },

  getDepartmentByCode: async (code) => {
    const res = await apiClient.get(ENDPOINTS.DEPARTMENTS.BY_CODE(code));
    return res.data;
  },
};
