import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const res = await apiClient.post(ENDPOINTS.APPOINTMENTS.BASE, appointmentData);
    return res.data;
  },

  getAppointmentById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.APPOINTMENTS.BY_ID(id));
    return res.data;
  },

  getAppointmentByToken: async (tokenId) => {
    const res = await apiClient.get(ENDPOINTS.APPOINTMENTS.BY_TOKEN(tokenId));
    return res.data;
  },

  getMyAppointments: async () => {
    const res = await apiClient.get(ENDPOINTS.APPOINTMENTS.MY);
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await apiClient.put(ENDPOINTS.APPOINTMENTS.CANCEL(id));
    return res.data;
  },

  rescheduleAppointment: async (id, data) => {
    const res = await apiClient.put(ENDPOINTS.APPOINTMENTS.RESCHEDULE(id), data);
    return res.data;
  },
};
