import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useDepartments } from '../hooks/useDepartments';
import { useFacility } from '../hooks/useFacilities';
import { useAssignFacilityDepartment, useFacilityDepartments, useRemoveFacilityDepartment } from '../hooks/useFacilityDepartments';
import { formatDateTime } from '../../../shared/utils/formatters';

const FacilityDepartmentsPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: facilityResponse } = useFacility(id);
    const { data: departmentResponse, isLoading } = useFacilityDepartments(id);
    const { data: allDepartmentsResponse } = useDepartments();
    const assignMutation = useAssignFacilityDepartment(id);
    const removeMutation = useRemoveFacilityDepartment(id);
    const facility = facilityResponse?.data ?? facilityResponse;
    const departments = departmentResponse?.data ?? departmentResponse ?? [];
    const allDepartments = allDepartmentsResponse?.data ?? allDepartmentsResponse ?? [];

    const rows = Array.isArray(departments) ? departments : [];
    const fields = [
        {
            name: 'department_id',
            label: t('facilities.department'),
            type: 'select',
            options: allDepartments.map((department) => ({ value: department.id, label: department.name })),
            createOnly: true,
        },
        { name: 'description', label: t('common.description', { ns: 'common' }), type: 'textarea', rows: 4, fullWidth: true },
        {
            name: 'is_active',
            label: t('common.status', { ns: 'common' }),
            type: 'select',
            options: [{ value: 'true', label: t('status.active', { ns: 'common' }) }, { value: 'false', label: t('status.inactive', { ns: 'common' }) }],
        },
    ];

    const formatPayload = (values) => ({
        department_id: Number(values.department_id),
        description: values.description || '',
        is_active: values.is_active === true || values.is_active === 'true',
    });

    return (
        <CrudPage
            title={facility ? `${t('facilities.departments')} - ${facility.name}` : t('facilities.departments')}
            addLabel={t('facilities.addDepartment')}
            columns={[
                { key: 'id', label: t('common.id', { ns: 'common' }) },
                { key: 'name', label: t('common.name', { ns: 'common' }) },
                { key: 'description', label: t('common.description', { ns: 'common' }) },
                {
                    key: 'is_active',
                    label: t('common.status', { ns: 'common' }),
                    render: (row) => row.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' }),
                },
                {
                    key: 'created_at',
                    label: t('common.createdAt', { ns: 'common' }),
                    render: (row) => formatDateTime(row.created_at),
                },
                {
                    key: 'updated_at',
                    label: t('common.updatedAt', { ns: 'common' }),
                    render: (row) => formatDateTime(row.updated_at),
                },
            ]}
            data={rows}
            isLoading={isLoading}
            fields={fields}
            initialValues={{ department_id: '', description: '', is_active: 'true' }}
            onCreate={(values) => assignMutation.mutateAsync(formatPayload(values))}
            onDelete={(assignmentId) => removeMutation.mutateAsync(assignmentId)}
            isSubmitting={assignMutation.isPending}
            extraActions={<button type="button" onClick={() => navigate('/admin/facilities')} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">{t('actions.back', { ns: 'common' })}</button>}
        />
    );
};

export default FacilityDepartmentsPage;