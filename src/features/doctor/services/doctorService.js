import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const doctorService = createResourceService(ENDPOINTS.doctors);
export default doctorService;
