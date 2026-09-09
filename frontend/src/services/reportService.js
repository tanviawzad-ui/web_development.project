import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const reportService = {
  getMyReports: async () => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.MY);
    return res.data;
  },

  lookupReports: async (identifier) => {
    const res = await apiClient.post(ENDPOINTS.REPORTS.LOOKUP, { identifier });
    return res.data;
  },

  getReportById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.BY_ID(id));
    return res.data;
  },
};
