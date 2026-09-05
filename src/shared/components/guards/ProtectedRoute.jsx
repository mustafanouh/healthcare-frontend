import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { ADMIN_ROLES, getRoleDashboard, ROLES } from '../../../types/roles';

const ROLE_PATHS = [
  { prefix: '/admin', roles: ADMIN_ROLES },
  { prefix: '/doctor', roles: [ROLES.DOCTOR] },
  { prefix: '/patient', roles: [ROLES.PATIENT] },
  { prefix: '/pharmacist', roles: [ROLES.PHARMACIST] },
  { prefix: '/lab', roles: [ROLES.LAB_STAFF] },
];

const ProtectedRoute = () => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const pathRule = ROLE_PATHS.find(({ prefix }) => location.pathname.startsWith(prefix));
  if (pathRule && !hasAnyRole(pathRule.roles)) {
    return <Navigate to={getRoleDashboard(user) ?? '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
