import { useQuery } from '@tanstack/react-query';
import labService from '../services/labService';

export const useLabDashboard = () => useQuery({
    queryKey: ['lab', 'dashboard'],
    queryFn: labService.dashboard,
});