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

export const useFacilityManager = (id) => useQuery({
  queryKey: ['facilities', 'manager', id],
  queryFn: () => facilityService.manager(id),
  enabled: Boolean(id),
});

export const useFacilityBookingDepartments = (facilityId) => useQuery({
  queryKey: ['facilities', 'booking-departments', facilityId],
  queryFn: () => facilityService.departments(facilityId),
  enabled: Boolean(facilityId),
});

export const useFacilityBookingSpecializations = (facilityId, departmentId) => useQuery({
  queryKey: ['facilities', 'booking-specializations', facilityId, departmentId],
  queryFn: () => facilityService.specializations(facilityId, departmentId),
  enabled: Boolean(facilityId && departmentId),
});

export const useFacilityBookingDoctors = (facilityId, departmentId, specializationId) => useQuery({
  queryKey: ['facilities', 'booking-doctors', facilityId, departmentId, specializationId],
  queryFn: () => facilityService.doctorsBySpecialization(facilityId, departmentId, specializationId),
  enabled: Boolean(facilityId && departmentId && specializationId),
});
