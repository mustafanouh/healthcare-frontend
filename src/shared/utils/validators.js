import * as Yup from 'yup';

/**
 * Shared Yup schema builders, parametrized with i18n `t` so error
 * messages follow the active language (ar/en).
 */

export const loginSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .email(t('login.errors.invalidEmail', { ns: 'auth' }))
      .required(t('errors.required', { ns: 'auth' })),
    password: Yup.string()
      .min(8, t('errors.minPassword', { ns: 'auth' }))
      .required(t('errors.required', { ns: 'auth' })),
  });

export const registerSchema = (t) =>
  Yup.object({
    name: Yup.string().required(t('errors.required', { ns: 'auth' })),
    email: Yup.string()
      .email(t('errors.invalidEmail', { ns: 'auth' }))
      .required(t('errors.required', { ns: 'auth' })),
    password: Yup.string()
      .min(8, t('errors.minPassword', { ns: 'auth' }))
      .required(t('errors.required', { ns: 'auth' })),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('errors.passwordMismatch', { ns: 'auth' }))
      .required(t('errors.required', { ns: 'auth' })),
    national_number: Yup.string().required(t('errors.required', { ns: 'auth' })),
    phone: Yup.string().required(t('errors.required', { ns: 'auth' })),
    gender: Yup.string().oneOf(['male', 'female']).required(),
    address: Yup.string().required(t('errors.required', { ns: 'auth' })),
    date_of_birth: Yup.string().required(t('errors.required', { ns: 'auth' })),
  });
