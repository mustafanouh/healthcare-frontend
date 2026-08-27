import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import { useQuery } from '@tanstack/react-query';
import facilityService from '../services/facilityService';

export const {
  useList: useFacilities,
  useShow: useFacility,
  useCreate: useCreateFacility,
  useUpdate: useUpdateFacility,
  useRemove: useDeleteFacility,
} = createResourceHooks('facilities', facilityService);

export const useFacilityStaff = (id) => useQuery({
  queryKey: ['facilities', 'staff', id],
  queryFn: () => facilityService.staff(id),
  enabled: Boolean(id),
});
