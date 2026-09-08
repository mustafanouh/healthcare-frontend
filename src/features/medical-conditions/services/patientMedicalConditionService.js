import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.patientMedicalConditions);

export const patientMedicalConditionService = {
  ...baseService,
  forPatient: async (patientId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.patientMedicalConditionsByPatient(patientId));
    return normalizeListResponse(data);
  },
};
export default patientMedicalConditionService;
