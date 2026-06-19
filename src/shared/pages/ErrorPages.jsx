import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { getRoleDashboard } from '../../types/roles';

export const UnauthorizedPage = () => {
  const { t } = useTranslation('common');
  const user = useAuthStore((s) => s.user);
  const home = getRoleDashboard(user) ?? '/login';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-surface-950">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">403</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('errors.unauthorized')}</p>
        <Link to={home}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          {t('actions.back')}
        </Link>
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  const { t } = useTranslation('common');
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-surface-950">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('errors.notFound')}</p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          {t('actions.back')}
        </Link>
      </div>
    </div>
  );
};
