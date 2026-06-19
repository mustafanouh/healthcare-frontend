import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
import { useLabRequestItems } from '../../lab-results/hooks/useLabRequestItems';
import { formatDate } from '../../../shared/utils/formatters';

const LabDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: reqData, isLoading } = useLabRequestItems({ status: 'pending' });
  const requests = reqData?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('lab.title')}
        subtitle={t('lab.subtitle')}
        action={
          <Link to="/lab/results">
            <Button>{t('lab.enterResult')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6m-1 0v6.5a4.5 4.5 0 11-4 0V3m4 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('lab.pendingRequests')}</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{requests.length}</p>
          </div>
        </div>
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
                  <Link to={`/lab/results?request_item_id=${req.id}`}>
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
