import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVisits } from '../hooks/useVisits';
import { Badge, Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/formatters';

const ActiveVisitsPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();
    const { data, isLoading, isFetching, refetch } = useVisits({ status: 'in_progress', per_page: 100 });
    const visits = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const activeVisits = visits.filter((visit) => visit.status === 'in_progress');

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('nav.activeVisits', { ns: 'common', defaultValue: 'Active visits' })}</p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{t('visits.activeTitle', { defaultValue: 'Active visits' })}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('visits.activeSubtitle', { defaultValue: 'Continue working on visits currently in progress.' })}</p>
                </div>
                <Button variant="secondary" onClick={() => refetch()} loading={isFetching}>
                    {t('actions.refresh', { ns: 'common', defaultValue: 'Refresh' })}
                </Button>
            </div>

            <Card padded={false} className="overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center px-6 py-16"><Spinner /></div>
                ) : activeVisits.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                            <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2Z" /></svg>
                        </div>
                        <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{t('visits.noActiveVisits', { defaultValue: 'No active visits' })}</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('visits.noActiveVisitsHint', { defaultValue: 'Start a confirmed appointment to see it here.' })}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-surface-800">
                            <thead className="bg-gray-50 dark:bg-surface-800/50">
                                <tr>
                                    {[t('common.id', { ns: 'common' }), t('appointments.patient'), t('visits.visitedAt'), t('common.status', { ns: 'common' }), t('common.actions', { ns: 'common' })].map((heading) => (
                                        <th key={heading} className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                                {activeVisits.map((visit) => (
                                    <tr key={visit.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-surface-800/40">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">#{visit.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{visit.patient?.profile?.full_name ?? `#${visit.patient_id}`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDateTime(visit.visited_at)}</td>
                                        <td className="px-6 py-4"><Badge status={visit.status} /></td>
                                        <td className="px-6 py-4"><Button size="sm" onClick={() => navigate(`/doctor/visits/${visit.id}/active`)}>{t('visits.openActive', { defaultValue: 'Open visit' })}</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ActiveVisitsPage;
