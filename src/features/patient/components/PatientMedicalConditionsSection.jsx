import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/ui';
import ResourceFormModal from '../../../shared/components/crud/ResourceFormModal';
import { formatDate } from '../../../shared/utils/formatters';
import { useMedicalConditions } from '../../medical-conditions/hooks/useMedicalConditions';
import {
    usePatientMedicalConditions,
    useCreatePatientMedicalCondition,
    useUpdatePatientMedicalCondition,
    useDeletePatientMedicalCondition,
} from '../hooks/usePatientMedicalConditions';

const PatientMedicalConditionsSection = ({ patient, compact = false }) => {
    const { t, i18n } = useTranslation(['dashboard', 'common']);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCondition, setEditingCondition] = useState(null);
    const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const { data: conditionResponse, isLoading } = usePatientMedicalConditions(patient?.id, { enabled: Boolean(patient) });
    const { data: availableResponse } = useMedicalConditions({}, { enabled: Boolean(patient) });
    const createMutation = useCreatePatientMedicalCondition();
    const updateMutation = useUpdatePatientMedicalCondition();
    const deleteMutation = useDeletePatientMedicalCondition();
    const conditions = conditionResponse?.data ?? [];
    const availableConditions = availableResponse?.data ?? [];

    const fields = [
        {
            name: 'medical_condition_id',
            label: t('patients.condition'),
            type: 'select',
            options: availableConditions.map((condition) => ({ value: condition.id, label: condition.name })),
        },
        { name: 'diagnosed_at', label: t('patients.diagnosedAt'), type: 'date', dir: 'ltr' },
        { name: 'notes', label: t('medicalConditions.notes', { ns: 'dashboard' }), fullWidth: true },
    ];

    const save = async (values) => {
        const payload = {
            patient_id: patient.id,
            medical_condition_id: Number(values.medical_condition_id),
            notes: values.notes || null,
            diagnosed_at: values.diagnosed_at,
        };
        if (editingCondition) {
            await updateMutation.mutateAsync({ id: editingCondition.id, payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        setFormOpen(false);
        setEditingCondition(null);
    };

    const openForm = (condition = null) => {
        setEditingCondition(condition);
        setFormOpen(true);
    };

    return (
        <section className={compact ? '' : 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900'}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('patients.sections.conditions')}</h2>
                    {!compact && <p className="mt-1 text-xs text-gray-400">{t('patients.conditionsSubtitle')}</p>}
                </div>
                <Button size="sm" onClick={() => openForm()}>+ {t('actions.add', { ns: 'common' })}</Button>
            </div>
            {isLoading ? (
                <p className="py-4 text-sm text-gray-400">{t('actions.loading', { ns: 'common' })}</p>
            ) : conditions.length === 0 ? (
                <p className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-400 dark:bg-surface-800">{t('actions.noData', { ns: 'common' })}</p>
            ) : (
                <div className="space-y-2">
                    {conditions.map((condition) => (
                        <div key={condition.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 p-3 dark:border-surface-800">
                            <div className="min-w-0">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{condition.medical_condition?.name || `#${condition.medical_condition_id}`}</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {condition.medical_condition?.type ? t(`medicalConditions.${condition.medical_condition.type}`, { ns: 'dashboard', defaultValue: condition.medical_condition.type }) : ''}
                                    {condition.diagnosed_at ? ` · ${formatDate(condition.diagnosed_at, locale)}` : ''}
                                </p>
                                {condition.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{condition.notes}</p>}
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <Button size="sm" variant="ghost" onClick={() => openForm(condition)}>{t('actions.edit', { ns: 'common' })}</Button>
                                <Button size="sm" variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(condition.id)}>{t('actions.delete', { ns: 'common' })}</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ResourceFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingCondition(null); }}
                title={editingCondition ? t('actions.edit', { ns: 'common' }) : t('patients.addCondition')}
                fields={fields}
                initialValues={{ medical_condition_id: '', diagnosed_at: '', notes: '' }}
                record={editingCondition ? { medical_condition_id: editingCondition.medical_condition_id, diagnosed_at: editingCondition.diagnosed_at?.slice(0, 10) || '', notes: editingCondition.notes || '' } : null}
                onSubmit={save}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </section>
    );
};

export default PatientMedicalConditionsSection;
