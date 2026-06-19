import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import facilityService from '../services/facilityService';

export const {
  useList: useFacilities,
  useShow: useFacility,
  useCreate: useCreateFacility,
  useUpdate: useUpdateFacility,
  useRemove: useDeleteFacility,
} = createResourceHooks('facilities', facilityService);
