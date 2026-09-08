import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVisit, useCompleteVisit } from '../hooks/useVisits';
import { useCreateDiagnosis, useUpdateDiagnosis, useDeleteDiagnosis } from '../hooks/useDiagnoses';
import { useCreatePrescription } from '../../prescriptions/hooks/usePrescriptions';
import { useCreatePrescriptionItem, useUpdatePrescriptionItem, useDeletePrescriptionItem } from '../../prescriptions/hooks/usePrescriptionItems';
import { useCreateLabRequestItem, useUpdateLabRequestItem, useDeleteLabRequestItem } from '../../lab-results/hooks/useLabRequestItems';
import { useLabTests } from '../../lab-tests/hooks/useLabTests';
import { usePatient } from '../../patient/hooks/usePatients';
import { usePatientMedicalConditions } from '../../patient/hooks/usePatientMedicalConditions';
import { Badge, Button, Card, Input, Select, Spinner } from '../../../shared/components/ui';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';

const EMPTY_ERRORS = {};
const ACTIVE_VISIT_STORAGE_PREFIX = 'healthcare.active-visit.';

const readActiveVisitState = (visitId) => {
    if (!visitId || typeof window === 'undefined') return {};
    try {
        return JSON.parse(window.localStorage.getItem(`${ACTIVE_VISIT_STORAGE_PREFIX}${visitId}`) || '{}');
    } catch {
        return {};
    }
};

const ActionCard = ({ title, description, active, onClick, children }) => (
    <Card className={active ? 'border-blue-500 ring-2 ring-blue-100 dark:border-blue-400 dark:ring-blue-900/30' : ''}>
        <button type="button" onClick={onClick} className="w-full text-start">
            <div className="flex items-start justify-between gap-3">
                <div><h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p></div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{active ? '−' : '+'}</span>
            </div>
        </button>
        {active && <div className="mt-5 border-t border-gray-100 pt-5 dark:border-surface-800">{children}</div>}
    </Card>
);

const ActiveVisitPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: visitResponse, isLoading: visitLoading, isError: visitError } = useVisit(id);
    const visit = visitResponse?.data ?? visitResponse;
    const patientId = visit?.patient_id ?? visit?.patient?.id;
    const { data: patientResponse, isLoading: patientLoading } = usePatient(patientId);
    const patient = patientResponse?.data ?? patientResponse ?? visit?.patient;
    const { data: conditionsResponse, isLoading: conditionsLoading } = usePatientMedicalConditions(patientId);
    const medicalConditions = Array.isArray(conditionsResponse?.data)
        ? conditionsResponse.data
        : Array.isArray(conditionsResponse)
            ? conditionsResponse
            : conditionsResponse?.data
                ? [conditionsResponse.data]
                : [];
    const { data: testsResponse } = useLabTests();
    const tests = Array.isArray(testsResponse?.data) ? testsResponse.data : Array.isArray(testsResponse) ? testsResponse : [];
    const persistedState = readActiveVisitState(id);

    const diagnosisMut = useCreateDiagnosis();
    const updateDiagnosisMut = useUpdateDiagnosis();
    const deleteDiagnosisMut = useDeleteDiagnosis();
    const prescriptionMut = useCreatePrescription();
    const itemMut = useCreatePrescriptionItem();
    const updateItemMut = useUpdatePrescriptionItem();
    const deleteItemMut = useDeletePrescriptionItem();
    const labMut = useCreateLabRequestItem();
    const updateLabMut = useUpdateLabRequestItem();
    const deleteLabMut = useDeleteLabRequestItem();
    const completeMut = useCompleteVisit();
    const [activeForm, setActiveForm] = useState(() => persistedState.activeForm ?? '');
    const [diagnosis, setDiagnosis] = useState(() => persistedState.diagnosis ?? { diagnosis_code: '', description: '', diagnosis_type: 'primary', notes: '' });
    const [createdDiagnoses, setCreatedDiagnoses] = useState(() => persistedState.createdDiagnoses ?? []);
    const [diagnosisFormOpen, setDiagnosisFormOpen] = useState(() => persistedState.diagnosisFormOpen ?? true);
    const [editingDiagnosis, setEditingDiagnosis] = useState(() => persistedState.editingDiagnosis ?? null);
    const [prescription, setPrescription] = useState(() => persistedState.prescription ?? { notes: '' });
    const [prescriptionItem, setPrescriptionItem] = useState(() => persistedState.prescriptionItem ?? { prescription_id: '', medication_name: '', dosage: '', quantity_prescribed: '', frequency: '', duration: '' });
    const [createdPrescriptionItems, setCreatedPrescriptionItems] = useState(() => persistedState.createdPrescriptionItems ?? []);
    const [prescriptionItemFormOpen, setPrescriptionItemFormOpen] = useState(() => persistedState.prescriptionItemFormOpen ?? true);
    const [editingPrescriptionItem, setEditingPrescriptionItem] = useState(() => persistedState.editingPrescriptionItem ?? null);
    const [labRequest, setLabRequest] = useState(() => persistedState.labRequest ?? { lab_test_id: '', notes: '' }); //ss
    const [errors, setErrors] = useState(EMPTY_ERRORS);
    const [success, setSuccess] = useState('');
    const [createdPrescription, setCreatedPrescription] = useState(() => persistedState.createdPrescription ?? null);
    const [createdLabRequests, setCreatedLabRequests] = useState(() => persistedState.createdLabRequests ?? []);
    const [labFormOpen, setLabFormOpen] = useState(() => persistedState.labFormOpen ?? false);
    const [editingLabRequest, setEditingLabRequest] = useState(() => persistedState.editingLabRequest ?? null);

    useEffect(() => {
        if (!id || typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(`${ACTIVE_VISIT_STORAGE_PREFIX}${id}`, JSON.stringify({
                activeForm,
                diagnosis,
                createdDiagnoses,
                diagnosisFormOpen,
                editingDiagnosis,
                prescription,
                prescriptionItem,
                createdPrescription,
                createdPrescriptionItems,
                prescriptionItemFormOpen,
                editingPrescriptionItem,
                labRequest,
                createdLabRequests,
                labFormOpen,
                editingLabRequest,
            }));
        } catch {
            // Storage can be unavailable or full; the page remains usable in memory.
        }
    }, [id, activeForm, diagnosis, createdDiagnoses, diagnosisFormOpen, editingDiagnosis, prescription, prescriptionItem, createdPrescription, createdPrescriptionItems, prescriptionItemFormOpen, editingPrescriptionItem, labRequest, createdLabRequests, labFormOpen, editingLabRequest]);

    useEffect(() => {
        if (createdDiagnoses.length > 0 || createdLabRequests.length > 0 || createdPrescription) {
            setActiveForm((current) => current || (createdDiagnoses.length > 0 ? 'diagnosis' : createdLabRequests.length > 0 ? 'lab' : 'prescription'));
        }
    }, [createdDiagnoses.length, createdLabRequests.length, createdPrescription]);

    const update = (setter, name) => (event) => setter((current) => ({ ...current, [name]: event.target.value }));
    const submit = async (mutation, payload, formName, onSuccess) => {
        setErrors(EMPTY_ERRORS); setSuccess('');
        try {
            const response = await mutation.mutateAsync(payload);
            onSuccess?.(response);
            setSuccess(t('common.savedSuccessfully', { defaultValue: `${formName} saved successfully.` }));
        } catch (error) {
            const fieldErrors = error?.response?.data?.errors ?? {};
            setErrors({
                ...fieldErrors,
                _form: parseApiError(error, t('common.saveError', { defaultValue: 'Could not save this record.' })),
            });
        }
    };

    const createDiagnosis = (event) => {
        event.preventDefault();
        submit(diagnosisMut, { ...diagnosis, visit_id: Number(id) }, 'Diagnosis', (response) => {
            const created = response?.data?.data ?? response?.data ?? response;
            setCreatedDiagnoses((current) => [...current, { ...diagnosis, ...created, id: created?.id }]);
            setDiagnosis({ diagnosis_code: '', description: '', diagnosis_type: 'primary', notes: '' });
            setDiagnosisFormOpen(false);
        });
    };
    const startEditDiagnosis = (record) => {
        setEditingDiagnosis({ ...record });
        setErrors(EMPTY_ERRORS);
    };
    const updateDiagnosis = (event) => {
        event.preventDefault();
        const payload = {
            diagnosis_code: editingDiagnosis.diagnosis_code,
            description: editingDiagnosis.description,
            notes: editingDiagnosis.notes ?? '',
        };
        submit(updateDiagnosisMut, payload, 'Diagnosis', (response) => {
            const updated = response?.data?.data ?? response?.data ?? response;
            setCreatedDiagnoses((current) => current.map((record) => record.id === editingDiagnosis.id ? { ...record, ...payload, ...updated } : record));
            setEditingDiagnosis(null);
        });
    };
    const deleteDiagnosis = async (record) => {
        if (!record.id || !window.confirm(t('actions.confirmDelete', { ns: 'common' }))) return;
        setErrors(EMPTY_ERRORS);
        setSuccess('');
        try {
            await deleteDiagnosisMut.mutateAsync(record.id);
            setCreatedDiagnoses((current) => current.filter((item) => item.id !== record.id));
            setSuccess(t('common.deletedSuccessfully', { ns: 'common', defaultValue: 'Deleted successfully.' }));
        } catch (error) {
            setErrors({ _form: parseApiError(error, t('common.deleteError', { ns: 'common', defaultValue: 'Could not delete this record.' })) });
        }
    };
    const createPrescription = (event) => {
        event.preventDefault();
        submit(
            prescriptionMut,
            { visit_id: Number(id), notes: prescription.notes.trim() },
            t('visits.prescription'),
            (response) => {
                const created = response?.data?.data ?? response?.data ?? response;
                if (!created?.id) throw new Error(t('visits.invalidPrescriptionResponse', { defaultValue: 'The prescription was not created. The API returned an invalid response.' }));
                setCreatedPrescription(created);
                setPrescriptionItem((current) => ({ ...current, prescription_id: created.id }));
                setPrescriptionItemFormOpen(true);
            }
        );
    };
    const createItem = (event) => {
        event.preventDefault();
        const payload = { ...prescriptionItem, prescription_id: Number(prescriptionItem.prescription_id), quantity_prescribed: Number(prescriptionItem.quantity_prescribed) };
        submit(itemMut, payload, 'Prescription item', (response) => {
            const created = response?.data?.data ?? response?.data ?? response;
            setCreatedPrescriptionItems((current) => [...current, { ...payload, ...created }]);
            setPrescriptionItem((current) => ({ ...current, medication_name: '', dosage: '', quantity_prescribed: '', frequency: '', duration: '' }));
            setPrescriptionItemFormOpen(false);
        });
    };
    const startEditPrescriptionItem = (item) => {
        setEditingPrescriptionItem({ ...item });
        setErrors(EMPTY_ERRORS);
    };
    const updatePrescriptionItem = (event) => {
        event.preventDefault();
        const payload = {
            prescription_id: Number(editingPrescriptionItem.prescription_id),
            medication_name: editingPrescriptionItem.medication_name,
            dosage: editingPrescriptionItem.dosage,
            quantity_prescribed: Number(editingPrescriptionItem.quantity_prescribed),
            frequency: editingPrescriptionItem.frequency,
            duration: editingPrescriptionItem.duration,
        };
        submit(updateItemMut, payload, 'Prescription item', (response) => {
            const updated = response?.data?.data ?? response?.data ?? response;
            setCreatedPrescriptionItems((current) => current.map((item) => item.id === editingPrescriptionItem.id ? { ...item, ...payload, ...updated } : item));
            setEditingPrescriptionItem(null);
        });
    };
    const deletePrescriptionItem = async (item) => {
        if (!item.id || !window.confirm(t('actions.confirmDelete', { ns: 'common' }))) return;
        setErrors(EMPTY_ERRORS);
        setSuccess('');
        try {
            await deleteItemMut.mutateAsync(item.id);
            setCreatedPrescriptionItems((current) => current.filter((entry) => entry.id !== item.id));
            setSuccess(t('common.deletedSuccessfully', { ns: 'common', defaultValue: 'Deleted successfully.' }));
        } catch (error) {
            setErrors({ _form: parseApiError(error, t('common.deleteError', { ns: 'common', defaultValue: 'Could not delete this record.' })) });
        }
    };
    const createLabRequest = (event) => {
        event.preventDefault();
        const payload = { ...labRequest, visit_id: Number(id), lab_test_id: Number(labRequest.lab_test_id) };
        submit(labMut, payload, 'Lab request', (response) => {
            const selectedTest = tests.find((test) => String(test.id) === String(labRequest.lab_test_id));
            const created = response?.data?.data ?? response?.data ?? response;
            setCreatedLabRequests((current) => [...current, { ...payload, id: created?.id, lab_test_name: selectedTest?.name ?? `#${labRequest.lab_test_id}` }]);
            setLabRequest({ lab_test_id: '', notes: '' });
            setLabFormOpen(false);
        });
    };
    const startEditLabRequest = (request) => {
        setEditingLabRequest({ ...request });
        setErrors(EMPTY_ERRORS);
    };
    const updateLabRequest = (event) => {
        event.preventDefault();
        const payload = {
            visit_id: Number(id),
            lab_test_id: Number(editingLabRequest.lab_test_id),
            requested_at: editingLabRequest.requested_at.replace('T', ' '),
            notes: editingLabRequest.notes,
        };
        submit(updateLabMut, payload, 'Lab request', (response) => {
            const updated = response?.data?.data ?? response?.data ?? response;
            setCreatedLabRequests((current) => current.map((request) => request.id === editingLabRequest.id
                ? { ...request, ...payload, ...updated, lab_test_name: tests.find((test) => String(test.id) === String(payload.lab_test_id))?.name ?? request.lab_test_name }
                : request));
            setEditingLabRequest(null);
        });
    };
    const deleteLabRequest = async (request) => {
        if (!request.id || !window.confirm(t('actions.confirmDelete', { ns: 'common' }))) return;
        setErrors(EMPTY_ERRORS);
        setSuccess('');
        try {
            await deleteLabMut.mutateAsync(request.id);
            setCreatedLabRequests((current) => current.filter((item) => item.id !== request.id));
            setSuccess(t('common.deletedSuccessfully', { ns: 'common', defaultValue: 'Deleted successfully.' }));
        } catch (error) {
            setErrors({ _form: parseApiError(error, t('common.deleteError', { ns: 'common', defaultValue: 'Could not delete this record.' })) });
        }
    };
    const completeVisit = async () => { setErrors(EMPTY_ERRORS); try { await completeMut.mutateAsync(Number(id)); navigate('/doctor/visits'); } catch (error) { setErrors({ _form: parseApiError(error, 'Could not complete the visit.') }); } };

    if (visitLoading || patientLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    if (visitError || !visit) return <Card><p className="text-sm text-red-600">{t('errors.generic', { ns: 'common', defaultValue: 'Could not load the visit.' })}</p></Card>;

    const patientName = patient?.profile?.full_name ?? visit.patient?.profile?.full_name ?? `#${patientId}`;
    const inputError = (name) => Array.isArray(errors[name]) ? errors[name][0] : errors[name];
    const commonInput = (name, fallbackName) => {
        const message = inputError(name) || (fallbackName ? inputError(fallbackName) : '');
        return { error: message, touched: Boolean(message) };
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div><button type="button" onClick={() => navigate('/doctor/visits')} className="text-sm text-gray-500 hover:text-blue-600">← {t('actions.back', { ns: 'common' })}</button><h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{t('visits.activeVisit')}</h1><p className="mt-1 text-sm text-gray-500">{t('visits.visitNumber', { id: visit.id })} · {formatDateTime(visit.visited_at)}</p></div>
                <div className="flex items-center gap-3"><Badge status={visit.status} /><Button variant="primary" onClick={completeVisit} loading={completeMut.isPending}>{t('visits.completeVisit')}</Button></div>
            </div>
            {success && <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-400">{success}</div>}

            <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white shadow-lg">
                <div className="grid gap-6 p-6 md:grid-cols-4"><div className="md:col-span-2"><p className="text-xs uppercase tracking-wider text-blue-200">{t('visits.patientProfile')}</p><h2 className="mt-2 text-2xl font-bold">{patientName}</h2><p className="mt-1 text-sm text-blue-100">{patient?.profile?.phone ?? '—'} · {patient?.profile?.gender ?? '—'}</p><p className="mt-2 text-sm text-blue-100">{patient?.profile?.address ?? '—'}</p></div><div><p className="text-xs text-blue-200">{t('visits.dateOfBirth')}</p><p className="mt-2 font-semibold">{formatDate(patient?.profile?.date_of_birth) || '—'}</p><p className="mt-4 text-xs text-blue-200">{t('visits.nationalNumber')}</p><p className="mt-2 break-all text-sm font-semibold">{patient?.profile?.national_number ?? '—'}</p></div><div><p className="text-xs text-blue-200">{t('visits.bloodType')}</p><p className="mt-2 font-semibold">{patient?.blood_type ?? '—'}</p><p className="mt-4 text-xs text-blue-200">{t('visits.emergencyContact')}</p><p className="mt-2 text-sm font-semibold">{patient?.emergency_contact_name ?? '—'}</p><p className="text-xs text-blue-100">{patient?.emergency_contact_phone ?? '—'} · {patient?.emergency_contact_relation ?? '—'}</p></div></div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <ActionCard title={t('visits.addDiagnosis')} description={t('visits.addDiagnosisDescription')} active={activeForm === 'diagnosis'} onClick={() => setActiveForm(activeForm === 'diagnosis' ? '' : 'diagnosis')}>
                    {createdDiagnoses.length > 0 && !diagnosisFormOpen ? (
                        <div className="space-y-4">
                            {createdDiagnoses.map((record, index) => (
                                <div key={`${record.id ?? 'diagnosis'}-${index}`} className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-surface-800 dark:bg-surface-800/40">
                                    {editingDiagnosis?.id === record.id ? (
                                        <form onSubmit={updateDiagnosis} className="space-y-4">
                                            <Input label={t('visits.diagnosisCode')} name="diagnosis_code" value={editingDiagnosis.diagnosis_code ?? ''} onChange={(event) => setEditingDiagnosis((current) => ({ ...current, diagnosis_code: event.target.value }))} {...commonInput('diagnosis_code')} required />
                                            <Input label={t('visits.description')} name="description" value={editingDiagnosis.description ?? ''} onChange={(event) => setEditingDiagnosis((current) => ({ ...current, description: event.target.value }))} {...commonInput('description')} required />
                                            <Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={editingDiagnosis.notes ?? ''} onChange={(event) => setEditingDiagnosis((current) => ({ ...current, notes: event.target.value }))} {...commonInput('notes')} />
                                            <div className="flex gap-2"><Button type="submit" loading={updateDiagnosisMut.isPending}>{t('actions.save', { ns: 'common' })}</Button><Button type="button" variant="secondary" onClick={() => setEditingDiagnosis(null)}>{t('actions.cancel', { ns: 'common' })}</Button></div>
                                        </form>
                                    ) : (
                                        <><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.diagnosisCode')}</p><p className="mt-1 font-semibold text-gray-900 dark:text-white">{record.diagnosis_code}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.description')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{record.description}</p></div>{record.diagnosis_type && <div><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.formType')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{t(`visits.${record.diagnosis_type}`, { defaultValue: record.diagnosis_type })}</p></div>}{record.notes && <div><p className="text-xs text-gray-500 dark:text-gray-400">{t('common.notes', { ns: 'common' })}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{record.notes}</p></div>}<div className="flex flex-wrap gap-2 pt-1"><Button type="button" onClick={() => startEditDiagnosis(record)} disabled={!record.id}>{t('common.edit', { ns: 'common' })}</Button><Button type="button" variant="danger" onClick={() => deleteDiagnosis(record)} loading={deleteDiagnosisMut.isPending && deleteDiagnosisMut.variables === record.id} disabled={!record.id}>{t('common.delete', { ns: 'common' })}</Button></div></>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={() => setDiagnosisFormOpen(true)}>{t('visits.addAnotherDiagnosis')}</Button>
                        </div>
                    ) : (
                        <form onSubmit={createDiagnosis} className="space-y-4"><Input label={t('visits.diagnosisCode')} name="diagnosis_code" value={diagnosis.diagnosis_code} onChange={update(setDiagnosis, 'diagnosis_code')} {...commonInput('diagnosis_code')} required /><Input label={t('visits.description')} name="description" value={diagnosis.description} onChange={update(setDiagnosis, 'description')} {...commonInput('description')} required /><Select label={t('visits.formType')} name="diagnosis_type" value={diagnosis.diagnosis_type} onChange={update(setDiagnosis, 'diagnosis_type')} options={[{ value: 'primary', label: t('visits.primary') }, { value: 'secondary', label: t('visits.secondary') }]} error={inputError('diagnosis_type')} touched={Boolean(inputError('diagnosis_type'))} /><Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={diagnosis.notes} onChange={update(setDiagnosis, 'notes')} {...commonInput('notes')} /><div className="flex flex-wrap gap-2"><Button type="submit" loading={diagnosisMut.isPending}>{t('visits.saveDiagnosis')}</Button>{createdDiagnoses.length > 0 && <Button type="button" variant="secondary" onClick={() => setDiagnosisFormOpen(false)}>{t('actions.cancel', { ns: 'common' })}</Button>}</div></form>
                    )}
                </ActionCard>

                <ActionCard title={t('visits.requestLabAnalysis')} description={t('visits.requestLabAnalysisDescription')} active={activeForm === 'lab'} onClick={() => setActiveForm(activeForm === 'lab' ? '' : 'lab')}>
                    {createdLabRequests.length > 0 && !labFormOpen ? (
                        <div className="space-y-4">
                            {createdLabRequests.map((request, index) => (
                                <div key={`${request.lab_test_id}-${request.requested_at}-${index}`} className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-surface-800 dark:bg-surface-800/40">
                                    {editingLabRequest?.id === request.id ? (
                                        <form onSubmit={updateLabRequest} className="space-y-4">
                                            <Select label={t('visits.labTest')} name="lab_test_id" value={editingLabRequest.lab_test_id} onChange={(event) => setEditingLabRequest((current) => ({ ...current, lab_test_id: event.target.value }))} options={tests.map((test) => ({ value: String(test.id), label: test.name }))} error={inputError('lab_test_id')} touched={Boolean(inputError('lab_test_id'))} required />
                                            <Input label={t('visits.requestedAt')} name="requested_at" type="datetime-local" value={editingLabRequest.requested_at.replace(' ', 'T')} onChange={(event) => setEditingLabRequest((current) => ({ ...current, requested_at: event.target.value }))} {...commonInput('requested_at')} required />
                                            <Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={editingLabRequest.notes ?? ''} onChange={(event) => setEditingLabRequest((current) => ({ ...current, notes: event.target.value }))} {...commonInput('notes')} />
                                            <div className="flex gap-2"><Button type="submit" loading={updateLabMut.isPending}>{t('common.save', { defaultValue: 'Save' })}</Button><Button type="button" variant="secondary" onClick={() => setEditingLabRequest(null)}>{t('actions.cancel', { ns: 'common' })}</Button></div>
                                        </form>
                                    ) : (
                                        <><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.labTest')}</p><p className="mt-1 font-semibold text-gray-900 dark:text-white">{request.lab_test_name}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.requestedAt')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{request.requested_at}</p></div>{request.notes && <div><p className="text-xs text-gray-500 dark:text-gray-400">{t('common.notes', { ns: 'common' })}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{request.notes}</p></div>}<div className="flex flex-wrap gap-2 pt-1"><Button type="button" onClick={() => startEditLabRequest(request)} disabled={!request.id}>{t('common.edit', { ns: 'common' })}</Button><Button type="button" variant="danger" onClick={() => deleteLabRequest(request)} loading={deleteLabMut.isPending && deleteLabMut.variables === request.id} disabled={!request.id}>{t('common.delete', { ns: 'common' })}</Button></div></>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={() => setLabFormOpen(true)}>{t('visits.addAnotherLabRequest')}</Button>
                        </div>
                    ) : (
                        <form onSubmit={createLabRequest} className="space-y-4"><Select label={t('visits.labTest')} name="lab_test_id" value={labRequest.lab_test_id} onChange={update(setLabRequest, 'lab_test_id')} options={tests.map((test) => ({ value: String(test.id), label: test.name }))} placeholder={t('visits.selectLabTest')} error={inputError('lab_test_id')} touched={Boolean(inputError('lab_test_id'))} required />
                            {/* <Input label={t('visits.requestedAt')} name="requested_at" type="datetime-local" value={labRequest.requested_at} onChange={update(setLabRequest, 'requested_at')} {...commonInput('requested_at')} required /> */}
                            <Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={labRequest.notes} onChange={update(setLabRequest, 'notes')} {...commonInput('notes')} /><div className="flex flex-wrap gap-2"><Button type="submit" loading={labMut.isPending}>{t('visits.requestAnalysis')}</Button>{createdLabRequests.length > 0 && <Button type="button" variant="secondary" onClick={() => setLabFormOpen(false)}>{t('actions.cancel', { ns: 'common' })}</Button>}</div></form>
                    )}
                </ActionCard>

                <ActionCard title={t('visits.createPrescription')} description={t('visits.createPrescriptionDescription')} active={activeForm === 'prescription'} onClick={() => setActiveForm(activeForm === 'prescription' ? '' : 'prescription')}>
                    {!createdPrescription?.id ? (
                        <form onSubmit={createPrescription} className="space-y-4"><Input label={t('visits.prescriptionNotes')} name="notes" as="textarea" value={prescription.notes} onChange={update(setPrescription, 'notes')} {...commonInput('notes', 'visit_id')} /><Button type="submit" loading={prescriptionMut.isPending}>{t('visits.createPrescription')}</Button>{inputError('_form') && !inputError('notes') && !inputError('visit_id') && <p className="text-xs text-red-500">{inputError('_form')}</p>}</form>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-surface-800 dark:bg-surface-800/40"><p className="text-xs text-gray-500 dark:text-gray-400">{t('visits.prescription')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">#{createdPrescription.id}{createdPrescription.notes ? ` · ${createdPrescription.notes}` : ''}</p></div>
                            {createdPrescriptionItems.map((item, index) => (
                                <div key={`${item.id ?? 'item'}-${index}`} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-surface-800 dark:bg-surface-800/40">
                                    {editingPrescriptionItem?.id === item.id ? (
                                        <form onSubmit={updatePrescriptionItem} className="space-y-4"><Input label={t('prescriptions.medicationName')} name="medication_name" value={editingPrescriptionItem.medication_name ?? ''} onChange={(event) => setEditingPrescriptionItem((current) => ({ ...current, medication_name: event.target.value }))} {...commonInput('medication_name')} required /><Input label={t('prescriptions.dosage')} name="dosage" value={editingPrescriptionItem.dosage ?? ''} onChange={(event) => setEditingPrescriptionItem((current) => ({ ...current, dosage: event.target.value }))} {...commonInput('dosage')} required /><Input label={t('prescriptions.quantity')} name="quantity_prescribed" type="number" min="1" value={editingPrescriptionItem.quantity_prescribed ?? ''} onChange={(event) => setEditingPrescriptionItem((current) => ({ ...current, quantity_prescribed: event.target.value }))} {...commonInput('quantity_prescribed')} required /><Input label={t('prescriptions.frequency')} name="frequency" value={editingPrescriptionItem.frequency ?? ''} onChange={(event) => setEditingPrescriptionItem((current) => ({ ...current, frequency: event.target.value }))} {...commonInput('frequency')} required /><Input label={t('prescriptions.duration')} name="duration" value={editingPrescriptionItem.duration ?? ''} onChange={(event) => setEditingPrescriptionItem((current) => ({ ...current, duration: event.target.value }))} {...commonInput('duration')} required /><div className="flex gap-2"><Button type="submit" loading={updateItemMut.isPending}>{t('actions.save', { ns: 'common' })}</Button><Button type="button" variant="secondary" onClick={() => setEditingPrescriptionItem(null)}>{t('actions.cancel', { ns: 'common' })}</Button></div></form>
                                    ) : (
                                        <><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('prescriptions.medicationName')}</p><p className="mt-1 font-semibold text-gray-900 dark:text-white">{item.medication_name}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('prescriptions.dosage')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.dosage}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('prescriptions.quantity')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.quantity_prescribed}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('prescriptions.frequency')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.frequency}</p></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{t('prescriptions.duration')}</p><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.duration}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><Button type="button" onClick={() => startEditPrescriptionItem(item)} disabled={!item.id}>{t('common.edit', { ns: 'common' })}</Button><Button type="button" variant="danger" onClick={() => deletePrescriptionItem(item)} loading={deleteItemMut.isPending && deleteItemMut.variables === item.id} disabled={!item.id}>{t('common.delete', { ns: 'common' })}</Button></div></>
                                    )}
                                </div>
                            ))}
                            {prescriptionItemFormOpen ? <form onSubmit={createItem} className="space-y-4 border-t border-gray-100 pt-5 dark:border-surface-800"><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('visits.addMedicationToPrescription', { id: createdPrescription.id })}</p><Input label={t('prescriptions.medicationName')} name="medication_name" value={prescriptionItem.medication_name} onChange={update(setPrescriptionItem, 'medication_name')} {...commonInput('medication_name')} required /><Input label={t('prescriptions.dosage')} name="dosage" value={prescriptionItem.dosage} onChange={update(setPrescriptionItem, 'dosage')} {...commonInput('dosage')} required /><Input label={t('prescriptions.quantity')} name="quantity_prescribed" type="number" min="1" value={prescriptionItem.quantity_prescribed} onChange={update(setPrescriptionItem, 'quantity_prescribed')} {...commonInput('quantity_prescribed')} required /><Input label={t('prescriptions.frequency')} name="frequency" value={prescriptionItem.frequency} onChange={update(setPrescriptionItem, 'frequency')} {...commonInput('frequency')} required /><Input label={t('prescriptions.duration')} name="duration" value={prescriptionItem.duration} onChange={update(setPrescriptionItem, 'duration')} {...commonInput('duration')} required /><div className="flex flex-wrap gap-2"><Button type="submit" loading={itemMut.isPending}>{t('visits.addMedication')}</Button>{createdPrescriptionItems.length > 0 && <Button type="button" variant="secondary" onClick={() => setPrescriptionItemFormOpen(false)}>{t('actions.cancel', { ns: 'common' })}</Button>}</div></form> : <Button type="button" variant="secondary" onClick={() => setPrescriptionItemFormOpen(true)}>{t('visits.addAnotherMedication')}</Button>}
                        </div>
                    )}
                </ActionCard>
            </div>

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-surface-800">
                    <div><h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('visits.medicalHistory')}</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('visits.medicalHistorySubtitle')}</p></div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">{medicalConditions.length}</span>
                </div>
                {conditionsLoading ? <div className="flex justify-center py-8"><Spinner /></div> : medicalConditions.length === 0 ? <p className="py-6 text-sm text-gray-500 dark:text-gray-400">{t('visits.noMedicalHistory')}</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{medicalConditions.map((record) => <div key={record.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-surface-800 dark:bg-surface-800/40"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold text-gray-900 dark:text-white">{record.medical_condition?.name ?? `#${record.medical_condition_id}`}</h3><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t(`medicalConditions.${record.medical_condition?.type}`, { defaultValue: record.medical_condition?.type ?? '—' })}</p></div><span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(record.diagnosed_at)}</span></div>{record.medical_condition?.notes && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{record.medical_condition.notes}</p>}{record.notes && <p className="mt-2 border-t border-gray-200 pt-2 text-sm text-gray-500 dark:border-surface-700 dark:text-gray-400">{record.notes}</p>}</div>)}</div>}
            </Card>

        </div>
    );
};

export default ActiveVisitPage;
