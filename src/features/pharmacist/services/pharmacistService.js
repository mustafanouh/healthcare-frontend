import { ENDPOINTS } from '../../../core/api/endpoints';
import axiosInstance from '../../../core/api/axiosInstance';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.pharmacists);

export const pharmacistService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    dashboard: async () => {
        const response = await axiosInstance.get(ENDPOINTS.pharmacistDashboard);
        return response.data;
    },
};

export default pharmacistService;
