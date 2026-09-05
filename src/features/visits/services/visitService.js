import axiosInstance from '../../../core/api/axiosInstance';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.visits);

export const visitService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },

    completeVisit: async (id) => {
        const { data } = await axiosInstance.patch(ENDPOINTS.visitComplete(id));
        return data;
    },

    changeStatus: async (id, status) => {
        const { data } = await axiosInstance.patch(ENDPOINTS.visitStatus(id), { status });
        return data;
    },
};

export default visitService;
