import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../../shared/components/layout/AuthLayout';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const location = useLocation();
  const justRegistered = location.state?.registered;

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('login.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('login.subtitle')}</p>
      </div>

      {justRegistered && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            {t('register.title')} ✓
          </p>
        </div>
      )}

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('login.noAccount')}{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          {t('login.register')}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
