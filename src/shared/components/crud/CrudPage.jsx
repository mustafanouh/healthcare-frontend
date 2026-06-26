import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, PageHeader, EnhancedDataTable, Button, Modal } from '../ui';
import ResourceFormModal from './ResourceFormModal';
import { parseApiError } from '../../utils/parseApiError';

/**
 * Fully generic CRUD page.
 *
 * Props:
 *   title          - page heading
 *   addLabel       - button label ("Add doctor", ...)
 *   columns        - DataTable columns config
 *   data           - array from useList hook
 *   isLoading      - from useList
 *   fields         - ResourceFormModal fields config
 *   initialValues  - form empty state for create mode
 *   validationSchema - Yup schema (optional)
 *   onCreate       - async (values) => ... (from useCreate mutation)
 *   onUpdate       - async ({ id, payload }) => ... (from useUpdate mutation)
 *   onDelete       - async (id) => ... (from useRemove mutation)
 *   mapRecordToForm - optional (record) => form values for edit mode
 *   renderDetailsModal - optional ({ record, onClose }) => modal for row details
 *   TableComponent    - optional custom table (defaults to DataTable)
 *   isSubmitting   - create/update mutation isPending
 *   formTitle      - modal title (create and edit share one modal)
 *   formSize       - modal size: 'sm'|'md'|'lg'|'xl'
 *
 * The parent feature page just wires hooks and supplies config — zero
 * form/modal/table boilerplate needed.
 */
const CrudPage = ({
  title,
  subtitle,
  addLabel,
  columns,
  data = [],
  isLoading,
  fields = [],
  initialValues = {},
  validationSchema,
  onCreate,
  onUpdate,
  onDelete,
  mapRecordToForm,
  renderDetailsModal,
  TableComponent,
  isSubmitting = false,
  extraActions,
}) => {
  const { t } = useTranslation('common');
  const Table = TableComponent ?? EnhancedDataTable;
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const openCreate = () => { setEditRecord(null); setSubmitError(null); setFormOpen(true); };
  const openEdit   = (row) => { setEditRecord(row); setSubmitError(null); setFormOpen(true); };
  const closeForm  = () => { setFormOpen(false); setEditRecord(null); setSubmitError(null); };

  const handleSubmit = async (values) => {
    setSubmitError(null);
    try {
      if (editRecord) {
        await onUpdate?.({ id: editRecord.id, payload: values });
      } else {
        await onCreate?.(values);
      }
      closeForm();
    } catch (error) {
      setSubmitError(parseApiError(error, t('errors.generic')));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await onDelete?.(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex items-center gap-2">
            {extraActions}
            {onCreate && (
              <Button onClick={openCreate} icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }>
                {addLabel ?? t('actions.add')}
              </Button>
            )}
          </div>
        }
      />

      <Card padded={false} className="overflow-hidden">
        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          onView={renderDetailsModal ? (row) => setViewRecord(row) : undefined}
          viewLabel={t('actions.viewMore')}
          onEdit={onUpdate ? openEdit : undefined}
          onDelete={onDelete ? (row) => setDeleteTarget(row) : undefined}
        />
      </Card>

      {/* Create / Edit modal */}
      <ResourceFormModal
        open={formOpen}
        onClose={closeForm}
        title={editRecord ? t('actions.edit') : (addLabel ?? t('actions.add'))}
        fields={fields}
        initialValues={initialValues}
        record={editRecord ? (mapRecordToForm?.(editRecord) ?? editRecord) : null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        validationSchema={validationSchema}
        submitError={submitError}
      />

      {viewRecord && renderDetailsModal?.({
        record: viewRecord,
        onClose: () => setViewRecord(null),
      })}

      {/* Delete confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={t('actions.delete')}
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('errors.generic')}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('actions.delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CrudPage;
