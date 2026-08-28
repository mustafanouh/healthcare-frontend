import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, PageHeader, Spinner } from '../../../shared/components/ui';
import { useAuditLog } from '../hooks/useAuditLogs';
import { formatDateTime } from '../../../shared/utils/formatters';

const ACTION_STYLES = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const ValuePanel = ({ title, value, tone }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const content = value == null ? t('auditLogs.notAvailable') : JSON.stringify(value, null, 2);

  return (
    <Card className="min-w-0" padded={false}>
      <div className="border-b border-gray-100 px-5 py-4 dark:border-surface-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <pre className={`max-h-[32rem] min-h-32 overflow-auto whitespace-pre-wrap break-words p-5 text-xs leading-6 ${tone}`}>
        {content}
      </pre>
    </Card>
  );
};

const AuditLogDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { data, isLoading, isError, error } = useAuditLog(id);
  const log = data?.data ?? data;
  const locale = i18n.language === 'ar' ? 'ar' : 'en';

  if (isLoading) {
    return <div className="py-20"><Spinner fullScreen={false} className="mx-auto" /></div>;
  }

  if (isError || !log) {
    return (
      <div>
        <PageHeader title={t('auditLogs.details')} />
        <Card>
          <p className="text-sm text-red-500">{error?.response?.data?.message ?? t('errors.generic', { ns: 'common' })}</p>
          <Link to="/admin/audit-logs" className="mt-5 inline-flex text-sm font-medium text-blue-600 dark:text-blue-400">
            {t('auditLogs.backToList')}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('auditLogs.details')}
        subtitle={`${log.table_name} #${log.record_id}`}
        action={(
          <Link to="/admin/audit-logs" className="inline-flex rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-surface-700 dark:text-gray-300 dark:hover:bg-surface-800">
            {t('auditLogs.backToList')}
          </Link>
        )}
      />

      <Card className="mb-6" padded={false}>
        <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-surface-800 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
          <div className="p-5">
            <p className="text-xs text-gray-400">{t('auditLogs.performedBy')}</p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">{log.user?.name ?? `#${log.user_id}`}</p>
            <p className="mt-0.5 text-xs text-gray-400">{log.user?.email}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400">{t('auditLogs.resource')}</p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">{log.table_name}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400">{t('auditLogs.action')}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${ACTION_STYLES[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
              {t(`auditLogs.actions.${log.action}`, { defaultValue: log.action })}
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400">{t('auditLogs.date')}</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{formatDateTime(log.created_at, locale)}</p>
            <p className="mt-1 text-xs text-gray-400">{t('auditLogs.record')} #{log.record_id}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ValuePanel title={t('auditLogs.oldValue')} value={log.old_value} tone="bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100" />
        <ValuePanel title={t('auditLogs.newValue')} value={log.new_value} tone="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100" />
      </div>
    </div>
  );
};

export default AuditLogDetailsPage;
