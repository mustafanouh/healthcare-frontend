import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.facilities);

export const facilityService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    staff: async (id) => {
        const { data } = await axiosInstance.get(ENDPOINTS.facilityStaff(id));
        return normalizeListResponse(data);
    },
    manager: async (id) => {
        const { data } = await axiosInstance.get(ENDPOINTS.facilityManager(id));
        return data;
    },
};

export default facilityService;
