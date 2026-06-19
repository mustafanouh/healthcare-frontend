import clsx from 'clsx';

/**
 * Surface card — the base container used for tables, forms, and stat blocks.
 * Mirrors the soft Facebook-style card look: white surface, subtle border,
 * rounded corners, minimal shadow.
 */
const Card = ({ children, className, padded = true }) => (
  <div
    className={clsx(
      'bg-white dark:bg-surface-900 rounded-2xl border border-gray-100 dark:border-surface-800',
      'shadow-sm',
      padded && 'p-6',
      className
    )}
  >
    {children}
  </div>
);

export default Card;
