import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.employees);

const cleanListParams = (params = {}) => Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
);

export const employeeService = {
    ...baseService,

    softDelete: async (id) => {
        const { data } = await axiosInstance.delete(ENDPOINTS.employeeSoftDelete(id));
        return data;
    },

    activate: async (id) => {
        const { data } = await baseService.update(id, { is_active: true });
        return data;
    },

    list: async (params = {}) => {
        const body = await baseService.list(cleanListParams(params));
        return normalizeListResponse(body);
    },
};

export default employeeService;
