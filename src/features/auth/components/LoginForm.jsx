import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../../shared/components/ui';
import { loginSchema } from '../../../shared/utils/validators';
import { parseApiError } from '../../../shared/utils/parseApiError';
import { useLoginMutation } from '../hooks/useAuthMutations';

const LoginForm = () => {
  const { t } = useTranslation(['auth', 'common']);
  const loginMutation = useLoginMutation();
  const apiErrorMessage = loginMutation.error?.response?.data?.message;
  const isInvalidCredentials =
    loginMutation.error?.response?.status === 401 ||
    (typeof apiErrorMessage === 'string' && apiErrorMessage.toLowerCase() === 'invalid credentials.');
  const loginErrorMessage = isInvalidCredentials
    ? t('errors.loginFailed')
    : parseApiError(loginMutation.error, t('errors.loginFailed'));

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema(t),
    onSubmit: (values) => loginMutation.mutate(values),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
      <Input
        label={t('login.email')}
        name="email"
        type="email"
        formik={formik}
        dir="ltr"
        placeholder="name@example.com"
        autoComplete="email"
      />

      <Input
        label={t('login.password')}
        name="password"
        type="password"
        formik={formik}
        dir="ltr"
        placeholder="••••••••"
        autoComplete="current-password"
      />

      {loginMutation.isError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {loginErrorMessage}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={loginMutation.isPending}
      >
        {t('login.submit')}
      </Button>
    </form>
  );
};

export default LoginForm;

