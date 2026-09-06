import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge, TableActionButton } from '../../../shared/components/ui';
import { useLabRequestItems, useCreateLabRequestItem, useUpdateLabRequestItem, useDeleteLabRequestItem } from '../../lab-results/hooks/useLabRequestItems';
import { useCreateLabResult } from '../../lab-results/hooks/useLabResults';
import { useLabTests } from '../../lab-tests/hooks/useLabTests';
import AddLabResultModal from '../components/AddLabResultModal';
import { formatDate } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';
import { useRole } from '../../../core/hooks/useRole';

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];
const PER_PAGE = 10;

const LabRequestsPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { isDoctor, isLabStaff, isAdmin } = useRole();
    const canManageRequests = isDoctor || isAdmin;
    const canStartAnalysis = isLabStaff || isAdmin;
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [startError, setStartError] = useState('');
    const [resultRequest, setResultRequest] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const params = { page, per_page: PER_PAGE, ...(search && { search }), ...(status && { status }) };
    const { data, isLoading, isFetching } = useLabRequestItems(params);
    const { data: labTestsData } = useLabTests();
    const createMut = useCreateLabRequestItem();
    const updateMut = useUpdateLabRequestItem();
    const deleteMut = useDeleteLabRequestItem();
    const startMut = useUpdateLabRequestItem();
    const createResultMut = useCreateLabResult({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lab-request-items', 'list'] });
        },
    });

    const labTests = Array.isArray(labTestsData?.data) ? labTestsData.data : Array.isArray(labTestsData) ? labTestsData : [];
    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const meta = data?.meta ?? data ?? {};
    const totalItems = Number(meta.total ?? rows.length);
    const hasServerPagination = meta.last_page != null || meta.next_page_url != null || meta.total != null;
    const totalPages = Number(meta.last_page ?? Math.max(1, Math.ceil(totalItems / PER_PAGE)));
    const currentPage = Number(meta.current_page ?? page);
    const hasNextPage = hasServerPagination
        ? currentPage < totalPages
        : (page === 1 || rows.length > 0);
    const labTestOptions = labTests.map((test) => ({ value: String(test.id), label: test.name }));

    const normalizePayload = (values) => ({ ...values, lab_test_id: Number(values.lab_test_id) });
    const startAnalysis = async (request) => {
        setStartError('');
        try {
            await startMut.mutateAsync({ id: request.id, payload: { status: 'processing' } });
        } catch (error) {
            setStartError(parseApiError(error, t('errors.generic', { ns: 'common' })));
        }
    };

    const columns = [
        { key: 'id', label: t('common.id', { ns: 'common' }) },
        { key: 'lab_test', label: t('labResults.test'), render: (request) => request.lab_test?.name ?? `#${request.lab_test_id}` },
        { key: 'requested_at', label: t('labResults.requestedAt'), render: (request) => formatDate(request.requested_at) },
        { key: 'status', label: t('common.status', { ns: 'common' }), render: (request) => <Badge status={request.status} /> },
        { key: 'notes', label: t('common.notes', { ns: 'common' }), render: (request) => request.notes || '—' },
    ];
    const fields = [
        { name: 'lab_test_id', label: t('labResults.test'), type: 'select', options: labTestOptions, placeholder: t('labRequests.selectTest'), fullWidth: true },
        { name: 'requested_at', label: t('labResults.requestedAt'), type: 'datetime-local', dir: 'ltr' },
        { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
    ];
    const toolbar = (
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
            <label className="text-sm text-gray-600 dark:text-gray-300"><span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('labRequests.searchPlaceholder')} className="h-10 w-56 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200" /></label>
            <label className="text-sm text-gray-600 dark:text-gray-300"><span className="mb-1.5 block font-medium">{t('common.status', { ns: 'common' })}</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-10 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"><option value="">{t('common.all', { ns: 'common' })}</option>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{t(`status.${option}`, { ns: 'common' })}</option>)}</select></label>
            {(searchInput || status) && <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setStatus(''); setPage(1); }} className="h-10 px-3 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">{t('common.clear', { ns: 'common' })}</button>}
        </div>
    );
    const pagination = <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm dark:border-surface-800"><span className="text-gray-500 dark:text-gray-400">{t('labRequests.page', { current: currentPage, total: totalItems })}</span><div className="flex gap-2"><button type="button" disabled={isFetching || currentPage <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{t('actions.previous', { ns: 'common' })}</button><button type="button" disabled={isFetching || !hasNextPage} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{isFetching ? t('actions.loading', { ns: 'common' }) : t('actions.next', { ns: 'common' })}</button></div></div>;

    return (
        <>
            <CrudPage title={t('nav.labRequests', { ns: 'common' })} columns={columns} data={rows} isLoading={isLoading} fields={canManageRequests ? fields : []} initialValues={{ lab_test_id: '', requested_at: '', notes: '' }} onCreate={canManageRequests ? (values) => createMut.mutateAsync(normalizePayload(values)) : undefined} onUpdate={canManageRequests ? ({ id, payload }) => updateMut.mutateAsync({ id, payload: normalizePayload(payload) }) : undefined} onDelete={canManageRequests ? (id) => deleteMut.mutateAsync(id) : undefined} isSubmitting={canManageRequests && (createMut.isPending || updateMut.isPending)} tableToolbar={toolbar} tableFooter={pagination} renderRowActions={canStartAnalysis ? (request) => (
                <>
                    {request.status === 'pending' && <TableActionButton variant="primary" label={t('labRequests.start')} onClick={() => startAnalysis(request)} />}
                    {request.status === 'processing' && <TableActionButton variant="primary" label={t('labResults.addForRequest')} onClick={() => setResultRequest(request)} />}
                </>
            ) : undefined} />
            <AddLabResultModal open={Boolean(resultRequest)} requestItem={resultRequest} onClose={() => setResultRequest(null)} onSubmit={(payload) => createResultMut.mutateAsync(payload)} isSubmitting={createResultMut.isPending} />
        </>
    );
};

export default LabRequestsPage;