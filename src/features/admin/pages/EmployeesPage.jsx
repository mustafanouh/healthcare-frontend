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

/**
 * ---------------------------------------------------------
 * Initial form values
 * ---------------------------------------------------------
 */
const EMPTY_VALUES = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',

    role: 'doctor',

    // General profile fields
    full_name: '',
    national_number: '',
    phone: '',
    gender: 'male',
    address: '',
    date_of_birth: '',
    facility_id: '',
    languages: '',
    is_active: 'true',

    // Doctor
    facility_department_specialization_id: '',
    qualification: '',
    years_of_experience: '',
    biography: '',
    achievements: '',

    // Pharmacist
    degree: '',
    license_number: '',

    // Laboratory
    specialization: '',
};

/**
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */

const parseLanguages = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const formatLanguagesForForm = (value) => {
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    return value ?? '';
};

const formatDateForForm = (value) => {
    if (!value) return '';

    return String(value).slice(0, 10);
};

/**
 * Keep laboratory as "laboratory".
 *
 * Do NOT use normalizeRole() here because it converts
 * laboratory -> lab_staff, while the employees API expects
 * laboratory.
 */
const getRoleName = (role) => {
    if (typeof role === 'string') {
        return role;
    }

    if (role?.name) {
        return role.name;
    }

    if (role?.slug) {
        return role.slug;
    }

    if (role?.role) {
        return role.role;
    }

    return null;
};

const getRecordRole = (record) => {
    return (
        getRoleName(record?.profile?.user?.roles?.[0]) ??
        getRoleName(record?.role) ??
        'doctor'
    );
};

/**
 * ---------------------------------------------------------
 * Format API record -> Form values
 * ---------------------------------------------------------
 *
 * The API returns role-specific data in:
 *
 * doctor
 * pharmacist
 * lab_staff
 *
 * depending on the employee role.
 */
const mapRecordToForm = (record) => {
    const role = getRecordRole(record);

    const doctor = record?.doctor ?? null;
    const pharmacist = record?.pharmacist ?? null;
    const labStaff = record?.lab_staff ?? null;

    return {
        name:
            record?.profile?.user?.name ??
            record?.profile?.full_name ??
            '',

        email: record?.profile?.user?.email ?? '',

        // Never fill passwords while editing.
        password: '',
        password_confirmation: '',

        role,

        // General profile
        full_name: record?.profile?.full_name ?? '',
        national_number: record?.profile?.national_number ?? '',
        phone: record?.profile?.phone ?? '',
        gender: record?.profile?.gender ?? 'male',
        address: record?.profile?.address ?? '',
        date_of_birth: formatDateForForm(
            record?.profile?.date_of_birth
        ),

        facility_id: record?.facility_id ?? '',

        languages: formatLanguagesForForm(
            record?.languages
        ),

        is_active:
            record?.is_active != null
                ? String(record.is_active)
                : 'true',

        // Doctor
        facility_department_specialization_id:
            doctor?.facility_department_specialization_id ??
            '',

        qualification:
            doctor?.qualification ??
            '',

        years_of_experience:
            doctor?.years_of_experience ??
            pharmacist?.years_of_experience ??
            labStaff?.years_of_experience ??
            '',

        biography:
            doctor?.biography ??
            '',

        achievements:
            doctor?.achievements ??
            '',

        // Pharmacist
        degree:
            pharmacist?.degree ??
            labStaff?.degree ??
            '',

        license_number:
            pharmacist?.license_number ??
            labStaff?.license_number ??
            '',

        // Laboratory
        specialization:
            labStaff?.specialization ??
            '',
    };
};

/**
 * ---------------------------------------------------------
 * Format Form -> API payload
 * ---------------------------------------------------------
 *
 * Important:
 * We ONLY send fields belonging to the selected role.
 *
 * admin / manager:
 *   general fields only
 *
 * doctor:
 *   doctor fields
 *
 * pharmacist:
 *   pharmacist fields
 *
 * laboratory:
 *   laboratory fields
 */
