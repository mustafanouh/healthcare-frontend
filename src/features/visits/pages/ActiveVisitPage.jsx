import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVisit, useCompleteVisit } from '../hooks/useVisits';
import { useCreateDiagnosis } from '../hooks/useDiagnoses';
import { useCreatePrescription } from '../../prescriptions/hooks/usePrescriptions';
import { useCreatePrescriptionItem } from '../../prescriptions/hooks/usePrescriptionItems';
import { useCreateLabRequestItem } from '../../lab-results/hooks/useLabRequestItems';
import { useLabTests } from '../../lab-tests/hooks/useLabTests';
import { usePatient } from '../../patient/hooks/usePatients';
import { usePatientMedicalConditions } from '../../patient/hooks/usePatientMedicalConditions';
import { Badge, Button, Card, Input, Select, Spinner } from '../../../shared/components/ui';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';

const EMPTY_ERRORS = {};

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

    const diagnosisMut = useCreateDiagnosis();
    const prescriptionMut = useCreatePrescription();
    const itemMut = useCreatePrescriptionItem();
    const labMut = useCreateLabRequestItem();
    const completeMut = useCompleteVisit();
    const [activeForm, setActiveForm] = useState('');
    const [diagnosis, setDiagnosis] = useState({ diagnosis_code: '', description: '', diagnosis_type: 'primary', notes: '' });
    const [prescription, setPrescription] = useState({ notes: '' });
    const [prescriptionItem, setPrescriptionItem] = useState({ prescription_id: '', medication_name: '', dosage: '', quantity_prescribed: '', frequency: '', duration: '' });
    const [labRequest, setLabRequest] = useState({ lab_test_id: '', requested_at: '', notes: '' });
    const [errors, setErrors] = useState(EMPTY_ERRORS);
    const [success, setSuccess] = useState('');
    const [createdPrescription, setCreatedPrescription] = useState(null);

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

    const createDiagnosis = (event) => { event.preventDefault(); submit(diagnosisMut, { ...diagnosis, visit_id: Number(id) }, 'Diagnosis', () => setDiagnosis({ diagnosis_code: '', description: '', diagnosis_type: 'primary', notes: '' })); };
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
            }
        );
    };
    const createItem = (event) => { event.preventDefault(); submit(itemMut, { ...prescriptionItem, prescription_id: Number(prescriptionItem.prescription_id), quantity_prescribed: Number(prescriptionItem.quantity_prescribed) }, 'Prescription item', () => setPrescriptionItem((current) => ({ ...current, medication_name: '', dosage: '', quantity_prescribed: '', frequency: '', duration: '' }))); };
    const createLabRequest = (event) => { event.preventDefault(); submit(labMut, { ...labRequest, visit_id: Number(id), lab_test_id: Number(labRequest.lab_test_id), requested_at: labRequest.requested_at.replace('T', ' ') }, 'Lab request', () => setLabRequest({ lab_test_id: '', requested_at: '', notes: '' })); };
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
                    <form onSubmit={createDiagnosis} className="space-y-4"><Input label={t('visits.diagnosisCode')} name="diagnosis_code" value={diagnosis.diagnosis_code} onChange={update(setDiagnosis, 'diagnosis_code')} {...commonInput('diagnosis_code')} required /><Input label={t('visits.description')} name="description" value={diagnosis.description} onChange={update(setDiagnosis, 'description')} {...commonInput('description')} required /><Select label={t('visits.formType')} name="diagnosis_type" value={diagnosis.diagnosis_type} onChange={update(setDiagnosis, 'diagnosis_type')} options={[{ value: 'primary', label: t('visits.primary') }, { value: 'secondary', label: t('visits.secondary') }]} error={inputError('diagnosis_type')} touched={Boolean(inputError('diagnosis_type'))} /><Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={diagnosis.notes} onChange={update(setDiagnosis, 'notes')} {...commonInput('notes')} /><Button type="submit" loading={diagnosisMut.isPending}>{t('visits.saveDiagnosis')}</Button></form>
                </ActionCard>

                <ActionCard title={t('visits.requestLabAnalysis')} description={t('visits.requestLabAnalysisDescription')} active={activeForm === 'lab'} onClick={() => setActiveForm(activeForm === 'lab' ? '' : 'lab')}>
                    <form onSubmit={createLabRequest} className="space-y-4"><Select label={t('visits.labTest')} name="lab_test_id" value={labRequest.lab_test_id} onChange={update(setLabRequest, 'lab_test_id')} options={tests.map((test) => ({ value: String(test.id), label: test.name }))} placeholder={t('visits.selectLabTest')} error={inputError('lab_test_id')} touched={Boolean(inputError('lab_test_id'))} required /><Input label={t('visits.requestedAt')} name="requested_at" type="datetime-local" value={labRequest.requested_at} onChange={update(setLabRequest, 'requested_at')} {...commonInput('requested_at')} required /><Input label={t('common.notes', { ns: 'common' })} name="notes" as="textarea" value={labRequest.notes} onChange={update(setLabRequest, 'notes')} {...commonInput('notes')} /><Button type="submit" loading={labMut.isPending}>{t('visits.requestAnalysis')}</Button></form>
                </ActionCard>

                <ActionCard title={t('visits.createPrescription')} description={t('visits.createPrescriptionDescription')} active={activeForm === 'prescription'} onClick={() => setActiveForm(activeForm === 'prescription' ? '' : 'prescription')}>
                    <form onSubmit={createPrescription} className="space-y-4"><Input label={t('visits.prescriptionNotes')} name="notes" as="textarea" value={prescription.notes} onChange={update(setPrescription, 'notes')} {...commonInput('notes', 'visit_id')} /><Button type="submit" loading={prescriptionMut.isPending}>{t('visits.createPrescription')}</Button>{inputError('_form') && !inputError('notes') && !inputError('visit_id') && <p className="text-xs text-red-500">{inputError('_form')}</p>}</form>
                    {(createdPrescription?.id || prescriptionItem.prescription_id) && <form onSubmit={createItem} className="mt-6 space-y-4 border-t border-gray-100 pt-5 dark:border-surface-800"><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('visits.addMedicationToPrescription', { id: prescriptionItem.prescription_id })}</p><Input label={t('prescriptions.medicationName')} name="medication_name" value={prescriptionItem.medication_name} onChange={update(setPrescriptionItem, 'medication_name')} {...commonInput('medication_name')} required /><Input label={t('prescriptions.dosage')} name="dosage" value={prescriptionItem.dosage} onChange={update(setPrescriptionItem, 'dosage')} {...commonInput('dosage')} required /><Input label={t('prescriptions.quantity')} name="quantity_prescribed" type="number" min="1" value={prescriptionItem.quantity_prescribed} onChange={update(setPrescriptionItem, 'quantity_prescribed')} {...commonInput('quantity_prescribed')} required /><Input label={t('prescriptions.frequency')} name="frequency" value={prescriptionItem.frequency} onChange={update(setPrescriptionItem, 'frequency')} {...commonInput('frequency')} required /><Input label={t('prescriptions.duration')} name="duration" value={prescriptionItem.duration} onChange={update(setPrescriptionItem, 'duration')} {...commonInput('duration')} required /><Button type="submit" loading={itemMut.isPending}>{t('visits.addMedication')}</Button></form>}
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
