import { useTranslation } from 'react-i18next';
import Spinner from '../../../shared/components/ui/Spinner';
import TableActionButton from '../../../shared/components/ui/TableActionButton';
import { getInitials } from '../../../shared/utils/formatters';
import { getDoctorPlacement } from '../utils/doctorHelpers';

const DoctorsTable = ({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  viewLabel,
}) => {
  const { t } = useTranslation(['dashboard', 'common']);

  if (isLoading) {
    return (
      <div className="py-20">
        <Spinner fullScreen={false} className="mx-auto" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="py-20 flex flex-col items-center text-center text-gray-400 dark:text-gray-500">
        <div className="w-14 h-14 mb-4 rounded-2xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center">
          <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm">{t('actions.noData', { ns: 'common' })}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-surface-800/50 border-b border-gray-100 dark:border-surface-800">
            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-16">
              {t('common.id', { ns: 'common' })}
            </th>
            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('common.name', { ns: 'common' })}
            </th>
            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('nav.specializations', { ns: 'common' })}
            </th>
            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-36">
              {t('doctors.yearsOfExperience')}
            </th>
            <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-48">
              {t('common.actions', { ns: 'common' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
          {data.map((doctor) => {
            const name = doctor.profile?.full_name ?? `#${doctor.id}`;
            const specialization = getDoctorPlacement(doctor)?.specialization?.name;
            const years = doctor.years_of_experience;

            return (
              <tr
                key={doctor.id}
                className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-md bg-gray-100 dark:bg-surface-800 text-xs font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
                    {doctor.id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 min-w-[12rem]">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {getInitials(name)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[14rem]">
                      {name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {specialization ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {specialization}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  {years != null && years !== '' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300 tabular-nums">
                      {years}
                      <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal">
                        {t('doctors.yearsShort')}
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                    {onView && (
                      <TableActionButton
                        variant="neutral"
                        label={viewLabel ?? t('actions.viewMore', { ns: 'common' })}
                        onClick={() => onView(doctor)}
                      />
                    )}
                    {onEdit && (
                      <TableActionButton
                        variant="primary"
                        label={t('actions.edit', { ns: 'common' })}
                        onClick={() => onEdit(doctor)}
                      />
                    )}
                    {onDelete && (
                      <TableActionButton
                        variant="danger"
                        label={t('actions.delete', { ns: 'common' })}
                        onClick={() => onDelete(doctor)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
