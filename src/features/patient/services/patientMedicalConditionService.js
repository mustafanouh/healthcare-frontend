import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.patientMedicalConditions);

export const patientMedicalConditionService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    // جديد: يرجع chronic_diseases + allergies لمريض واحد
    getSummaryByPatient: async (patientId) => {
        const { data } = await axiosInstance.get(ENDPOINTS.patientMedicalConditionsByPatient(patientId));
        return data; // { success, data: { patient_id, chronic_diseases, allergies } }
    },
};

export default patientMedicalConditionService;
