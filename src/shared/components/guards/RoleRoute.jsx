import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { getRoleDashboard } from '../../../types/roles';

const RoleRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const hasAnyRole = useAuthStore((state) => state.hasAnyRole);

    if (!hasAnyRole(allowedRoles)) {
        return <Navigate to={getRoleDashboard(user) ?? '/'} replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RoleRoute;
