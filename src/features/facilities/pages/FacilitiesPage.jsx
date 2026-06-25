import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility } from '../hooks/useFacilities';

const FacilitiesPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useFacilities();
  const createMut = useCreateFacility();
  const updateMut = useUpdateFacility();
  const deleteMut = useDeleteFacility();

  const columns = [
    { key: 'id',            label: t('common.id',   { ns: 'common' }) },
    { key: 'name',          label: t('common.name', { ns: 'common' }) },
    { key: 'facility_type', label: t('facilities.facilityType') },
    // قراءة الهاتف من الحقل الجديد المرجّع من الباكيند لكي يظهر بالجدول بشكل صحيح
    { key: 'phone_number',   label: t('common.phone',   { ns: 'common' }) }, 
    { key: 'address',       label: t('common.address', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'name',          label: t('common.name', { ns: 'common' }) },
    {
      name: 'facility_type',
      label: t('facilities.facilityType'),
      type: 'select',
      options: ['hospital', 'clinic', 'lab', 'pharmacy'].map((v) => ({ value: v, label: v })),
    },
    // قمنا بتغيير الـ name هنا ليطابق الباكيند مباشرة
    { name: 'phone_number',   label: t('common.phone',   { ns: 'common' }), dir: 'ltr' },
    { name: 'address', label: t('common.address', { ns: 'common' }), fullWidth: true },
  ];

  // دالة لتجهيز البيانات بالشكل المتوقع 100% للباكيند لكسر الـ 422
  const formatPayload = (values) => ({
    parent_id: values.parent_id || null,
    name: values.name,
    facility_type: values.facility_type === 'hosbital' ? 'hospital' : values.facility_type, // حماية ضد الأخطاء الإملائية
    phone_number: values.phone_number,
    address: values.address,
  });

  return (
    <CrudPage
      title={t('facilities.title')}
      addLabel={t('facilities.newFacility')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      // إعطاء قيم أولية متطابقة
      initialValues={{ name: '', facility_type: 'hospital', phone_number: '', address: '', parent_id: null }}
      onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={(v) => updateMut.mutateAsync(formatPayload(v))}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default FacilitiesPage;