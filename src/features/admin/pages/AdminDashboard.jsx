import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Card, Badge } from '../../../shared/components/ui';
import StatCard from '../../../shared/components/ui/StatCard';
import { usePatients } from '../../patient/hooks/usePatients';
import { useDoctors } from '../../doctor/hooks/useDoctors';
import { useFacilities } from '../../facilities/hooks/useFacilities';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate, formatTime } from '../../../shared/utils/formatters';

const ICONS = {
  patients:  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  doctors:   'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z',
  facilities:'M3 21h18M5 21V7l8-4v18M19 21V10l-6-3',
  calendar:  'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
};

const QUICK_LINKS = [
  { to: '/admin/appointments', labelKey: 'nav.appointments', color: 'bg-blue-500' },
  { to: '/admin/patients', labelKey: 'nav.patients', color: 'bg-emerald-500' },
  { to: '/admin/doctors', labelKey: 'nav.doctors', color: 'bg-purple-500' },
  { to: '/admin/facilities', labelKey: 'nav.facilities', color: 'bg-amber-500' },
];

const AdminDashboard = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { fullName } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const locale = i18n.language === 'ar' ? 'ar' : 'en';

  const { data: patients,     isLoading: loadP } = usePatients();
  const { data: doctors,      isLoading: loadD } = useDoctors();
  const { data: facilities,   isLoading: loadF } = useFacilities();
  const { data: appointments, isLoading: loadA } = useAppointments({ scheduled_date: today });

  const stats = [
    { key: 'patients',   title: t('admin.stats.patients'),          value: patients?.total ?? patients?.data?.length,   color: 'blue',   icon: ICONS.patients,   loading: loadP },
    { key: 'doctors',    title: t('admin.stats.doctors'),           value: doctors?.total  ?? doctors?.data?.length,    color: 'green',  icon: ICONS.doctors,    loading: loadD },
    { key: 'facilities', title: t('admin.stats.facilities'),        value: facilities?.total ?? facilities?.data?.length, color: 'purple', icon: ICONS.facilities, loading: loadF },
    { key: 'appts',      title: t('admin.stats.appointmentsToday'), value: appointments?.total ?? appointments?.data?.length, color: 'amber',  icon: ICONS.calendar,   loading: loadA },
  ];

  const recentAppointments = appointments?.data?.slice(0, 10) ?? [];
  const todayLabel = formatDate(today, locale);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-8 text-white shadow-lg">
        <div className="absolute -top-10 -end-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 start-1/3 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">{todayLabel}</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">
            {t('admin.welcome', { name: fullName || t('layout.guest', { ns: 'common' }) })}
          </h1>
          <p className="text-blue-100/90 mt-2 max-w-xl text-sm lg:text-base">
            {t('admin.subtitle')}
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.key} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Appointments table */}
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-surface-800">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {t('admin.recentAppointments')}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{t('admin.appointmentsTodayHint')}</p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('admin.viewAll')}
            </Link>
          </div>

          {loadA ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-surface-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-surface-800 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">{t('actions.noData', { ns: 'common' })}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-surface-800/50 text-gray-500 dark:text-gray-400">
                    <th className="px-6 py-3 text-start font-medium">{t('appointments.patient')}</th>
                    <th className="px-6 py-3 text-start font-medium hidden sm:table-cell">{t('appointments.doctor')}</th>
                    <th className="px-6 py-3 text-start font-medium">{t('common.time', { ns: 'common' })}</th>
                    <th className="px-6 py-3 text-start font-medium">{t('common.status', { ns: 'common' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-surface-800">
                  {recentAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50/50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {appt.patient?.profile?.full_name ?? `#${appt.patient_id}`}
                        </p>
                        <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                          {appt.doctor?.profile?.full_name ?? `Dr. #${appt.doctor_id}`}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        {appt.doctor?.profile?.full_name ?? `Dr. #${appt.doctor_id}`}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <p className="text-gray-700 dark:text-gray-300">{formatTime(appt.start_time)}</p>
                        <p className="text-xs text-gray-400">{formatDate(appt.scheduled_date, locale)}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge status={appt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick links */}
        <Card>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {t('admin.quickLinks')}
          </h2>
          <p className="text-xs text-gray-400 mb-4">{t('admin.quickLinksHint')}</p>
          <div className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-surface-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
              >
                <span className={clsx('w-2 h-8 rounded-full flex-shrink-0', link.color)} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  {t(link.labelKey, { ns: 'common' })}
                </span>
                <svg className="w-4 h-4 ms-auto text-gray-300 group-hover:text-blue-500 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
