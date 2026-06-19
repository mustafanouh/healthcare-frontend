import { Outlet } from 'react-router-dom';

/** Pass-through route wrapper — role and auth checks disabled. */
const ProtectedRoute = () => <Outlet />;

export default ProtectedRoute;
