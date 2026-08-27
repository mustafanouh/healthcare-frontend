import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Spinner from '../../../shared/components/ui/Spinner';
import TableActionButton from '../../../shared/components/ui/TableActionButton';

const FacilitiesTable = ({ data = [], isLoading = false, onEdit, onDelete, onView, onViewStaff, viewLabel, staffLabel, onViewDepartments, departmentsLabel }) => {
    const { t } = useTranslation(['dashboard', 'common']);
    const [openMenuId, setOpenMenuId] = useState(null);

    if (isLoading) return <div className="py-20"><Spinner fullScreen={false} className="mx-auto" /></div>;
    if (!data.length) return <div className="py-20 text-center text-sm text-gray-400">{t('actions.noData', { ns: 'common' })}</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-surface-800 dark:bg-surface-800/50">
                        <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">{t('common.id', { ns: 'common' })}</th>
                        <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">{t('common.name', { ns: 'common' })}</th>
                        <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">{t('facilities.facilityType')}</th>
                        <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">{t('common.phone', { ns: 'common' })}</th>
                        <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">{t('common.address', { ns: 'common' })}</th>
                        <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-gray-500">{t('common.actions', { ns: 'common' })}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                    {data.map((facility) => (
                        <tr key={facility.id} className="group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/10">
                            <td className="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">{facility.id}</td>
                            <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">{facility.name || '—'}</td>
                            <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{facility.facility_type || '—'}</span></td>
                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300" dir="ltr">{facility.phone_number || '—'}</td>
                            <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-300">{facility.address || '—'}</td>
                            <td className="px-5 py-4 text-end">
                                <div className="relative inline-block text-start">
                                    <button
                                        type="button"
                                        aria-label={t('actions.more', { ns: 'common' })}
                                        aria-expanded={openMenuId === facility.id}
                                        onClick={() => setOpenMenuId(openMenuId === facility.id ? null : facility.id)}
                                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-surface-800 dark:hover:text-white"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" /></svg>
                                    </button>
                                    {openMenuId === facility.id && (
                                        <div className="absolute end-0 top-full z-20 mt-1 min-w-44 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-surface-700 dark:bg-surface-900">
                                            {onView && <TableActionButton label={viewLabel} onClick={() => { setOpenMenuId(null); onView(facility); }} />}
                                            {onEdit && <TableActionButton variant="primary" label={t('actions.edit', { ns: 'common' })} onClick={() => { setOpenMenuId(null); onEdit(facility); }} />}
                                            {onViewStaff && <TableActionButton variant="primary" label={staffLabel} onClick={() => { setOpenMenuId(null); onViewStaff(facility); }} />}
                                            {onViewDepartments && <TableActionButton variant="primary" label={departmentsLabel} onClick={() => { setOpenMenuId(null); onViewDepartments(facility); }} />}
                                            {onDelete && <TableActionButton variant="danger" label={t('actions.delete', { ns: 'common' })} onClick={() => { setOpenMenuId(null); onDelete(facility); }} />}
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacilitiesTable;
