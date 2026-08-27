import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useMedicalConditions, useCreateMedicalCondition, useUpdateMedicalCondition, useDeleteMedicalCondition } from '../hooks/useMedicalConditions';

const MedicalConditionsPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { data, isLoading } = useMedicalConditions();
    const createMutation = useCreateMedicalCondition();
    const updateMutation = useUpdateMedicalCondition();
    const deleteMutation = useDeleteMedicalCondition();

    const typeLabel = (type) => type ? t(`medicalConditions.${type}`, { defaultValue: type }) : '—';
    const columns = [
        { key: 'id', label: t('common.id', { ns: 'common' }) },
        { key: 'name', label: t('common.name', { ns: 'common' }) },
        {
            key: 'type',
            label: t('medicalConditions.type'),
            render: (condition) => (
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${condition.type === 'allergy'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                    {typeLabel(condition.type)}
                </span>
            ),
        },
        { key: 'notes', label: t('medicalConditions.notes'), render: (condition) => condition.notes || '—' },
    ];

    const fields = [
        { name: 'name', label: t('common.name', { ns: 'common' }) },
        {
            name: 'type',
            label: t('medicalConditions.type'),
            type: 'select',
            options: [
                { value: 'chronic', label: t('medicalConditions.chronic') },
                { value: 'allergy', label: t('medicalConditions.allergy') },
            ],
        },
        { name: 'notes', label: t('medicalConditions.notes'), fullWidth: true },
    ];

    return (
        <CrudPage
            title={t('nav.medicalConditions', { ns: 'common' })}
            subtitle={t('medicalConditions.pageSubtitle')}
            addLabel={t('actions.add', { ns: 'common' })}
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            fields={fields}
            initialValues={{ name: '', type: 'chronic', notes: '' }}
            onCreate={(values) => createMutation.mutateAsync(values)}
            onUpdate={({ id, payload }) => updateMutation.mutateAsync({ id, payload })}
            onDelete={(id) => deleteMutation.mutateAsync(id)}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
    );
};

export default MedicalConditionsPage;
