import clsx from 'clsx';

const COLOR_MAP = {
  blue:   { accent: 'bg-blue-500',   icon: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',   value: 'text-blue-600 dark:text-blue-400' },
  green:  { accent: 'bg-emerald-500', icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400' },
  amber:  { accent: 'bg-amber-500',  icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',  value: 'text-amber-600 dark:text-amber-400' },
  rose:   { accent: 'bg-rose-500',   icon: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',   value: 'text-rose-600 dark:text-rose-400' },
  purple: { accent: 'bg-purple-500', icon: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400' },
  teal:   { accent: 'bg-teal-500',   icon: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',   value: 'text-teal-600 dark:text-teal-400' },
};

const StatCard = ({ title, value, icon, color = 'blue', loading = false, subtitle }) => {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-900 border border-gray-100 dark:border-surface-800 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className={clsx('absolute top-0 inset-x-0 h-1', c.accent)} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className={clsx('text-3xl font-bold mt-1 tracking-tight', c.value)}>
              {value ?? '—'}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
          )}
        </div>

        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', c.icon)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
