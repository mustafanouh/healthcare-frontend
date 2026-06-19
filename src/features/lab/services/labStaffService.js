import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const labStaffService = createResourceService(ENDPOINTS.labStaff);
export default labStaffService;
