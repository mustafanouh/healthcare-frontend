import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFacility, useFacilityStaff } from '../hooks/useFacilities';
import { Card, Spinner, Button } from '../../../shared/components/ui';

const FacilityStaffPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: facilityResponse } = useFacility(id);
    const { data: response, isLoading, isError } = useFacilityStaff(id);
    const facility = facilityResponse?.data ?? facilityResponse;
    const staff = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

    if (isLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-8">
            <button type="button" onClick={() => navigate('/admin/facilities')} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">← {t('actions.back', { ns: 'common' })}</button>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{t('facilities.staff')}</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{facility?.name || t('facilities.staff')}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('facilities.staffSubtitle')}</p>
            </div>
            <Card padded={false} className="overflow-hidden">
                {isError ? <p className="p-6 text-sm text-red-600">{t('errors.generic', { ns: 'common' })}</p> : !staff.length ? <p className="p-16 text-center text-sm text-gray-400">{t('actions.noData', { ns: 'common' })}</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100 bg-gray-50/80 dark:border-surface-800 dark:bg-surface-800/50">
                                <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase text-gray-500">{t('common.id', { ns: 'common' })}</th>
                                <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase text-gray-500">{t('common.name', { ns: 'common' })}</th>
                                <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase text-gray-500">{t('facilities.staffType')}</th>
                                <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase text-gray-500">{t('common.phone', { ns: 'common' })}</th>
                                <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase text-gray-500">{t('facilities.qualification')}</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                                {staff.map((member) => {
                                    const profile = member.profile || member.user?.profile || {};
                                    const type = member.type || member.role || member.user?.roles?.[0] || '—';
                                    return <tr key={`${type}-${member.id}`} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10">
                                        <td className="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">{member.id}</td>
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">{profile.full_name || member.name || member.user?.name || '—'}</td>
                                        <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{type}</span></td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300" dir="ltr">{profile.phone || member.phone || '—'}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{member.qualification || member.degree || member.specialization?.name || '—'}</td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
            <Button variant="secondary" onClick={() => navigate(`/admin/facilities/${id}`)}>{t('facilities.viewDetails')}</Button>
        </div>
    );
};

export default FacilityStaffPage;
