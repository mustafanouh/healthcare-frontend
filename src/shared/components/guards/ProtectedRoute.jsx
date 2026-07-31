import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const ProtectedRoute = () => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
