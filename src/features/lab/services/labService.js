import { ENDPOINTS } from '../../../core/api/endpoints';
import axiosInstance from '../../../core/api/axiosInstance';

const labService = {
    dashboard: async () => {
        const response = await axiosInstance.get(ENDPOINTS.pharmacistDashboard);
        return response.data;
    },
};

export default labService;