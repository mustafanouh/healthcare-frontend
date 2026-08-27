import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';
import axiosInstance from '../../../core/api/axiosInstance';

const baseService = createResourceService(ENDPOINTS.facilityDepartments);

export const facilityDepartmentService = {
    ...baseService,
    listByFacility: async (facilityId) => {
        const { data } = await axiosInstance.get(`/facilities/${facilityId}/departments`);
        return normalizeListResponse(data);
    },
    assign: async (facilityId, payload) => {
        const { data } = await axiosInstance.post(`/facilities/${facilityId}/departments`, payload);
        return data;
    },
    removeAssignment: async (assignmentId) => {
        const { data } = await axiosInstance.delete(`/facilities/departments/${assignmentId}`);
        return data;
    },
};

export default facilityDepartmentService;
