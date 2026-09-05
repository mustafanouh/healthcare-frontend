
import { useState } from 'react';
import clsx from 'clsx';

/**
 * Generic text input, designed to plug directly into Formik:
 *
 *   <Input
 *     label={t('login.password')}
 *     name="password"
 *     type="password"
 *     formik={formik}
 *   />
 *
 * Password inputs automatically get a show/hide password button.
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
  as,
  className,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
  const Element = as || 'input';

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

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

      <div className="relative">
        <Element
          id={name}
          name={name}
          type={as === 'textarea' ? undefined : inputType}
          dir={dir}
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg border text-sm',
            'bg-white dark:bg-surface-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors',
            isPassword && 'pr-11',
            showError
              ? 'border-red-400 dark:border-red-500'
              : 'border-gray-200 dark:border-surface-700',
            className
          )}
          {...fieldProps}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2',
              dir === 'rtl' ? 'left-3' : 'right-3',
              'flex items-center justify-center',
              'text-gray-400 hover:text-gray-600',
              'dark:text-gray-500 dark:hover:text-gray-300',
              'focus:outline-none',
              'transition-colors'
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye off
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.584 10.587a2 2 0 002.829 2.829"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.88 4.24A9.8 9.8 0 0112 4c5 0 8.5 4 9.5 8a11.5 11.5 0 01-4.18 5.39"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.61 6.61C4.56 8.06 3.28 10.05 2.5 12c.65 1.63 1.67 3.28 3.39 4.56A9.85 9.85 0 0012 20c1.61 0 3.13-.4 4.47-1.1"
                />
              </svg>
            ) : (
              // Eye
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {showError && (
        <p className="mt-1.5 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};

export default Input;
