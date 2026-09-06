import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import { useQuery } from '@tanstack/react-query';
import pharmacistService from '../services/pharmacistService';

export const {
  useList: usePharmacists,
  useShow: usePharmacist,
  useCreate: useCreatePharmacist,
  useUpdate: useUpdatePharmacist,
  useRemove: useDeletePharmacist,
} = createResourceHooks('pharmacists', pharmacistService);

export const usePharmacistDashboard = () => useQuery({
  queryKey: ['pharmacist', 'dashboard'],
  queryFn: pharmacistService.dashboard,
});
