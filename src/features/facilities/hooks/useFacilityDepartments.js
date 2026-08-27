import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import facilityDepartmentService from '../services/facilityDepartmentService';

export const useFacilityDepartments = (facilityId) => useQuery({
  queryKey: facilityId ? ['facilities', 'departments', facilityId] : ['facility-departments', 'list'],
  queryFn: () => facilityId ? facilityDepartmentService.listByFacility(facilityId) : facilityDepartmentService.list(),
  enabled: Boolean(facilityId),
});

export const useAssignFacilityDepartment = (facilityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => facilityDepartmentService.assign(facilityId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['facilities', 'departments', facilityId] }),
  });
};

export const useRemoveFacilityDepartment = (facilityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId) => facilityDepartmentService.removeAssignment(assignmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['facilities', 'departments', facilityId] }),
  });
};
