import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../core/hooks/useAuth';
import { useRole } from '../../../core/hooks/useRole';
import { getInitials } from '../../utils/formatters';
import LogoutButton from '../../../features/auth/components/LogoutButton';
import PreferenceSwitcher from './PreferenceSwitcher';

const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const { t } = useTranslation('common');
  const { fullName } = useAuth();
  const { label: roleLabel } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200/80 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
          title={sidebarOpen ? t('layout.closeSidebar') : t('layout.openSidebar')}
          aria-label={sidebarOpen ? t('layout.closeSidebar') : t('layout.openSidebar')}
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="hidden sm:block min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {t('layout.welcome')}, {fullName || t('layout.guest')}
          </p>
          <p className="text-xs text-gray-400 truncate">{roleLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PreferenceSwitcher />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 ps-1 pe-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-surface-700"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-sm">
              {getInitials(fullName)}
            </div>
            <div className="text-start hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight truncate max-w-[140px]">
                {fullName}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute end-0 mt-2 w-52 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-gray-100 dark:border-surface-800 py-1.5 z-30">
              <div className="px-3 py-2 md:hidden border-b border-gray-50 dark:border-surface-800 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{fullName}</p>
                <p className="text-xs text-gray-400">{roleLabel}</p>
              </div>
              <div className="px-1.5">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
