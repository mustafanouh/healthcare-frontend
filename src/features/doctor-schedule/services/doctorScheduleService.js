import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.doctorSchedule);

export const doctorScheduleService = {
    ...baseService,
    list: async (params = {}) => {
        const body = await baseService.list(params);
        return normalizeListResponse(body);
    },
};

export default doctorScheduleService;
