import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, EnhancedDataTable, Badge, Button } from '../../../shared/components/ui';
import { usePharmacistDashboard } from '../hooks/usePharmacists';
import { usePrescriptions } from '../../prescriptions/hooks/usePrescriptions';
import { formatDate } from '../../../shared/utils/formatters';

const PharmacistDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = usePharmacistDashboard();
  const { data: prescriptionsData, isLoading: prescriptionsLoading } = usePrescriptions({
    page: 1,
    per_page: 5,
  });
  const summary = data?.data?.summary ?? data?.summary ?? {};
  const prescriptions = Array.isArray(prescriptionsData?.data)
    ? prescriptionsData.data
    : Array.isArray(prescriptionsData)
      ? prescriptionsData
      : [];

  const prescriptionColumns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'doctor',
      label: t('appointments.doctor'),
      render: (prescription) => prescription.visit?.doctor?.employee?.profile?.full_name
        ?? prescription.visit?.doctor?.profile?.full_name
        ?? `#${prescription.visit?.doctor_id ?? '—'}`,
    },
    {
      key: 'patient',
      label: t('appointments.patient'),
      render: (prescription) => prescription.visit?.patient?.profile?.full_name
        ?? `#${prescription.visit?.patient_id ?? '—'}`,
    },
    {
      key: 'status',
      label: t('common.status', { ns: 'common' }),
      render: (prescription) => <Badge status={prescription.status} />,
    },
    { key: 'notes', label: t('common.notes', { ns: 'common' }) },
    {
      key: 'created_at',
      label: t('common.createdAt', { ns: 'common' }),
      render: (prescription) => formatDate(prescription.created_at),
    },
  ];

  const stats = [
    {
      key: 'pending_prescriptions',
      label: t('pharmacist.pendingPrescriptions'),
      cardClass: 'border-amber-100 dark:border-amber-900/40',
      valueClass: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'partially_dispensed',
      label: t('pharmacist.partiallyDispensed'),
      cardClass: 'border-blue-100 dark:border-blue-900/40',
      valueClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'completed_prescriptions',
      label: t('pharmacist.completedPrescriptions'),
      cardClass: 'border-emerald-100 dark:border-emerald-900/40',
      valueClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'dispensed_today',
      label: t('pharmacist.dispensedToday'),
      cardClass: 'border-violet-100 dark:border-violet-900/40',
      valueClass: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pharmacist.title')}
        subtitle={t('pharmacist.subtitle')}
        action={
          <Link to="/pharmacist/prescriptions">
            <Button>{t('pharmacist.dispenseNow')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ key, label, cardClass, valueClass }) => (
          <Card key={key} className={cardClass}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
              {isLoading ? <span className="inline-block w-10 h-9 bg-gray-100 dark:bg-surface-800 rounded animate-pulse" /> : summary[key] ?? 0}
            </p>
          </Card>
        ))}
      </div>

      <Card padded={false}>
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 dark:border-surface-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('prescriptions.title')}
          </h2>
          <Link to="/pharmacist/prescriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {t('common.prescriptions', { ns: 'common' })}
          </Link>
        </div>

        {prescriptionsLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-12 rounded-lg bg-gray-100 animate-pulse dark:bg-surface-800" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            {t('actions.noData', { ns: 'common' })}
          </p>
        ) : (
          <EnhancedDataTable columns={prescriptionColumns} data={prescriptions} />
        )}
      </Card>
    </div>
  );
};

export default PharmacistDashboard;
