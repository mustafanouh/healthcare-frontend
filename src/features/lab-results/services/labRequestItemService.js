import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.labRequestItems);

export const labRequestItemService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
    start: async (id) => {
        const { data } = await axiosInstance.patch(ENDPOINTS.labRequestItemStart(id));
        return data;
    },
};

export default labRequestItemService;
