import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import facilityDeptSpecService from '../services/facilityDeptSpecService';

export const {
  useList: useFacilityDeptSpecs,
  useShow: useFacilityDeptSpec,
  useCreate: useCreateFacilityDeptSpec,
  useUpdate: useUpdateFacilityDeptSpec,
  useRemove: useDeleteFacilityDeptSpec,
} = createResourceHooks('facility-dept-specs', facilityDeptSpecService);
