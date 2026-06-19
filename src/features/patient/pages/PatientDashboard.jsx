import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { useLabResults } from '../../lab-results/hooks/useLabResults';
import { usePrescriptions } from '../../prescriptions/hooks/usePrescriptions';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate, formatTime } from '../../../shared/utils/formatters';

const PatientDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const patientId = user?.patient?.id;

  const { data: apptsData, isLoading: loadA } = useAppointments({ patient_id: patientId });
  const { data: rxData,    isLoading: loadR } = usePrescriptions({ patient_id: patientId });
  const { data: labData,   isLoading: loadL } = useLabResults({ patient_id: patientId });

  const upcoming = (apptsData?.data ?? [])
    .filter((a) => ['pending', 'confirmed'].includes(a.status))
    .slice(0, 5);

  const recentRx  = (rxData?.data   ?? []).slice(0, 3);
  const recentLab = (labData?.data  ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('patient.title')}
        subtitle={t('patient.subtitle')}
        action={
          <Link to="/patient/appointments">
            <Button icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              {t('patient.bookAppointment')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('patient.myAppointments')}</h2>
            <Link to="/patient/appointments" className="text-xs text-blue-600 hover:underline">{t('actions.view', { ns: 'common' })}</Link>
          </div>
          {loadA ? <Skeleton /> : upcoming.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-2">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {a.doctor?.profile?.full_name ?? `Dr. #${a.doctor_id}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(a.scheduled_date)} — {formatTime(a.start_time)}
                    </p>
                  </div>
                  <Badge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent prescriptions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('patient.myPrescriptions')}</h2>
            <Link to="/patient/prescriptions" className="text-xs text-blue-600 hover:underline">{t('actions.view', { ns: 'common' })}</Link>
          </div>
          {loadR ? <Skeleton /> : recentRx.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-2">
              {recentRx.map((rx) => (
                <div key={rx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {t('prescriptions.title', { ns: 'dashboard' })} #{rx.id}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.created_at)}</p>
                  </div>
                  <Badge status={rx.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent lab results */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('patient.myLabResults')}</h2>
            <Link to="/patient/lab-results" className="text-xs text-blue-600 hover:underline">{t('actions.view', { ns: 'common' })}</Link>
          </div>
          {loadL ? <Skeleton /> : recentLab.length === 0 ? (
            <Empty />
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {recentLab.map((lr) => (
                <div key={lr.id} className="p-3 rounded-xl border border-gray-100 dark:border-surface-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {lr.lab_request_item?.lab_test?.name ?? `Test #${lr.id}`}
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {lr.value} <span className="text-sm font-normal text-gray-400">{lr.unit}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{t('labResults.referenceRange', { ns: 'dashboard' })}: {lr.reference_range}</p>
                  <Badge status={lr.status} className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse" />
    ))}
  </div>
);

const Empty = () => {
  const { t } = useTranslation('common');
  return <p className="text-sm text-gray-400 py-6 text-center">{t('actions.noData')}</p>;
};

export default PatientDashboard;