const formatPayload = (values) => {
    const role = values.role;

    const payload = {
        // General
        name: values.name,
        email: values.email,

        role,

        full_name: values.full_name,
        national_number: values.national_number,
        phone: values.phone,
        gender: values.gender,
        address: values.address,
        date_of_birth: values.date_of_birth,

        facility_id:
            values.facility_id === '' ||
            values.facility_id == null
                ? null
                : Number(values.facility_id),

        languages: parseLanguages(values.languages),

        is_active:
            values.is_active === true ||
            values.is_active === 'true',
    };

    /**
     * Password is required when creating an employee,
     * but when editing we don't want to send empty passwords.
     */
    if (values.password) {
        payload.password = values.password;
    }

    if (values.password_confirmation) {
        payload.password_confirmation =
            values.password_confirmation;
    }

    /**
     * -------------------------------------------------------
     * Doctor
     * -------------------------------------------------------
     */
    if (role === ROLES.DOCTOR) {
        payload.facility_department_specialization_id =
            values.facility_department_specialization_id === '' ||
            values.facility_department_specialization_id == null
                ? null
                : Number(
                    values.facility_department_specialization_id
                );

        payload.qualification = values.qualification;

        payload.years_of_experience =
            values.years_of_experience === '' ||
            values.years_of_experience == null
                ? null
                : Number(values.years_of_experience);

        payload.biography = values.biography;
        payload.achievements = values.achievements;
    }

    /**
     * -------------------------------------------------------
     * Pharmacist
     * -------------------------------------------------------
     */
    if (role === ROLES.PHARMACIST) {
        payload.degree = values.degree;

        payload.years_of_experience =
            values.years_of_experience === '' ||
            values.years_of_experience == null
                ? null
                : Number(values.years_of_experience);

        payload.license_number = values.license_number;
    }

    /**
     * -------------------------------------------------------
     * Laboratory
     * -------------------------------------------------------
     */
    if (role === ROLES.LABORATORY) {
        payload.specialization = values.specialization;
        payload.degree = values.degree;

        payload.years_of_experience =
            values.years_of_experience === '' ||
            values.years_of_experience == null
                ? null
                : Number(values.years_of_experience);

        payload.license_number = values.license_number;
    }

    return payload;
};

/**
 * ---------------------------------------------------------
 * Component
 * ---------------------------------------------------------
 */
const EmployeesPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [page, setPage] = useState(1);

    const perPage = 10;

    /**
     * Debounced search
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    /**
     * -------------------------------------------------------
     * Queries / mutations
     * -------------------------------------------------------
     */

    const queryParams = {
        search,
        facility_id: facilityId,
        page,
        per_page: perPage,
    };

    const { data, isLoading } =
        useEmployees(queryParams);

    const { data: facilitiesData } =
        useFacilities();

    const createMut = useCreateEmployee();
    const updateMut = useUpdateEmployee();
    const deleteMut = useDeleteEmployee();

    /**
     * -------------------------------------------------------
     * Facilities
     * -------------------------------------------------------
     */

    const facilitiesList = Array.isArray(
        facilitiesData?.data
    )
        ? facilitiesData.data
        : Array.isArray(facilitiesData)
            ? facilitiesData
            : [];

    const facilities = facilitiesList.map((facility) => ({
        value: facility.id,
        label: facility.name,
    }));

    const facilityOptions = [
        {
            value: '',
            label: t('common.all', {
                ns: 'common',
            }),
        },
        ...facilities,
    ];

    /**
     * -------------------------------------------------------
     * Roles
     * -------------------------------------------------------
     */

    const roleOptions = [
        {
            value: ROLES.ADMIN,
            label: t('roles.admin', {
                defaultValue: 'Administrator',
            }),
        },
        {
            value: ROLES.MANAGER,
            label: t('roles.manager', {
                defaultValue: 'Manager',
            }),
        },
        {
            value: ROLES.DOCTOR,
            label: t('roles.doctor', {
                defaultValue: 'Doctor',
            }),
        },
        {
            value: ROLES.PHARMACIST,
            label: t('roles.pharmacist', {
                defaultValue: 'Pharmacist',
            }),
        },
        {
            value: ROLES.LABORATORY,
            label: t('roles.laboratory', {
                defaultValue: 'Laboratory',
            }),
        },
    ];

    /**
     * -------------------------------------------------------
     * Gender
     * -------------------------------------------------------
     */

    const genderOptions = [
        {
            value: 'male',
            label: t('gender.male', {
                defaultValue: 'Male',
            }),
        },
        {
            value: 'female',
            label: t('gender.female', {
                defaultValue: 'Female',
            }),
        },
    ];

    /**
     * -------------------------------------------------------
     * Active status
     * -------------------------------------------------------
     */

    const activeOptions = [
        {
            value: 'true',
            label: t('status.active', {
                ns: 'common',
            }),
        },
        {
            value: 'false',
            label: t('status.inactive', {
                ns: 'common',
            }),
        },
    ];

    /**
     * -------------------------------------------------------
     * Table columns
     * -------------------------------------------------------
     */

    const columns = [
        {
            key: 'id',
            label: t('common.id', {
                ns: 'common',
            }),
        },

        {
            key: 'name',
            label: t('common.name', {
                ns: 'common',
            }),
            render: (record) =>
                record?.profile?.full_name ?? '—',
        },

        {
            key: 'email',
            label: t('profile.email', {
                ns: 'common',
            }),
            render: (record) =>
                record?.profile?.user?.email ?? '—',
        },

        {
            key: 'role',
            label: t('profile.role', {
                ns: 'common',
            }),
            render: (record) => {
                const roleName = getRecordRole(record);

                if (!roleName) {
                    return '—';
                }

                return t(`roles.${roleName}`, {
                    defaultValue: roleName,
                });
            },
        },

        {
            key: 'facility',
            label: t('nav.facilities', {
                ns: 'common',
            }),
            render: (record) =>
                record?.facility?.name ?? '—',
        },

        {
            key: 'is_active',
            label: t('common.status', {
                ns: 'common',
            }),
            render: (record) =>
                record?.is_active
                    ? t('status.active', {
                        ns: 'common',
                    })
                    : t('status.inactive', {
                        ns: 'common',
                    }),
            cellVariant: 'badge',
        },
    ];

    /**
     * -------------------------------------------------------
     * Form fields
     * -------------------------------------------------------
     *
     * ResourceFormModal will decide which fields are shown
     * according to field.roles.
     */
    const fields = [
        // =====================================================
        // General fields
        // =====================================================

        {
            name: 'name',
            label: t('common.name', {
                ns: 'common',
            }),
            fullWidth: true,
        },

        {
            name: 'email',
            label: t('profile.email', {
                ns: 'common',
            }),
            type: 'email',
            fullWidth: true,
        },

        {
            name: 'password',
            label: t('login.password', {
                ns: 'auth',
            }),
            type: 'password',
            createOnly: true,
            fullWidth: true,
        },

        {
            name: 'password_confirmation',
            label: t('register.passwordConfirm', {
                ns: 'auth',
            }),
            type: 'password',
            createOnly: true,
            fullWidth: true,
        },

        {
            name: 'role',
            label: t('profile.role', {
                ns: 'common',
            }),
            type: 'select',
            options: roleOptions,
            required: true,
        },

        {
            name: 'full_name',
            label: t('common.fullName', {
                ns: 'common',
            }),
            fullWidth: true,
        },

        {
            name: 'national_number',
            label: t('profile.nationalNumber', {
                defaultValue: 'National Number',
            }),
            dir: 'ltr',
            fullWidth: true,
        },

        {
            name: 'phone',
            label: t('common.phone', {
                ns: 'common',
            }),
            dir: 'ltr',
            fullWidth: true,
        },

        {
            name: 'gender',
            label: t('profile.gender', {
                defaultValue: 'Gender',
            }),
            type: 'select',
            options: genderOptions,
        },

        {
            name: 'address',
            label: t('profile.address', {
                defaultValue: 'Address',
            }),
            fullWidth: true,
        },

        {
            name: 'date_of_birth',
            label: t('profile.dateOfBirth', {
                defaultValue: 'Date of Birth',
            }),
            type: 'date',
        },

        {
            name: 'facility_id',
            label: t('nav.facilities', {
                ns: 'common',
            }),
            type: 'select',
            options: facilities,
        },

        {
            name: 'languages',
            label: t('profile.languages', {
                defaultValue: 'Languages',
            }),
            placeholder: t('doctors.languagesHint'),
            fullWidth: true,
        },

        {
            name: 'is_active',
            label: t('common.status', {
                ns: 'common',
            }),
            type: 'select',
            options: activeOptions,
        },

        // =====================================================
        // Doctor fields
        // =====================================================

        {
            name: 'facility_department_specialization_id',
            label: t(
                'doctors.facilityDepartmentSpecialization',
                {
                    defaultValue:
                        'Department Specialization ID',
                }
            ),
            type: 'number',
            dir: 'ltr',
            roles: [ROLES.DOCTOR],
        },

        {
            name: 'qualification',
            label: t('doctors.qualification', {
                defaultValue: 'Qualification',
            }),
            roles: [ROLES.DOCTOR],
            fullWidth: true,
        },

        {
            name: 'years_of_experience',
            label: t('doctors.yearsOfExperience', {
                defaultValue: 'Years of Experience',
            }),
            type: 'number',
            dir: 'ltr',
            roles: [
                ROLES.DOCTOR,
                ROLES.PHARMACIST,
                ROLES.LABORATORY,
            ],
        },

        {
            name: 'biography',
            label: t('doctors.biography', {
                defaultValue: 'Biography',
            }),
            type: 'textarea',
            rows: 4,
            roles: [ROLES.DOCTOR],
            fullWidth: true,
        },

        {
            name: 'achievements',
            label: t('doctors.achievements', {
                defaultValue: 'Achievements',
            }),
            type: 'textarea',
            rows: 4,
            roles: [ROLES.DOCTOR],
            fullWidth: true,
        },

        // =====================================================
        // Pharmacist fields
        // =====================================================

        {
            name: 'degree',
            label: t('employees.degree', {
                defaultValue: 'Degree',
            }),
            roles: [
                ROLES.PHARMACIST,
                ROLES.LABORATORY,
            ],
            fullWidth: true,
        },

        {
            name: 'license_number',
            label: t('employees.licenseNumber', {
                defaultValue: 'License Number',
            }),
            roles: [
                ROLES.PHARMACIST,
                ROLES.LABORATORY,
            ],
            dir: 'ltr',
            fullWidth: true,
        },

        // =====================================================
        // Laboratory fields
        // =====================================================

        {
            name: 'specialization',
            label: t('employees.specialization', {
                defaultValue: 'Specialization',
            }),
            roles: [ROLES.LABORATORY],
            fullWidth: true,
        },
    ];

    /**
     * -------------------------------------------------------
     * Data
     * -------------------------------------------------------
     */

    const rows = Array.isArray(data?.data?.data)
        ? data.data.data
        : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
                ? data
                : [];

    const paginationData =
        data?.data &&
        !Array.isArray(data.data)
            ? data.data
            : data;

    const total =
        paginationData?.total ??
        data?.meta?.total ??
        rows.length;

    const lastPage =
        paginationData?.last_page ??
        data?.meta?.last_page ??
        Math.max(
            1,
            Math.ceil(total / perPage)
        );

    /**
     * -------------------------------------------------------
     * Filters
     * -------------------------------------------------------
     */

    const hasFilters = Boolean(
        searchInput ||
        search ||
        facilityId
    );

    const clearFilters = () => {
        setSearchInput('');
        setSearch('');
        setFacilityId('');
        setPage(1);
    };

    /**
     * -------------------------------------------------------
     * Render
     * -------------------------------------------------------
     */

    return (
        <div className="space-y-4">
            <Card>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
                    <Input
                        label={t('actions.search', {
                            ns: 'common',
                        })}
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(
                                event.target.value
                            )
                        }
                        placeholder={t(
                            'employees.searchPlaceholder',
                            {
                                ns: 'common',
                            }
                        )}
                    />

                    <Select
                        label={t(
                            'nav.facilities',
                            {
                                ns: 'common',
                            }
                        )}
                        value={facilityId}
                        onChange={(event) => {
                            setFacilityId(
                                event.target.value
                            );
                            setPage(1);
                        }}
                        options={facilityOptions}
                    />

                    <Button
                        variant="secondary"
                        onClick={clearFilters}
                        disabled={!hasFilters}
                    >
                        {t('common.clear', {
                            ns: 'common',
                        })}
                    </Button>
                </div>
            </Card>

            <CrudPage
                title={t('employees.title', {
                    ns: 'common',
                })}
                subtitle={t('employees.subtitle', {
                    ns: 'common',
                })}
                addLabel={t('actions.add', {
                    ns: 'common',
                })}
                columns={columns}
                data={rows}
                isLoading={isLoading}
                fields={fields}
                initialValues={EMPTY_VALUES}
                mapRecordToForm={mapRecordToForm}
                onCreate={(values) =>
                    createMut.mutateAsync(
                        formatPayload(values)
                    )
                }
                onUpdate={({ id, payload }) =>
                    updateMut.mutateAsync({
                        id,
                        payload:
                            formatPayload(payload),
                    })
                }
                onDelete={(id) =>
                    deleteMut.mutateAsync(id)
                }
                isSubmitting={
                    createMut.isPending ||
                    updateMut.isPending
                }
                onView={(row) =>
                    navigate(
                        `/admin/employees/${row.id}`
                    )
                }
                viewLabel={t(
                    'actions.viewMore',
                    {
                        ns: 'common',
                    }
                )}
            />

            {lastPage > 1 && (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('common.page', {
                            ns: 'common',
                        })}{' '}
                        {page} / {lastPage}
                    </span>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            disabled={
                                page <= 1 ||
                                isLoading
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current - 1
                                )
                            }
                        >
                            {t(
                                'actions.previous',
                                {
                                    ns: 'common',
                                }
                            )}
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={
                                page >= lastPage ||
                                isLoading
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current + 1
                                )
                            }
                        >
                            {t(
                                'actions.next',
                                {
                                    ns: 'common',
                                }
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;