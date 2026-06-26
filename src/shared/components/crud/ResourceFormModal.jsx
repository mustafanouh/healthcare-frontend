import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Select, Button } from '../ui';

/**
 * Generic create/edit form rendered inside a Modal, driven by a `fields` config:
 *
 *   fields = [
 *     { name: 'name', label: t('common.name'), type: 'text' },
 *     { name: 'gender', label: '...', type: 'select', options: [...] },
 *   ]
 *
 * `initialValues` seeds the form for create mode; pass `record` for edit mode
 * (its values are merged over initialValues).
 */
const ResourceFormModal = ({
  open,
  onClose,
  title,
  fields = [],
  initialValues = {},
  record = null,
  onSubmit,
  isSubmitting = false,
  validationSchema,
  submitError,
}) => {
  const { t } = useTranslation('common');

  const formik = useFormik({
    initialValues: { ...initialValues, ...(record || {}) },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => onSubmit(values),
  });

  // Re-seed form values whenever the record being edited changes
  useEffect(() => {
    formik.setValues({ ...initialValues, ...(record || {}) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, open]);

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => {
            if (field.createOnly && record) return null;
            if (field.editOnly && !record) return null;

            if (field.type === 'select') {
              return (
                <Select
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  formik={formik}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  className={field.fullWidth ? 'sm:col-span-2' : ''}
                />
              );
            }
            return (
              <div key={field.name} className={field.fullWidth ? 'sm:col-span-2' : ''}>
                <Input
                  label={field.label}
                  name={field.name}
                  type={field.type || 'text'}
                  formik={formik}
                  dir={field.dir}
                  as={field.as}
                  placeholder={field.placeholder}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t('actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceFormModal;
