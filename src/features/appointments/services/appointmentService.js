import axiosInstance from '../../../core/api/axiosInstance';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

const baseService = createResourceService(ENDPOINTS.appointments);

export const appointmentService = {
  ...baseService,

  /**
   * GET /available-slots
   * Used by patients/doctors to find open appointment slots.
   * params: { doctor_id, date, ... }
   */
  availableSlots: async (params = {}) => {
    const { data } = await axiosInstance.get(ENDPOINTS.availableSlots, { params });
    return data;
  },

  /**
   * PATCH /appointments/{id}/status
   * body: { status: 'confirmed' | 'completed' | 'cancelled' | ... }
   */
  changeStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(ENDPOINTS.appointmentStatus(id), { status });
    return data;
  },
};

export default appointmentService;
