import axiosInstance from '../../../core/api/axiosInstance';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.appointments);

export const appointmentService = {
  ...baseService,

  list: async (params = {}) => {
    const body = await baseService.list(params);
    return normalizeListResponse(body);
  },

  availableSlots: async (params = {}) => {
    const { data } = await axiosInstance.get(ENDPOINTS.availableSlots, { params });
    return data;
  },

  changeStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(ENDPOINTS.appointmentStatus(id), { status });
    return data;
  },
};

export default appointmentService;