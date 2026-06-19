import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';

/**
 * Generic data table used across all CRUD feature pages.
 *
 *   <DataTable
 *     columns={[
 *       { key: 'id', label: t('common.id') },
 *       { key: 'name', label: t('common.name') },
 *       { key: 'status', label: t('common.status'), render: (row) => <Badge status={row.status} /> },
 *     ]}
 *     data={items}
 *     isLoading={isLoading}
 *     onEdit={(row) => ...}
 *     onDelete={(row) => ...}
 *   />
 */
const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onRowClick,
  emptyIcon,
}) => {
  const { t } = useTranslation('common');
  const showActions = Boolean(onEdit || onDelete);

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner fullScreen={false} className="mx-auto" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-gray-500">
        {emptyIcon}
        <p className="text-sm">{t('actions.noData')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full text-sm" style={{ tableLayout: 'auto' }}>
        <thead>
          <tr className="border-b border-gray-100 dark:border-surface-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                {t('common.actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-50 dark:border-surface-800/60 last:border-0
                hover:bg-gray-50 dark:hover:bg-surface-800/40 transition-colors
                ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {showActions && (
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-xs"
                      >
                        {t('actions.edit')}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 font-medium text-xs"
                      >
                        {t('actions.delete')}
                      </button>
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

export default DataTable;
