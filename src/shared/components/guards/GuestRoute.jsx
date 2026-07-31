import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const GuestRoute = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (token && user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
