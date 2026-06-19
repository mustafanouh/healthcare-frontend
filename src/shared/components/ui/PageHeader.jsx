/**
 * Standard page header with title, subtitle and trailing action slot.
 *
 *   <PageHeader title={t('dashboard:appointments.title')} action={<Button>...</Button>} />
 */
const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
