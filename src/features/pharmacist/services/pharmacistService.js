import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const pharmacistService = createResourceService(ENDPOINTS.pharmacists);
export default pharmacistService;
