import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, Button, Spinner, Input } from '../../../shared/components/ui';
import { usePrescriptionItems } from '../hooks/usePrescriptions';
import { useCreateDispensing } from '../../dispensings/hooks/useDispensings';
import { usePharmacists } from '../../pharmacist/hooks/usePharmacists';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';
import { useAuth } from '../../../core/hooks/useAuth';
import { parseApiError } from '../../../shared/utils/parseApiError';

const getDispensedAt = () => {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const DetailRow = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400 dark:text-gray-500">{label}</dt>
        <dd className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>{value || '—'}</dd>
    </div>
);

const PrescriptionDetailsModal = ({ open, prescription, onClose, canDispense = false }) => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const createDispensing = useCreateDispensing();
    const { data: pharmacistsResponse } = usePharmacists({}, { enabled: open && canDispense });
    const [quantities, setQuantities] = useState({});
    const [dispensingItemId, setDispensingItemId] = useState(null);
    const [dispensingError, setDispensingError] = useState(null);
    const { data: response, isLoading, isError } = usePrescriptionItems(prescription?.id, { enabled: open });
    if (!prescription) return null;
    const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    const pharmacists = Array.isArray(pharmacistsResponse?.data) ? pharmacistsResponse.data : Array.isArray(pharmacistsResponse) ? pharmacistsResponse : [];
    const currentPharmacist = pharmacists.find((pharmacist) =>
        pharmacist.user_id === user?.id || pharmacist.profile_id === user?.id || pharmacist.profile?.user_id === user?.id
    );
    const pharmacistId = user?.pharmacist_id ?? user?.pharmacist?.id ?? currentPharmacist?.id;
    const patientName = prescription.visit?.patient?.profile?.full_name;

    const handleDispense = async (item) => {
        if (!canDispense) return;
        const quantity = Number(quantities[item.id] ?? item.quantity_prescribed);
        if (!pharmacistId || !quantity || quantity < 1) {
            setDispensingError(t('prescriptions.dispensingMissingPharmacist'));
            return;
        }

        setDispensingItemId(item.id);
        setDispensingError(null);
        try {
            await createDispensing.mutateAsync({
                prescription_item_id: Number(item.id),
                pharmacist_id: Number(pharmacistId),
                quantity_dispensed: quantity,
                dispensed_at: getDispensedAt(),
            });
            await queryClient.invalidateQueries({ queryKey: ['prescriptions', 'items', prescription.id] });
        } catch (error) {
            setDispensingError(parseApiError(error, t('errors.generic', { ns: 'common' })));
        } finally {
            setDispensingItemId(null);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title={t('prescriptions.detailsTitle', { id: prescription.id })} size="xl">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <DetailRow label={t('prescriptions.visitId')} value={prescription.visit_id} dir="ltr" />
                    <DetailRow label={t('prescriptions.patient')} value={patientName} />
                    <DetailRow label={t('common.status', { ns: 'common' })} value={prescription.status ? t(`status.${prescription.status}`, { ns: 'common', defaultValue: prescription.status }) : null} />
                </div>
                {prescription.notes && <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100"><p className="text-xs font-medium text-blue-600 dark:text-blue-300">{t('common.notes', { ns: 'common' })}</p><p className="mt-1">{prescription.notes}</p></div>}
                <section className={canDispense ? '' : 'prescription-read-only'}>
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('prescriptions.items')}</h3>{isLoading && <Spinner size="sm" />}</div>
                    {isError ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">{t('errors.generic', { ns: 'common' })}</p> : !isLoading && !items.length ? <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-400 dark:bg-surface-800">{t('actions.noData', { ns: 'common' })}</p> : <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-surface-800"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-start dark:bg-surface-800"><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('prescriptions.medicationName')}</th><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('prescriptions.dosage')}</th><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('prescriptions.quantity')}</th><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('prescriptions.frequency')}</th><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('prescriptions.duration')}</th><th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('pharmacist.dispenseNow')}</th></tr></thead><tbody className="divide-y divide-gray-100 dark:divide-surface-800">{items.map((item) => <tr key={item.id}><td className="px-4 py-3.5 font-medium text-gray-800 dark:text-gray-200">{item.medication_name || '—'}</td><td className="px-4 py-3.5">{item.dosage || '—'}</td><td className="px-4 py-3.5" dir="ltr">{item.quantity_prescribed || '—'}</td><td className="px-4 py-3.5">{item.frequency || '—'}</td><td className="px-4 py-3.5" dir="ltr">{item.duration || '—'}</td><td className="px-4 py-3.5"><div className="flex min-w-[180px] items-end gap-2"><Input aria-label={t('prescriptions.dispenseQuantity')} type="number" min="1" max={item.quantity_prescribed || undefined} dir="ltr" value={quantities[item.id] ?? item.quantity_prescribed ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [item.id]: event.target.value }))} className="min-w-0" /><Button size="sm" variant="success" loading={dispensingItemId === item.id} onClick={() => handleDispense(item)}>{t('pharmacist.dispenseNow')}</Button></div></td></tr>)}</tbody></table></div>}
                    {dispensingError && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">{dispensingError}</p>}
                </section>
                <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-400 dark:border-surface-800 sm:grid-cols-2"><span>{t('common.createdAt', { ns: 'common' })}: {formatDateTime(prescription.created_at)}</span><span>{t('common.updatedAt', { ns: 'common' })}: {formatDateTime(prescription.updated_at)}</span></div>
                <div className="flex justify-end"><Button variant="secondary" onClick={onClose}>{t('actions.close', { ns: 'common' })}</Button></div>
            </div>
        </Modal>
    );
};

export default PrescriptionDetailsModal;
