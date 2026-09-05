import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.employees);

const cleanListParams = (params = {}) => Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
);

export const employeeService = {
    ...baseService,

    list: async (params = {}) => {
        const body = await baseService.list(cleanListParams(params));
        return normalizeListResponse(body);
    },
};

export default employeeService;
