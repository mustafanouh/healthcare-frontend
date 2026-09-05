import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import { formatTime } from '../../../shared/utils/formatters';
import { useDoctors } from '../../doctor/hooks/useDoctors';
import {
  useDoctorSchedules,
  useCreateDoctorSchedule,
  useUpdateDoctorSchedule,
  useDeleteDoctorSchedule,
} from '../hooks/useDoctorSchedule';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const EMPTY_VALUES = {
  doctor_id: '',
  day_of_week: 'Monday',
  is_off: 'false',
  start_time: '',
  end_time: '',
  avg_consultation_time: 30,
};

const EMPTY_MARK = 'â€”';

const getDoctorName = (doctor) => {
  if (!doctor) return null;
  return doctor.profile?.full_name ?? doctor.profile?.name ?? `Dr #${doctor.id}`;
};

const toTimeInput = (value) => {
  const formatted = formatTime(value);
  return formatted === EMPTY_MARK ? '' : formatted;
};

const formatPayload = (values) => ({
  doctor_id: Number(values.doctor_id),
  day_of_week: values.day_of_week,
  is_off: values.is_off === true || values.is_off === 'true',
  start_time: values.start_time,
  end_time: values.end_time,
  avg_consultation_time: Number(values.avg_consultation_time),
});

const mapRecordToForm = (record) => ({
  doctor_id: record?.doctor_id != null ? String(record.doctor_id) : '',
  day_of_week: record?.day_of_week ?? 'Monday',
  is_off: record?.is_off ? 'true' : 'false',
  start_time: toTimeInput(record?.start_time),
  end_time: toTimeInput(record?.end_time),
  avg_consultation_time: record?.avg_consultation_time ?? 30,
});

const DoctorSchedulePage = () => {
  const { t } = useTranslation(['dashboard', 'common']);

  const { data, isLoading } = useDoctorSchedules();
  const { data: doctorsData } = useDoctors();
  const createMut = useCreateDoctorSchedule();
  const updateMut = useUpdateDoctorSchedule();
  const deleteMut = useDeleteDoctorSchedule();

  const scheduleRows = Array.isArray(data?.data) ? data.data : [];
  const doctorsList = Array.isArray(doctorsData?.data) ? doctorsData.data : [];

  const doctors = useMemo(
    () =>
      doctorsList.map((doctor) => ({
        value: String(doctor.id),
        label: getDoctorName(doctor),
      })),
    [doctorsList],
  );

  const dayOptions = DAYS.map((day) => ({
    value: day,
    label: t(`doctorSchedule.days.${day}`),
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
  
    {
      key: 'day_of_week',
      label: t('doctorSchedule.dayOfWeek'),
      render: (row) => t(`doctorSchedule.days.${row.day_of_week}`, { defaultValue: row.day_of_week }),
    },
    {
      key: 'time',
      label: t('doctorSchedule.workingHours'),
      render: (row) =>
        row.is_off
          ? t('doctorSchedule.offDay')
          : `${formatTime(row.start_time)} - ${formatTime(row.end_time)}`,
    },
    {
      key: 'avg_consultation_time',
      label: t('doctorSchedule.avgConsultationTime'),
      render: (row) => `${row.avg_consultation_time ?? EMPTY_MARK} ${t('doctorSchedule.minutes')}`,
    },
    {
      key: 'is_off',
      label: t('doctorSchedule.availability'),
      render: (row) => (
        <Badge status={row.is_off ? 'inactive' : 'active'}>
          {row.is_off ? t('doctorSchedule.offDay') : t('doctorSchedule.available')}
        </Badge>
      ),
    },
  ];

  const fields = [
    {
      name: 'doctor_id',
      label: t('appointments.doctor'),
      type: 'select',
      options: doctors,
      placeholder: t('doctorSchedule.selectDoctor'),
      fullWidth: true,
    },
    {
      name: 'day_of_week',
      label: t('doctorSchedule.dayOfWeek'),
      type: 'select',
      options: dayOptions,
    },
    {
      name: 'is_off',
      label: t('doctorSchedule.isOff'),
      type: 'select',
      options: [
        { value: 'false', label: t('common.no', { ns: 'common' }) },
        { value: 'true', label: t('common.yes', { ns: 'common' }) },
      ],
    },
    { name: 'start_time', label: t('appointments.startTime'), type: 'time', dir: 'ltr' },
    { name: 'end_time', label: t('appointments.endTime'), type: 'time', dir: 'ltr' },
    {
      name: 'avg_consultation_time',
      label: t('doctorSchedule.avgConsultationTime'),
      type: 'number',
      dir: 'ltr',
    },
  ];

  return (
    <CrudPage
      title={t('doctorSchedule.title')}
      subtitle={t('doctorSchedule.pageSubtitle')}
      addLabel={t('doctorSchedule.newSchedule')}
      columns={columns}
      data={scheduleRows}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      onCreate={(values) => createMut.mutateAsync(formatPayload(values))}
      onUpdate={({ id, payload }) =>
        updateMut.mutateAsync({ id, payload: formatPayload(payload) })
      }
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DoctorSchedulePage;
