import clsx from 'clsx';

/**
 * Generic text input, designed to plug directly into Formik:
 *
 *   <Input
 *     label={t('login.email')}
 *     name="email"
 *     type="email"
 *     formik={formik}
 *   />
 *
 * Pass `formik` to automatically wire value/onChange/onBlur/error,
 * or use it as a plain controlled input via value/onChange.
 */
const Input = ({
  label,
  name,
  type = 'text',
  formik,
  value,
  onChange,
  onBlur,
  error,
  touched,
  dir,
  className,
  ...rest
}) => {
  const fieldProps = formik
    ? {
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
      }
    : { value, onChange, onBlur };

  const fieldError = formik ? formik.errors[name] : error;
  const fieldTouched = formik ? formik.touched[name] : touched;
  const showError = fieldTouched && fieldError;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        dir={dir}
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg border text-sm',
          'bg-white dark:bg-surface-800',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors',
          showError
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-200 dark:border-surface-700',
          className
        )}
        {...fieldProps}
        {...rest}
      />
      {showError && (
        <p className="mt-1.5 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};

export default Input;
