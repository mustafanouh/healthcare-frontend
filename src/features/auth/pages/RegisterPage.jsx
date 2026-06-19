import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../../shared/components/layout/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation('auth');

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('register.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('register.subtitle')}</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('register.haveAccount')}{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          {t('register.login')}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
