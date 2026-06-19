import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const patientService = createResourceService(ENDPOINTS.patients);
export default patientService;
