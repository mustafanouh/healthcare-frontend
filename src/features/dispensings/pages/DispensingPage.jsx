import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useDispensings, useCreateDispensing, useUpdateDispensing, useDeleteDispensing } from '../hooks/useDispensings';
import { formatDate } from '../../../shared/utils/formatters';

const DispensingPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useDispensings();
  const createMut = useCreateDispensing();
  const updateMut = useUpdateDispensing();
  const deleteMut = useDeleteDispensing();

  const columns = [
    { key: 'id',                   label: t('common.id',       { ns: 'common' }) },
    { key: 'prescription_item_id', label: 'Prescription Item ID' },
    { key: 'pharmacist',           label: t('nav.pharmacists', { ns: 'common' }), render: (r) => r.pharmacist?.profile?.full_name ?? `#${r.pharmacist_id}` },
    { key: 'quantity_dispensed',   label: t('prescriptions.dispenseQuantity') },
    { key: 'dispensed_at',         label: t('common.date', { ns: 'common' }), render: (r) => formatDate(r.dispensed_at) },
  ];

  const fields = [
    { name: 'prescription_item_id', label: 'Prescription Item ID', type: 'text', dir: 'ltr' },
    { name: 'quantity_dispensed',   label: t('prescriptions.dispenseQuantity'), type: 'number', dir: 'ltr' },
    { name: 'dispensed_at',         label: t('common.date', { ns: 'common' }), type: 'datetime-local', dir: 'ltr' },
  ];

  return (
    <CrudPage
      title={t('nav.dispensing', { ns: 'common' })}
      addLabel={t('pharmacist.dispenseNow')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ prescription_item_id: '', quantity_dispensed: '', dispensed_at: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DispensingPage;
