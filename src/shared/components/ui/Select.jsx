import clsx from 'clsx';

/**
 * Generic select dropdown. `options` is an array of { value, label }.
 *
 *   <Select
 *     label={t('register.gender')}
 *     name="gender"
 *     formik={formik}
 *     options={[{ value: 'male', label: t('register.male') }, ...]}
 *   />
 */
const Select = ({
  label,
  name,
  formik,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options = [],
  placeholder,
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
      <select
        id={name}
        name={name}
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg border text-sm',
          'bg-white dark:bg-surface-800',
          'text-gray-900 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors',
          showError
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-200 dark:border-surface-700',
          className
        )}
        {...fieldProps}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError && (
        <p className="mt-1.5 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};

export default Select;
