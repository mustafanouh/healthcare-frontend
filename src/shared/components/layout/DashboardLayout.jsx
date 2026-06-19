import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setMobileOpen((v) => !v);
    } else {
      setDesktopOpen((v) => !v);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-surface-950">
      <Sidebar
        mobileOpen={mobileOpen}
        desktopOpen={desktopOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Navbar
          sidebarOpen={desktopOpen || mobileOpen}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
