import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.diagnoses);

export const diagnosisService = {
    ...baseService,
    list: async (params = {}) => {
        const response = await baseService.list(params);
        return normalizeListResponse(response);
    },
};

export default diagnosisService;
