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
        if (data?.data && !Array.isArray(data.data)) {
            const groups = [
                ['doctors', 'doctor'],
                ['pharmacists', 'pharmacist'],
                ['lab_staff', 'lab_staff'],
            ];
            const staff = groups.flatMap(([key, type]) => (
                Array.isArray(data.data[key]?.data)
                    ? data.data[key].data.map((member) => ({ ...member, type }))
                    : []
            ));

            return { ...data, data: staff, total: staff.length };
        }

        return normalizeListResponse(data);
    },
    manager: async (id) => {
        const { data } = await axiosInstance.get(ENDPOINTS.facilityManager(id));
        return data;
    },
    departments: async (facilityId) => {
        const { data } = await axiosInstance.get(`/facilities/${facilityId}/departments`);
        return normalizeListResponse(data);
    },
    specializations: async (facilityId, departmentId) => {
        const { data } = await axiosInstance.get(`/facilities/${facilityId}/departments/${departmentId}/specializations`);
        return normalizeListResponse(data);
    },
    doctorsBySpecialization: async (facilityId, departmentId, specializationId) => {
        const { data } = await axiosInstance.get(`/facilities/${facilityId}/departments/${departmentId}/specializations/${specializationId}/doctors`);
        return normalizeListResponse(data);
    },
};

export default facilityService;
