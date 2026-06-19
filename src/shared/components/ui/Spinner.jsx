import clsx from 'clsx';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

const Spinner = ({ size = 'md', className, fullScreen = false }) => {
  const spinner = (
    <div
      className={clsx(
        'border-blue-600 border-t-transparent rounded-full animate-spin',
        SIZES[size],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
