// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { PageHeader, Card, Badge, Button } from '../../../shared/components/ui';
// import { useAppointments } from '../../appointments/hooks/useAppointments';
// import { useAuth } from '../../../core/hooks/useAuth';
// import { formatDate, formatTime } from '../../../shared/utils/formatters';

// const DoctorDashboard = () => {
//   const { t } = useTranslation(['dashboard', 'common']);
//   const { user } = useAuth();
//   const today = new Date().toISOString().split('T')[0];

//   const { data: todayAppts, isLoading } = useAppointments({
//     doctor_id: user?.doctor?.id,
//     scheduled_date: today,
//   });

//   const appointments = todayAppts?.data ?? [];
//   const pending   = appointments.filter((a) => a.status === 'pending').length;
//   const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
//   const completed = appointments.filter((a) => a.status === 'completed').length;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title={t('doctor.title')}
//         subtitle={t('doctor.subtitle')}
//         action={
//           <Link to="/doctor/appointments">
//             <Button>{t('doctor.todayAppointments')}</Button>
//           </Link>
//         }
//       />

//       {/* Mini stats */}
//       <div className="grid grid-cols-3 gap-4">
//         {[
//           { label: t('status.pending',   { ns: 'common' }), value: pending,   color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
//           { label: t('status.confirmed', { ns: 'common' }), value: confirmed, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
//           { label: t('status.completed', { ns: 'common' }), value: completed, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
//         ].map((s) => (
//           <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
//             <p className="text-2xl font-bold">{s.value}</p>
//             <p className="text-xs mt-1">{s.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Today's appointments */}
//       <Card>
//         <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
//           {t('doctor.todayAppointments')} — {formatDate(today)}
//         </h2>

//         {isLoading ? (
//           <div className="space-y-3">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="h-14 bg-gray-100 dark:bg-surface-800 rounded-lg animate-pulse" />
//             ))}
//           </div>
//         ) : appointments.length === 0 ? (
//           <p className="text-sm text-gray-400 py-8 text-center">{t('actions.noData', { ns: 'common' })}</p>
//         ) : (
//           <div className="space-y-2">
//             {appointments.map((appt) => (
//               <div key={appt.id}
//                 className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
//                 <div className="flex items-center gap-3">
//                   {/* Time block */}
//                   <div className="text-center w-14">
//                     <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
//                       {formatTime(appt.start_time)}
//                     </p>
//                     <p className="text-xs text-gray-400">{formatTime(appt.end_time)}</p>
//                   </div>
//                   {/* Patient info */}
//                   <div>
//                     <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                       {appt.patient?.profile?.full_name ?? `Patient #${appt.patient_id}`}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       {appt.patient?.profile?.phone ?? ''}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Badge status={appt.status} />
//                   {appt.status === 'confirmed' && (
//                     <Link to={`/doctor/visits?appointment_id=${appt.id}`}>
//                       <Button size="sm">{t('doctor.startVisit')}</Button>
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default DoctorDashboard;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Badge, Button, Modal } from '../../../shared/components/ui';
import {
  useAppointments,
  useChangeAppointmentStatus,
  useStartVisitFromAppointment,
} from '../../appointments/hooks/useAppointments';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatTime } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';

const DoctorDashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const statusMut = useChangeAppointmentStatus();
  const startVisitMut = useStartVisitFromAppointment();
  const [appointmentToStart, setAppointmentToStart] = useState(null);
  const [startVisitError, setStartVisitError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const { data: todayAppts, isLoading } = useAppointments({
    doctor_id: user?.doctor?.id,
    scheduled_date: today,
  });

  const appointments = todayAppts?.data ?? [];
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;

  const closeStartVisitModal = () => {
    if (!startVisitMut.isPending) {
      setAppointmentToStart(null);
      setStartVisitError('');
      startVisitMut.reset();
    }
  };

  const handleStartVisit = async () => {
    if (!appointmentToStart) return;

    setStartVisitError('');
    try {
      await startVisitMut.mutateAsync(appointmentToStart.id);
      navigate(`/doctor/visits?appointment_id=${appointmentToStart.id}`);
    } catch (error) {
      setStartVisitError(
        parseApiError(error, t('common.requestError', { defaultValue: 'Could not start the visit.' }))
      );
    }
  };

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

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('status.pending', { ns: 'common' }), value: pending, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
          { label: t('status.confirmed', { ns: 'common' }), value: confirmed, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: t('status.completed', { ns: 'common' }), value: completed, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('doctor.appointments')}
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
              <div key={appt.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-center w-14">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatTime(appt.start_time)}</p>
                    <p className="text-xs text-gray-400">{formatTime(appt.end_time)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {appt.patient?.profile?.full_name ?? `Patient #${appt.patient_id}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{appt.patient?.profile?.phone ?? ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={appt.status} />
                  {appt.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => statusMut.mutate({ id: appt.id, status: 'confirmed' })}
                        loading={
                          statusMut.isPending &&
                          statusMut.variables?.id === appt.id &&
                          statusMut.variables?.status === 'confirmed'
                        }
                      >
                        {t('common.confirm', { defaultValue: 'Confirm' })}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => statusMut.mutate({ id: appt.id, status: 'cancelled' })}
                        loading={
                          statusMut.isPending &&
                          statusMut.variables?.id === appt.id &&
                          statusMut.variables?.status === 'cancelled'
                        }
                      >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                      </Button>
                    </div>
                  )}
                  {appt.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setStartVisitError('');
                        setAppointmentToStart(appt);
                      }}
                    >
                      {t('doctor.startVisit')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(appointmentToStart)}
        onClose={closeStartVisitModal}
        title={t('doctor.startVisitConfirmTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('doctor.startVisitConfirmMessage')}
        </p>
        {(startVisitError || startVisitMut.isError) && (
          <p className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {startVisitError || parseApiError(startVisitMut.error, t('common.requestError', { defaultValue: 'Could not start the visit.' }))}
          </p>
        )}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="secondary" onClick={closeStartVisitModal} disabled={startVisitMut.isPending}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button type="button" onClick={handleStartVisit} loading={startVisitMut.isPending}>
            {t('common.confirm', { defaultValue: 'Confirm' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default DoctorDashboard;




