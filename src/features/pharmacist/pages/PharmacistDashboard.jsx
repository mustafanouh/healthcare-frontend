import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
import { usePrescriptions } from '../../prescriptions/hooks/usePrescriptions';
import { formatDate } from '../../../shared/utils/formatters';

const PharmacistDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: rxData, isLoading } = usePrescriptions({ status: 'pending' });
  const prescriptions = rxData?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pharmacist.title')}
        subtitle={t('pharmacist.subtitle')}
        action={
          <Link to="/pharmacist/dispensing">
            <Button>{t('pharmacist.dispenseNow')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('pharmacist.pendingPrescriptions')}</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{prescriptions.length}</p>
          </div>
        </div>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('pharmacist.pendingPrescriptions')}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">{t('actions.noData', { ns: 'common' })}</p>
        ) : (
          <div className="space-y-2">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('prescriptions.title', { ns: 'dashboard' })} #{rx.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={rx.status} />
                  <Link to={`/pharmacist/dispensing?prescription_id=${rx.id}`}>
                    <Button size="sm">{t('pharmacist.dispenseNow')}</Button>
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

export default PharmacistDashboard;
