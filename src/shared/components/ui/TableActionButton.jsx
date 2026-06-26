import clsx from 'clsx';

const VARIANTS = {
  neutral:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-surface-800 dark:hover:text-white',
  primary:
    'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  danger:
    'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
};

const TableActionButton = ({ onClick, label, variant = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
      VARIANTS[variant],
    )}
  >
    {label}
  </button>
);

export default TableActionButton;
