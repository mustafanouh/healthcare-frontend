import clsx from 'clsx';

const VARIANTS = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-surface-800 dark:text-gray-200 dark:border-surface-700 dark:hover:bg-surface-700',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent dark:text-gray-300 dark:hover:bg-surface-800',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-sm',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  icon,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium border transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && icon}
      {children}
    </button>
  );
};

export default Button;
