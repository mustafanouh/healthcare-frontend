import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../../../shared/components/ui';
import { useLogoutMutation } from '../hooks/useAuthMutations';

/**
 * Logout button with confirmation modal.
 * Drop this into the Navbar / Sidebar.
 */
const LogoutButton = ({ className }) => {
  const { t } = useTranslation('auth');
  const [open, setOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
        }
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {t('logout.label')}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t('logout.confirmTitle')} size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('logout.confirmMessage')}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t('actions.cancel', { ns: 'common' })}
          </Button>
          <Button
            variant="danger"
            loading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {t('logout.label')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LogoutButton;
