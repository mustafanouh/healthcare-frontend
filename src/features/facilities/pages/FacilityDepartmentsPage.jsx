import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useDepartments } from '../hooks/useDepartments';
import { useFacility } from '../hooks/useFacilities';
import { useAssignFacilityDepartment, useFacilityDepartments, useRemoveFacilityDepartment } from '../hooks/useFacilityDepartments';
import { formatDateTime } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui';

const FacilityDepartmentsPage = () => {
    const { t } = useTranslation('common');
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

    const departmentOptions = allDepartments.map((department) => ({
        value: department.id,
        label: department.name,
    }));

    const fields = [
        {
            name: 'department_id',
            label: t('common.name'),
            type: 'select',
            options: departmentOptions,
            createOnly: true,
        },
        {
            name: 'description',
            label: t('common.description'),
            type: 'textarea',
            rows: 4,
            fullWidth: true,
        },
        {
            name: 'is_active',
            label: t('common.status'),
            type: 'select',
            options: [
                { value: 'true', label: t('status.active') },
                { value: 'false', label: t('status.inactive') },
            ],
        },
    ];

    const formatPayload = (values) => ({
        department_id: Number(values.department_id),
        description: values.description || '',
        is_active: values.is_active === true || values.is_active === 'true',
    });

    const columns = [
        { key: 'id', label: t('common.id') },
        { key: 'name', label: t('common.name') },
        { key: 'description', label: t('common.description') },
        {
            key: 'is_active',
            label: t('common.status'),
            render: (row) => (row.is_active ? t('status.active') : t('status.inactive')),
        },
        {
            key: 'created_at',
            label: t('common.createdAt'),
            render: (row) => formatDateTime(row.created_at),
        },
        {
            key: 'updated_at',
            label: t('common.updatedAt'),
            render: (row) => formatDateTime(row.updated_at),
        },
    ];

    return (
        <CrudPage
            title={facility ? `${t('nav.departments')} - ${facility.name}` : t('nav.departments')}
            addLabel={t('actions.add')}
            columns={columns}
            data={rows}
            isLoading={isLoading}
            fields={fields}
            initialValues={{ department_id: '', description: '', is_active: 'true' }}
            onCreate={(values) => assignMutation.mutateAsync(formatPayload(values))}
            onDelete={(assignmentId) => removeMutation.mutateAsync(assignmentId)}
            isSubmitting={assignMutation.isPending}
            onView={(department) => {
                const departmentId = department?.id;
                if (!departmentId) return;
                navigate(`/admin/facilities/${id}/departments/${departmentId}`);
            }}
            viewLabel={t('actions.viewMore')}
            extraActions={
                <Button
                    variant="secondary"
                    onClick={() => navigate('/admin/facilities')}
                >
                    {t('actions.back')}
                </Button>
            }
        />
    );
};

export default FacilityDepartmentsPage;