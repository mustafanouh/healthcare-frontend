import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../core/i18n/i18n';

const applyDocumentDirection = (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'ar', // 'ar' | 'en' — Arabic is the default

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        applyDocumentDirection(lang);
        set({ language: lang });
      },

      toggleLanguage: () => {
        const next = get().language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(next);
        applyDocumentDirection(next);
        set({ language: next });
      },

      isRTL: () => get().language === 'ar',
    }),
    {
      name: 'healthcare-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDocumentDirection(state.language);
        }
      },
    }
  )
);
