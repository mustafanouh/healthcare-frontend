import { isValidElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Spinner from './Spinner';
import TableActionButton from './TableActionButton';
import { getInitials } from '../../utils/formatters';

const BADGE_KEYS = new Set([
  'facility_type',
  'blood_type',
  'specialization',
  'department',
  'facility',
  'unit',
  'status',
]);

const BADGE_TONES = {
  facility_type: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  blood_type: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  department: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  facility: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  unit: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  default: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
};

const inferVariant = (col) => {
  if (col.cellVariant) return col.cellVariant;
  if (col.key === 'id') return 'id';
  if (col.key === 'name' || col.avatar) return 'name';
  if (BADGE_KEYS.has(col.key)) return 'badge';
  if (col.key === 'phone' || col.key === 'phone_number' || col.key === 'address') return 'muted';
  return 'text';
};

const isEmpty = (value) => value == null || value === '' || value === '—';

const IdBadge = ({ value }) => (
  <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-md bg-gray-100 dark:bg-surface-800 text-xs font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
    {value}
  </span>
);

const NameCell = ({ name }) => (
  <div className="flex items-center gap-3 min-w-[10rem]">
    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
      {getInitials(name)}
    </div>
    <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[14rem]">
      {name}
    </span>
  </div>
);

const BadgePill = ({ children, tone = 'default' }) => (
  <span
    className={clsx(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
      BADGE_TONES[tone] ?? BADGE_TONES.default,
    )}
  >
    {children}
  </span>
);

const EmptyState = ({ message }) => (
  <div className="py-20 flex flex-col items-center text-center text-gray-400 dark:text-gray-500">
    <div className="w-14 h-14 mb-4 rounded-2xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center">
      <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11h6M9 15h4" />
      </svg>
    </div>
    <p className="text-sm">{message}</p>
  </div>
);

const renderCellContent = (row, col) => {
  const raw = col.render ? col.render(row) : row[col.key];
  const variant = inferVariant(col);

  if (isValidElement(raw)) return raw;

  const text = raw ?? '—';
  const empty = isEmpty(text);

  switch (variant) {
    case 'id':
      return <IdBadge value={text} />;

    case 'name': {
      const nameText = empty
        ? `#${row.id}`
        : (typeof text === 'string' ? text : String(text));
      return <NameCell name={nameText} />;
    }

    case 'badge':
      return empty
        ? <span className="text-gray-400">—</span>
        : <BadgePill tone={BADGE_TONES[col.key] ? col.key : 'default'}>{text}</BadgePill>;

    case 'muted':
      return (
        <span
          className={clsx(empty ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400')}
          dir={col.dir ?? (col.key === 'phone' || col.key === 'phone_number' ? 'ltr' : undefined)}
        >
          {text}
        </span>
      );

    default:
      return (
        <span className={clsx(empty ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200')}>
          {text}
        </span>
      );
  }
};

/**
 * Enhanced table — same API as DataTable with improved visual design.
 *
 * Column hints (optional):
 *   cellVariant: 'id' | 'name' | 'badge' | 'muted' | 'text'
 *   avatar: true — treat column as name with initials avatar
 */
const EnhancedDataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  viewLabel,
}) => {
  const { t } = useTranslation('common');
  const showActions = Boolean(onEdit || onDelete || onView);

  if (isLoading) {
    return (
      <div className="py-20">
        <Spinner fullScreen={false} className="mx-auto" />
      </div>
    );
  }

  if (!data?.length) {
    return <EmptyState message={t('actions.noData')} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-surface-800/50 border-b border-gray-100 dark:border-surface-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400',
                  col.key === 'id' && 'w-16',
                  col.align === 'end' ? 'text-end' : 'text-start',
                )}
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-48">
                {t('common.actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
          {data.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 align-middle">
                  {renderCellContent(row, col)}
                </td>
              ))}
              {showActions && (
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                    {onView && (
                      <TableActionButton
                        variant="neutral"
                        label={viewLabel ?? t('actions.viewMore')}
                        onClick={() => onView(row)}
                      />
                    )}
                    {onEdit && (
                      <TableActionButton
                        variant="primary"
                        label={t('actions.edit')}
                        onClick={() => onEdit(row)}
                      />
                    )}
                    {onDelete && (
                      <TableActionButton
                        variant="danger"
                        label={t('actions.delete')}
                        onClick={() => onDelete(row)}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnhancedDataTable;
