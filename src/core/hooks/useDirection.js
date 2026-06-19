import { useLanguageStore } from '../../store/languageStore';

/**
 * Returns direction-aware helpers so components don't hardcode
 * "left"/"right" classes — important since the app supports
 * both Arabic (RTL) and English (LTR).
 *
 *   const { dir, isRTL, start, end } = useDirection();
 *   <div className={`border-${start}-2`}>...</div>
 */
export const useDirection = () => {
  const language = useLanguageStore((s) => s.language);
  const isRTL = language === 'ar';

  return {
    dir: isRTL ? 'rtl' : 'ltr',
    isRTL,
    // Logical start/end mapped to physical left/right for Tailwind classes
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
  };
};
