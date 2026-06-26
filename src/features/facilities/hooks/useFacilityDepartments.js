import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import facilityDepartmentService from '../services/facilityDepartmentService';

export const {
  useList: useFacilityDepartments,
  useShow: useFacilityDepartment,
  useCreate: useCreateFacilityDepartment,
  useUpdate: useUpdateFacilityDepartment,
  useRemove: useDeleteFacilityDepartment,
} = createResourceHooks('facility-departments', facilityDepartmentService);
