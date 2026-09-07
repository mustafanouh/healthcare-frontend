import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
import { useLabRequestItems } from '../../lab-results/hooks/useLabRequestItems';
import { useLabDashboard } from '../hooks/useLabDashboard';
import { formatDate } from '../../../shared/utils/formatters';

const LabDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: dashboardData, isLoading: dashboardLoading } = useLabDashboard();
  const { data: reqData, isLoading } = useLabRequestItems({ status: 'pending' });
  const requests = reqData?.data ?? [];
  const summary = dashboardData?.data?.summary ?? dashboardData?.summary ?? {};

  const stats = [
    {
      key: 'pending_requests',
      label: t('lab.pendingRequests'),
      cardClass: 'border-rose-100 dark:border-rose-900/40',
      valueClass: 'text-rose-600 dark:text-rose-400',
    },
    {
      key: 'in_progress_requests',
      label: t('lab.inProgressRequests'),
      cardClass: 'border-blue-100 dark:border-blue-900/40',
      valueClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'completed_requests',
      label: t('lab.completedRequests'),
      cardClass: 'border-emerald-100 dark:border-emerald-900/40',
      valueClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'completed_today',
      label: t('lab.completedToday'),
      cardClass: 'border-violet-100 dark:border-violet-900/40',
      valueClass: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('lab.title')}
        subtitle={t('lab.subtitle')}
        action={
          <Link to="/lab/requests">
            <Button>{t('lab.enterResult')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ key, label, cardClass, valueClass }) => (
          <Card key={key} className={cardClass}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
              {dashboardLoading ? <span className="inline-block w-10 h-9 bg-gray-100 dark:bg-surface-800 rounded animate-pulse" /> : summary[key] ?? 0}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('lab.pendingRequests')}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">{t('actions.noData', { ns: 'common' })}</p>
        ) : (
          <div className="space-y-2">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {req.lab_test?.name ?? `Test #${req.lab_test_id}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(req.requested_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={req.status ?? 'pending'} />
                  <Link to={`/lab/requests?request_item_id=${req.id}`}>
                    <Button size="sm">{t('lab.enterResult')}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LabDashboard;
