import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import pharmacistService from '../services/pharmacistService';

export const {
  useList: usePharmacists,
  useShow: usePharmacist,
  useCreate: useCreatePharmacist,
  useUpdate: useUpdatePharmacist,
  useRemove: useDeletePharmacist,
} = createResourceHooks('pharmacists', pharmacistService);
