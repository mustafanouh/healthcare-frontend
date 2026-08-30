import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResourceFormModal from '../../../shared/components/crud/ResourceFormModal';
import { parseApiError } from '../../../shared/utils/parseApiError';

const AddLabResultModal = ({ open, requestItem, onClose, onSubmit, isSubmitting }) => {
    const { t } = useTranslation(['dashboard', 'common']);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (values) => {
        setSubmitError(null);
        try {
            await onSubmit({
                lab_request_item_id: Number(requestItem.id),
                notes: values.notes,
                value: Number(values.value),
            });
            onClose();
        } catch (error) {
            setSubmitError(parseApiError(error, t('errors.generic', { ns: 'common' })));
        }
    };

    return (
        <ResourceFormModal
            open={open}
            onClose={onClose}
            title={t('labResults.addForRequest')}
            fields={[
                { name: 'value', label: t('labResults.value'), type: 'number', dir: 'ltr', required: true },
                { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
            ]}
            initialValues={{ value: '', notes: '' }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />
    );
};

export default AddLabResultModal;