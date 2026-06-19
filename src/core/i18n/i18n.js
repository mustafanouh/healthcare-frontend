import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Arabic
import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arDashboard from './locales/ar/dashboard.json';

// English
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { common: arCommon, auth: arAuth, dashboard: arDashboard },
      en: { common: enCommon, auth: enAuth, dashboard: enDashboard },
    },
    lng: localStorage.getItem('healthcare-language') || 'ar',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
