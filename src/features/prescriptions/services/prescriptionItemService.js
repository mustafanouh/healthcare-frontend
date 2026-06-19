import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const prescriptionItemService = createResourceService(ENDPOINTS.prescriptionItems);
export default prescriptionItemService;
