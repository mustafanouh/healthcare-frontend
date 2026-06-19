import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate, formatTime } from '../../../shared/utils/formatters';

const DoctorDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const { data: todayAppts, isLoading } = useAppointments({
    doctor_id: user?.doctor?.id,
    scheduled_date: today,
  });

  const appointments = todayAppts?.data ?? [];
  const pending   = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('doctor.title')}
        subtitle={t('doctor.subtitle')}
        action={
          <Link to="/doctor/appointments">
            <Button>{t('doctor.todayAppointments')}</Button>
          </Link>
        }
      />

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('status.pending',   { ns: 'common' }), value: pending,   color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
          { label: t('status.confirmed', { ns: 'common' }), value: confirmed, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: t('status.completed', { ns: 'common' }), value: completed, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('doctor.todayAppointments')} — {formatDate(today)}
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">{t('actions.noData', { ns: 'common' })}</p>
        ) : (
          <div className="space-y-2">
            {appointments.map((appt) => (
              <div key={appt.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Time block */}
                  <div className="text-center w-14">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formatTime(appt.start_time)}
                    </p>
                    <p className="text-xs text-gray-400">{formatTime(appt.end_time)}</p>
                  </div>
                  {/* Patient info */}
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {appt.patient?.profile?.full_name ?? `Patient #${appt.patient_id}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {appt.patient?.profile?.phone ?? ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge status={appt.status} />
                  {appt.status === 'confirmed' && (
                    <Link to={`/doctor/visits?appointment_id=${appt.id}`}>
                      <Button size="sm">{t('doctor.startVisit')}</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorDashboard;
