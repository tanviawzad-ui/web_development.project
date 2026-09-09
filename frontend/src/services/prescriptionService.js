import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const prescriptionService = {
  getMyPrescriptions: async () => {
    const res = await apiClient.get(ENDPOINTS.PRESCRIPTIONS.MY);
    return res.data;
  },

  refillPrescription: async (id) => {
    const res = await apiClient.post(ENDPOINTS.PRESCRIPTIONS.REFILL(id));
    return res.data;
  },
};
