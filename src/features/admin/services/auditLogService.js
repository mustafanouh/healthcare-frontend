import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';
import { normalizeListResponse } from '../../../shared/utils/normalizeListResponse';

const baseService = createResourceService(ENDPOINTS.auditLogs);

export const auditLogService = {
  ...baseService,
  list: async (params = {}) => normalizeListResponse(await baseService.list(params)),
};

export default auditLogService;
