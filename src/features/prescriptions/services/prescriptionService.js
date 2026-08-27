import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.prescriptions);

export const prescriptionService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    items: async (id) => {
        const { data } = await axiosInstance.get(ENDPOINTS.prescriptionItemsByPrescription(id));
        return data;
    },
};

export default prescriptionService;
