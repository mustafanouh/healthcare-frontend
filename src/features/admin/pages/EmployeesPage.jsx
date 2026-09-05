import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Button, Card, Input, Select } from '../../../shared/components/ui';
import {
    useEmployees,
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
} from '../hooks/useEmployees';
import { useFacilities } from '../../facilities/hooks/useFacilities';
import { ROLES } from '../../../types/roles';

const EMPTY_VALUES = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'doctor',
    full_name: '',
    national_number: '',
    phone: '',
    gender: 'male',
    address: '',
    date_of_birth: '',
    facility_id: '',
    languages: '',
    is_active: 'true',
    years_of_experience: '',
};

const parseLanguages = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
};

const formatLanguagesForForm = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    return value ?? '';
};

const formatDateForForm = (value) => value ? String(value).slice(0, 10) : '';

const getRoleName = (role) => {
    if (typeof role === 'string') return role;
    if (role?.name) return role.name;
    return null;
};

const formatPayload = (values) => ({
    name: values.name,
    email: values.email,
    password: values.password,
    password_confirmation: values.password_confirmation,
    role: values.role,
    full_name: values.full_name,
    national_number: values.national_number,
    phone: values.phone,
    gender: values.gender,
    address: values.address,
    date_of_birth: values.date_of_birth,
    facility_id: Number(values.facility_id),
    languages: parseLanguages(values.languages),
    is_active: values.is_active === true || values.is_active === 'true',
    years_of_experience: Number(values.years_of_experience),
});

const mapRecordToForm = (record) => ({
    name: record.profile?.full_name ?? '',
    email: record.profile?.user?.email ?? '',
    password: '',
    password_confirmation: '',
    role: getRoleName(record.profile?.user?.roles?.[0]) ?? getRoleName(record.role) ?? 'doctor',
    full_name: record.profile?.full_name ?? '',
    national_number: record.profile?.national_number ?? '',
    phone: record.profile?.phone ?? '',
    gender: record.profile?.gender ?? 'male',
    address: record.profile?.address ?? '',
    date_of_birth: formatDateForForm(record.profile?.date_of_birth),
    facility_id: record.facility_id ?? '',
    languages: formatLanguagesForForm(record.languages),
    is_active: record.is_active != null ? String(record.is_active) : 'true',
    years_of_experience: record.years_of_experience ?? '',
});

const EmployeesPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const queryParams = {
        search,
        facility_id: facilityId,
        page,
        per_page: perPage,
    };
    const { data, isLoading } = useEmployees(queryParams);
    const { data: facilitiesData } = useFacilities();
    const createMut = useCreateEmployee();
    const updateMut = useUpdateEmployee();
    const deleteMut = useDeleteEmployee();

    const facilitiesList = Array.isArray(facilitiesData?.data)
        ? facilitiesData.data
        : Array.isArray(facilitiesData)
            ? facilitiesData
            : [];

    const facilities = facilitiesList.map((f) => ({ value: f.id, label: f.name }));
    const facilityOptions = [
        { value: '', label: t('common.all', { ns: 'common' }) },
        ...facilities,
    ];

    const roleOptions = [
        { value: ROLES.ADMIN, label: t('roles.admin', { defaultValue: 'Administrator' }) },
        { value: ROLES.MANAGER, label: t('roles.manager', { defaultValue: 'Manager' }) },
        { value: ROLES.DOCTOR, label: t('roles.doctor', { defaultValue: 'Doctor' }) },
        { value: ROLES.PHARMACIST, label: t('roles.pharmacist', { defaultValue: 'Pharmacist' }) },
        { value: ROLES.LABORATORY, label: t('roles.laboratory', { defaultValue: 'Laboratory' }) },
    ];

    const genderOptions = [
        { value: 'male', label: t('gender.male', { defaultValue: 'Male' }) },
        { value: 'female', label: t('gender.female', { defaultValue: 'Female' }) },
    ];

    const activeOptions = [
        { value: 'true', label: t('status.active', { ns: 'common' }) },
        { value: 'false', label: t('status.inactive', { ns: 'common' }) },
    ];

    const columns = [
        { key: 'id', label: t('common.id', { ns: 'common' }) },
        {
            key: 'name',
            label: t('common.name', { ns: 'common' }),
            render: (r) => r.profile?.full_name ?? '—',
        },
        {
            key: 'email',
            label: t('profile.email', { ns: 'common' }),
            render: (r) => r.profile?.user?.email ?? '—',
        },
        {
            key: 'role',
            label: t('profile.role', { ns: 'common' }),
            render: (r) => {
                const roleName = getRoleName(r.role) ?? getRoleName(r.profile?.user?.roles?.[0]);
                if (!roleName) return '—';
                return t(`roles.${roleName}`, { defaultValue: roleName });
            },
        },
        {
            key: 'facility',
            label: t('nav.facilities', { ns: 'common' }),
            render: (r) => r.facility?.name ?? '—',
        },
        {
            key: 'is_active',
            label: t('common.status', { ns: 'common' }),
            render: (r) => (r.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })),
            cellVariant: 'badge',
        },
    ];

    const fields = [
        { name: 'name', label: t('common.name', { ns: 'common' }), fullWidth: true },
        { name: 'email', label: t('profile.email', { ns: 'common' }), type: 'email', fullWidth: true },
        { name: 'password', label: t('login.password', { ns: 'auth' }), type: 'password', fullWidth: true },
        { name: 'password_confirmation', label: t('register.passwordConfirm', { ns: 'auth' }), type: 'password', fullWidth: true },
        { name: 'role', label: t('profile.role', { ns: 'common' }), type: 'select', options: roleOptions },
        { name: 'full_name', label: t('common.fullName', { ns: 'common' }), fullWidth: true },
        { name: 'national_number', label: t('profile.nationalNumber', { defaultValue: 'National Number' }), dir: 'ltr', fullWidth: true },
        { name: 'phone', label: t('common.phone', { ns: 'common' }), dir: 'ltr', fullWidth: true },
        { name: 'gender', label: t('profile.gender', { defaultValue: 'Gender' }), type: 'select', options: genderOptions },
        { name: 'address', label: t('profile.address', { defaultValue: 'Address' }), fullWidth: true },
        { name: 'date_of_birth', label: t('profile.dateOfBirth', { defaultValue: 'Date of Birth' }), type: 'date' },
        { name: 'facility_id', label: t('nav.facilities', { ns: 'common' }), type: 'select', options: facilities },
        { name: 'languages', label: t('profile.languages', { defaultValue: 'Languages' }), placeholder: t('doctors.languagesHint'), fullWidth: true },
        { name: 'years_of_experience', label: t('doctors.yearsOfExperience'), type: 'number', dir: 'ltr' },
        { name: 'is_active', label: t('common.status', { ns: 'common' }), type: 'select', options: activeOptions },
    ];

    const rows = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
            ? data
            : [];
    const total = data?.meta?.total ?? data?.total ?? rows.length;
    const lastPage = data?.meta?.last_page ?? Math.max(1, Math.ceil(total / perPage));
    const hasFilters = Boolean(searchInput || search || facilityId);

    const clearFilters = () => {
        setSearchInput('');
        setSearch('');
        setFacilityId('');
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <Card>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
                    <Input
                        label={t('actions.search', { ns: 'common' })}
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder={t('employees.searchPlaceholder', { ns: 'common' })}
                    />
                    <Select
                        label={t('nav.facilities', { ns: 'common' })}
                        value={facilityId}
                        onChange={(event) => {
                            setFacilityId(event.target.value);
                            setPage(1);
                        }}
                        options={facilityOptions}
                    />
                    <Button variant="secondary" onClick={clearFilters} disabled={!hasFilters}>
                        {t('common.clear', { ns: 'common' })}
                    </Button>
                </div>
            </Card>

            <CrudPage
                title={t('employees.title', { ns: 'common' })}
                subtitle={t('employees.subtitle', { ns: 'common' })}
                addLabel={t('actions.add', { ns: 'common' })}
                columns={columns}
                data={rows}
                isLoading={isLoading}
                fields={fields}
                initialValues={EMPTY_VALUES}
                mapRecordToForm={mapRecordToForm}
                onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
                onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
                onDelete={(id) => deleteMut.mutateAsync(id)}
                isSubmitting={createMut.isPending || updateMut.isPending}
                onView={(row) => navigate(`/admin/employees/${row.id}`)}
                viewLabel={t('actions.viewMore', { ns: 'common' })}
            />

            {lastPage > 1 && (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('common.page', { ns: 'common' })} {page} / {lastPage}
                    </span>
                    <div className="flex gap-2">
                        <Button variant="secondary" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => current - 1)}>
                            {t('actions.previous', { ns: 'common' })}
                        </Button>
                        <Button variant="secondary" disabled={page >= lastPage || isLoading} onClick={() => setPage((current) => current + 1)}>
                            {t('actions.next', { ns: 'common' })}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;
