import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, PageHeader, Spinner } from '../../../shared/components/ui';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { formatDateTime } from '../../../shared/utils/formatters';

const ACTION_STYLES = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const AuditLogsPage = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [tableName, setTableName] = useState('');
  const params = { page, ...(action && { action }), ...(tableName && { table_name: tableName }) };
  const { data, isLoading, isError, error } = useAuditLogs(params);
  const logs = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta ?? {};
  const locale = i18n.language === 'ar' ? 'ar' : 'en';
  const totalPages = pagination.last_page ?? 1;

  const resetFilters = () => {
    setAction('');
    setTableName('');
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title={t('auditLogs.title')}
        subtitle={t('auditLogs.subtitle')}
      />

      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-3 p-5 border-b border-gray-100 dark:border-surface-800">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            <span className="block mb-1.5 font-medium">{t('auditLogs.action')}</span>
            <select
              value={action}
              onChange={(event) => { setAction(event.target.value); setPage(1); }}
              className="h-10 min-w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
            >
              <option value="">{t('common.all', { ns: 'common' })}</option>
              <option value="create">{t('auditLogs.actions.create')}</option>
              <option value="update">{t('auditLogs.actions.update')}</option>
              <option value="delete">{t('auditLogs.actions.delete')}</option>
            </select>
          </label>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            <span className="block mb-1.5 font-medium">{t('auditLogs.table')}</span>
            <input
              value={tableName}
              onChange={(event) => { setTableName(event.target.value); setPage(1); }}
              placeholder={t('auditLogs.tablePlaceholder')}
              className="h-10 w-48 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
            />
          </label>
          {(action || tableName) && (
            <button type="button" onClick={resetFilters} className="h-10 px-3 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
              {t('auditLogs.clearFilters')}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-20"><Spinner fullScreen={false} className="mx-auto" /></div>
        ) : isError ? (
          <div className="py-20 text-center text-sm text-red-500">
            {error?.response?.data?.message ?? t('errors.generic', { ns: 'common' })}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">{t('actions.noData', { ns: 'common' })}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-surface-800/50 text-gray-500 dark:text-gray-400">
                  <th className="px-5 py-3 text-start font-medium">{t('auditLogs.performedBy')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('auditLogs.resource')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('auditLogs.action')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('auditLogs.record')}</th>
                  <th className="px-5 py-3 text-start font-medium whitespace-nowrap">{t('auditLogs.date')}</th>
                  <th className="px-5 py-3 text-end font-medium">{t('common.actions', { ns: 'common' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                {logs.map((log) => (
                  <tr key={log.id} className="align-top hover:bg-gray-50/60 dark:hover:bg-surface-800/30">
                    <td className="px-5 py-4 min-w-48">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{log.user?.name ?? `#${log.user_id}`}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{log.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{log.table_name}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${ACTION_STYLES[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                        {t(`auditLogs.actions.${log.action}`, { defaultValue: log.action })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">#{log.record_id}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{formatDateTime(log.created_at, locale)}</td>
                    <td className="px-5 py-4 text-end">
                      <Link
                        to={`/admin/audit-logs/${log.id}`}
                        className="inline-flex rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        {t('auditLogs.viewDetails')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm dark:border-surface-800">
            <span className="text-gray-500 dark:text-gray-400">{t('auditLogs.page', { current: pagination.current_page, total: pagination.total })}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{t('actions.previous', { ns: 'common' })}</button>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{t('actions.next', { ns: 'common' })}</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuditLogsPage;
