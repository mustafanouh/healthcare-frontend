import { useTranslation } from 'react-i18next';
import PreferenceSwitcher from './PreferenceSwitcher';

/**
 * Shared shell for /login and /register.
 * Soft blue/gray background, centered card, brand mark, and a
 * theme/language switcher in the corner.
 */
const AuthLayout = ({ children }) => {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-end p-4">
        <PreferenceSwitcher />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('appName')}</h1>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-gray-100 dark:border-surface-800 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
