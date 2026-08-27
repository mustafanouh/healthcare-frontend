import { ENDPOINTS } from '../../../core/api/endpoints';
import axiosInstance from '../../../core/api/axiosInstance';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.medicalConditions);

export const medicalConditionService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    update: async (id, payload) => {
        const { data } = await axiosInstance.put(`${ENDPOINTS.medicalConditionsUpdate}/${id}`, payload);
        return data;
    },
};

export default medicalConditionService;
