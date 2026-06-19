import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const prescriptionService = createResourceService(ENDPOINTS.prescriptions);
export default prescriptionService;
