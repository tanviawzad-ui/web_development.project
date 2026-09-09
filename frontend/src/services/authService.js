import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (credentials) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get(ENDPOINTS.AUTH.ME);
    return res.data;
  },
};
