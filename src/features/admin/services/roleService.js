import axiosInstance from '../../../core/api/axiosInstance';
import { ENDPOINTS } from '../../../core/api/endpoints';

const roleService = {
  listUsers: async (params = {}) => {
    const { data } = await axiosInstance.get(ENDPOINTS.roles, { params });
    return data;
  },

  listRoles: async () => {
    const { data } = await axiosInstance.get(ENDPOINTS.availableRoles);
    return data;
  },

  syncUserRoles: async (id, roles) => {
    const { data } = await axiosInstance.post(ENDPOINTS.syncUserRoles(id), { roles });
    return data;
  },
};

export default roleService;
