import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-surface-800 dark:text-gray-400',
  in_progress: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  processing: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-surface-800 dark:text-gray-400',
};

/**
 * Status badge. If `status` matches a known key (pending, confirmed, ...),
 * it's translated via common:status.* and styled semantically.
 * Otherwise, pass `children` directly for a plain badge.
 */
const Badge = ({ status, children, className }) => {
  const { t } = useTranslation('common');
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.default;
  const label = status ? t(`status.${status}`, status) : children;

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        style,
        className
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
