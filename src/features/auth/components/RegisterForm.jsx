import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Input, Select, Button } from '../../../shared/components/ui';
import { registerSchema } from '../../../shared/utils/validators';
import { useRegisterMutation } from '../hooks/useAuthMutations';

const RegisterForm = () => {
  const { t } = useTranslation(['auth', 'common']);
  const registerMutation = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      national_number: '',
      phone: '',
      gender: 'male',
      address: '',
      date_of_birth: '',
    },
    validationSchema: registerSchema(t),
    onSubmit: (values) => registerMutation.mutate(values),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('register.name')} name="name" formik={formik} />
        <Input label={t('register.email')} name="email" type="email" formik={formik} dir="ltr" />
        <Input label={t('register.nationalNumber')} name="national_number" formik={formik} dir="ltr" />
        <Input label={t('register.phone')} name="phone" type="tel" formik={formik} dir="ltr" />

        <Select
          label={t('register.gender')}
          name="gender"
          formik={formik}
          options={[
            { value: 'male', label: t('register.male') },
            { value: 'female', label: t('register.female') },
          ]}
        />
        <Input label={t('register.dob')} name="date_of_birth" type="date" formik={formik} dir="ltr" />

        <div className="sm:col-span-2">
          <Input label={t('register.address')} name="address" formik={formik} />
        </div>

        <Input
          label={t('register.password')}
          name="password"
          type="password"
          formik={formik}
          dir="ltr"
        />
        <Input
          label={t('register.passwordConfirm')}
          name="password_confirmation"
          type="password"
          formik={formik}
          dir="ltr"
        />
      </div>

      {registerMutation.isError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {registerMutation.error?.response?.data?.message || t('errors.registerFailed')}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" loading={registerMutation.isPending}>
        {t('register.submit')}
      </Button>
    </form>
  );
};

export default RegisterForm;
