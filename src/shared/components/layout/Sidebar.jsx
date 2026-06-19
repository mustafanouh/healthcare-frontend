import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { NAV_GROUPS } from './navConfig';

const Sidebar = ({ mobileOpen, desktopOpen, onMobileClose }) => {
  const { t } = useTranslation('common');

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      onMobileClose();
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={clsx(
          'flex flex-col h-full min-h-0 flex-shrink-0 z-40',
          'bg-white dark:bg-surface-900 border-e border-gray-200/80 dark:border-surface-800',
          'transition-all duration-300 ease-in-out',
          // Mobile: off-canvas drawer
          'fixed inset-y-0 start-0 w-64 shadow-xl',
          mobileOpen
            ? 'max-lg:translate-x-0'
            : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full',
          // Desktop: always in document flow, no translate
          'lg:static lg:translate-x-0 lg:shadow-none',
          desktopOpen ? 'lg:w-64' : 'lg:w-0 lg:overflow-hidden lg:border-e-0',
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-gray-100 dark:border-surface-800 flex-shrink-0 min-w-[16rem]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {t('appName')}
            </span>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-surface-800 dark:hover:text-gray-200 transition-colors"
            title={t('layout.closeSidebar')}
            aria-label={t('layout.closeSidebar')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain sidebar-scroll px-3 py-4 space-y-5 min-w-[16rem]">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {t(group.labelKey)}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    title={t(item.labelKey)}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800'
                      )
                    }
                  >
                    <svg
                      className="w-[18px] h-[18px] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="truncate">{t(item.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 dark:border-surface-800 min-w-[16rem]">
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
            {t('layout.sidebarHint')}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
