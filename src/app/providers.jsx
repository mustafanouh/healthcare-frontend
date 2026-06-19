import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { queryClient } from '../core/api/queryClient';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { router } from './router';

/**
 * ThemeSync: applies persisted theme to <html> immediately on mount.
 * This prevents the flash of the wrong theme before Zustand rehydrates.
 */
const ThemeSync = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
};

/**
 * LangSync: applies persisted language and document direction on mount.
 */
const LangSync = () => {
  const { language, setLanguage } = useLanguageStore();
  useEffect(() => {
    setLanguage(language);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const Providers = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeSync />
    <LangSync />
    <RouterProvider router={router} />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);

export default Providers;
