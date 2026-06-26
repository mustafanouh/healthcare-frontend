import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import PatientDetailsModal from '../components/PatientDetailsModal';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY_VALUES = {
  user_id: '',
  full_name: '',
  national_number: '',
  phone: '',
  gender: 'male',
  date_of_birth: '',
  address: '',
  blood_type: 'A+',
  height: '',
  weight: '',
  allergies: '',
  chronic_diseases: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
};

const formatCreatePayload = (values) => ({
  user_id: Number(values.user_id),
  full_name: values.full_name,
  national_number: values.national_number,
  phone: values.phone,
  gender: values.gender,
  date_of_birth: values.date_of_birth,
  address: values.address,
  blood_type: values.blood_type,
  height: Number(values.height),
  weight: Number(values.weight),
  allergies: values.allergies,
  chronic_diseases: values.chronic_diseases,
  emergency_contact_name: values.emergency_contact_name,
  emergency_contact_phone: values.emergency_contact_phone,
  emergency_contact_relation: values.emergency_contact_relation,
});

const formatUpdatePayload = (values) => ({
  full_name: values.full_name,
  national_number: values.national_number,
  phone: values.phone,
  gender: values.gender,
  date_of_birth: values.date_of_birth,
  address: values.address,
  blood_type: values.blood_type,
  height: Number(values.height),
  weight: Number(values.weight),
  allergies: values.allergies,
  chronic_diseases: values.chronic_diseases,
  emergency_contact_name: values.emergency_contact_name,
  emergency_contact_phone: values.emergency_contact_phone,
  emergency_contact_relation: values.emergency_contact_relation,
});

const mapRecordToForm = (record) => ({
  user_id: record.profile?.user_id ?? '',
  full_name: record.profile?.full_name ?? '',
  national_number: record.profile?.national_number ?? '',
  phone: record.profile?.phone ?? '',
  gender: record.profile?.gender ?? 'male',
  date_of_birth: record.profile?.date_of_birth ?? '',
  address: record.profile?.address ?? '',
  blood_type: record.blood_type ?? 'A+',
  height: record.height ?? '',
  weight: record.weight ?? '',
  allergies: record.allergies ?? '',
  chronic_diseases: record.chronic_diseases ?? '',
  emergency_contact_name: record.emergency_contact_name ?? '',
  emergency_contact_phone: record.emergency_contact_phone ?? '',
  emergency_contact_relation: record.emergency_contact_relation ?? '',
});

const PatientsPage = () => {
  const { t } = useTranslation(['dashboard', 'common', 'auth']);
  const { data, isLoading } = usePatients();
  const createMut = useCreatePatient();
  const updateMut = useUpdatePatient();
  const deleteMut = useDeletePatient();

  const genderOptions = [
    { value: 'male', label: t('register.male', { ns: 'auth' }) },
    { value: 'female', label: t('register.female', { ns: 'auth' }) },
  ];

  const bloodOptions = BLOOD_TYPES.map((v) => ({ value: v, label: v }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'name',
      label: t('common.name', { ns: 'common' }),
      render: (r) => r.profile?.full_name ?? '—',
    },
    { key: 'blood_type', label: t('patients.bloodType') },
    {
      key: 'phone',
      label: t('common.phone', { ns: 'common' }),
      render: (r) => r.profile?.phone ?? '—',
    },
    {
      key: 'gender',
      label: t('patients.gender'),
      render: (r) => r.profile?.gender ?? '—',
      cellVariant: 'badge',
    },
  ];

  const fields = [
    { name: 'user_id', label: t('patients.userId'), type: 'number', dir: 'ltr', createOnly: true },
    { name: 'full_name', label: t('common.name', { ns: 'common' }) },
    { name: 'national_number', label: t('patients.nationalNumber'), dir: 'ltr' },
    { name: 'phone', label: t('common.phone', { ns: 'common' }), type: 'tel', dir: 'ltr' },
    { name: 'gender', label: t('patients.gender'), type: 'select', options: genderOptions },
    { name: 'date_of_birth', label: t('patients.dateOfBirth'), type: 'date', dir: 'ltr' },
    { name: 'address', label: t('common.address', { ns: 'common' }), fullWidth: true },
    { name: 'blood_type', label: t('patients.bloodType'), type: 'select', options: bloodOptions },
    { name: 'height', label: t('patients.height'), type: 'number', dir: 'ltr' },
    { name: 'weight', label: t('patients.weight'), type: 'number', dir: 'ltr' },
    { name: 'allergies', label: t('patients.allergies'), fullWidth: true },
    { name: 'chronic_diseases', label: t('patients.chronicDiseases'), fullWidth: true },
    { name: 'emergency_contact_name', label: t('patients.emergencyContactName') },
    { name: 'emergency_contact_phone', label: t('patients.emergencyContactPhone'), type: 'tel', dir: 'ltr' },
    { name: 'emergency_contact_relation', label: t('patients.emergencyContactRelation') },
  ];

  return (
    <CrudPage
      title={t('nav.patients', { ns: 'common' })}
      subtitle={t('patients.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <PatientDetailsModal open onClose={onClose} patient={record} />
      )}
      onCreate={(v) => createMut.mutateAsync(formatCreatePayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatUpdatePayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PatientsPage;
