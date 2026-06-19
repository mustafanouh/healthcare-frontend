import { Outlet } from 'react-router-dom';

/** Pass-through route wrapper — guest redirect disabled. */
const GuestRoute = () => <Outlet />;

export default GuestRoute;
