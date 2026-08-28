import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import auditLogService from '../services/auditLogService';

const auditLogHooks = createResourceHooks('audit-logs', auditLogService);

export const useAuditLogs = (params = {}, options = {}) => auditLogHooks.useList(params, options);
export const useAuditLog = (id, options = {}) => auditLogHooks.useShow(id, options);
