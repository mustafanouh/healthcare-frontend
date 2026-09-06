
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import {
    Modal,
    Button,
    Spinner,
    Input,
} from '../../../shared/components/ui';

import { usePrescriptionItems } from '../hooks/usePrescriptions';
import { useCreateDispensing } from '../../dispensings/hooks/useDispensings';

import {
    formatDateTime,
} from '../../../shared/utils/formatters';

import { parseApiError } from '../../../shared/utils/parseApiError';

const DetailRow = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400 dark:text-gray-500">
            {label}
        </dt>

        <dd
            className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${
                dir === 'ltr' ? 'dir-ltr text-start' : ''
            }`}
        >
            {value || '—'}
        </dd>
    </div>
);

const PrescriptionDetailsModal = ({
    open,
    prescription,
    onClose,
    canDispense = false,
}) => {
    const { t } = useTranslation(['dashboard', 'common']);

    const queryClient = useQueryClient();

    const createDispensing = useCreateDispensing();

    const [quantities, setQuantities] = useState({});
    const [dispensingItemId, setDispensingItemId] = useState(null);
    const [dispensingError, setDispensingError] = useState(null);
    const [dispensingSuccess, setDispensingSuccess] = useState(null);

    const {
        data: response,
        isLoading,
        isError,
    } = usePrescriptionItems(
        prescription?.id,
        {
            enabled: open && !!prescription?.id,
        }
    );

    if (!prescription) {
        return null;
    }

    /*
     * API response:
     *
     * {
     *   id: 1,
     *   quantity_prescribed: "20",
     *   dispensings_sum_quantity_dispensed: "10",
     *   remaining_quantity: 10
     * }
     */

    const rawItems = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
            ? response
            : response?.data
                ? [response.data]
                : [];

    const items = rawItems;

    const patientName =
        prescription.visit?.patient?.profile?.full_name;

    const handleDispense = async (item) => {
        if (!canDispense) {
            return;
        }

        const remainingQuantity = Number(
            item.remaining_quantity ?? 0
        );

        const quantity = Number(
            quantities[item.id] ?? remainingQuantity
        );

        // No remaining quantity
        if (remainingQuantity <= 0) {
            setDispensingError(
                'No remaining quantity available for dispensing.'
            );
            return;
        }

        // Invalid quantity
        if (
            !Number.isFinite(quantity) ||
            quantity < 1
        ) {
            setDispensingError(
                'Please enter a valid dispensing quantity.'
            );
            return;
        }

        // Cannot dispense more than remaining quantity
        if (quantity > remainingQuantity) {
            setDispensingError(
                `Dispensed quantity cannot exceed remaining quantity (${remainingQuantity}).`
            );
            return;
        }

        setDispensingItemId(item.id);
        setDispensingError(null);
        setDispensingSuccess(null);

        try {
            /*
             * API expects ONLY:
             *
             * {
             *   prescription_item_id: 1,
             *   quantity_dispensed: 10
             * }
             */
            await createDispensing.mutateAsync({
                prescription_item_id: Number(item.id),
                quantity_dispensed: quantity,
            });

            /*
             * Refresh prescription items after dispensing
             */
            await queryClient.invalidateQueries({
                queryKey: [
                    'prescriptions',
                    'items',
                    prescription.id,
                ],
            });

            /*
             * Refresh prescriptions list because
             * prescription status may change to:
             * partial / dispensed
             */
            await queryClient.invalidateQueries({
                queryKey: ['prescriptions'],
            });

            /*
             * Clear entered quantity
             */
            setQuantities((current) => ({
                ...current,
                [item.id]: '',
            }));
            setDispensingSuccess(
                quantity === remainingQuantity
                    ? t('prescriptions.dispensingSuccessComplete')
                    : t('prescriptions.dispensingSuccessPartial', {
                        quantity,
                        remaining: remainingQuantity - quantity,
                    })
            );
        } catch (error) {
            setDispensingSuccess(null);
            setDispensingError(
                parseApiError(
                    error,
                    t('errors.generic', {
                        ns: 'common',
                    })
                )
            );
        } finally {
            setDispensingItemId(null);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t('prescriptions.detailsTitle', {
                id: prescription.id,
            })}
            size="xl"
        >
            <div className="space-y-6">

                {/* Prescription information */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <DetailRow
                        label={t('prescriptions.visitId')}
                        value={prescription.visit_id}
                        dir="ltr"
                    />

                    <DetailRow
                        label={t('prescriptions.patient')}
                        value={patientName}
                    />

                    <DetailRow
                        label={t('common.status', {
                            ns: 'common',
                        })}
                        value={
                            prescription.status
                                ? t(
                                    `status.${prescription.status}`,
                                    {
                                        ns: 'common',
                                        defaultValue:
                                            prescription.status,
                                    }
                                )
                                : null
                        }
                    />

                </div>

                {/* Notes */}
                {prescription.notes && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100">

                        <p className="text-xs font-medium text-blue-600 dark:text-blue-300">
                            {t('common.notes', {
                                ns: 'common',
                            })}
                        </p>

                        <p className="mt-1">
                            {prescription.notes}
                        </p>

                    </div>
                )}

                {/* Prescription items */}
                <section
                    className={
                        canDispense
                            ? ''
                            : 'prescription-read-only'
                    }
                >

                    <div className="mb-4 flex items-center justify-between">

                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {t('prescriptions.items')}
                        </h3>

                        {isLoading && (
                            <Spinner size="sm" />
                        )}

                    </div>

                    {/* Loading / Error */}
                    {isError && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
                            {t('errors.generic', {
                                ns: 'common',
                            })}
                        </p>
                    )}

                    {/* Empty */}
                    {!isLoading &&
                        !isError &&
                        !items.length && (
                            <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-400 dark:bg-surface-800">
                                {t('actions.noData', {
                                    ns: 'common',
                                })}
                            </p>
                        )}

                    {/* Items table */}
                    {!isError &&
                        items.length > 0 && (
                            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-surface-800">

                                <table className="w-full text-sm">

                                    <thead>
                                        <tr className="bg-gray-50 text-start dark:bg-surface-800">

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t(
                                                    'prescriptions.medicationName'
                                                )}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t(
                                                    'prescriptions.dosage'
                                                )}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t(
                                                    'prescriptions.quantity'
                                                )}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t('prescriptions.dispensed')}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t('prescriptions.remaining')}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t(
                                                    'prescriptions.frequency'
                                                )}
                                            </th>

                                            <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                {t(
                                                    'prescriptions.duration'
                                                )}
                                            </th>

                                            {canDispense && (
                                                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">
                                                    {t(
                                                        'pharmacist.dispenseNow'
                                                    )}
                                                </th>
                                            )}

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100 dark:divide-surface-800">

                                        {items.map((item) => {

                                            const prescribedQuantity =
                                                Number(
                                                    item.quantity_prescribed ?? 0
                                                );

                                            const dispensedQuantity =
                                                Number(
                                                    item.dispensings_sum_quantity_dispensed ?? 0
                                                );

                                            const remainingQuantity =
                                                Number(
                                                    item.remaining_quantity ??
                                                    Math.max(
                                                        prescribedQuantity -
                                                        dispensedQuantity,
                                                        0
                                                    )
                                                );

                                            const isFullyDispensed =
                                                remainingQuantity <= 0;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={
                                                        isFullyDispensed
                                                            ? 'bg-gray-50/50 dark:bg-surface-900/30'
                                                            : ''
                                                    }
                                                >

                                                    {/* Medication */}
                                                    <td className="px-4 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                                                        {item.medication_name ||
                                                            '—'}
                                                    </td>

                                                    {/* Dosage */}
                                                    <td className="px-4 py-3.5">
                                                        {item.dosage || '—'}
                                                    </td>

                                                    {/* Prescribed */}
                                                    <td
                                                        className="px-4 py-3.5"
                                                        dir="ltr"
                                                    >
                                                        {prescribedQuantity}
                                                    </td>

                                                    {/* Dispensed */}
                                                    <td
                                                        className="px-4 py-3.5"
                                                        dir="ltr"
                                                    >
                                                        {dispensedQuantity}
                                                    </td>

                                                    {/* Remaining */}
                                                    <td
                                                        className="px-4 py-3.5 font-semibold"
                                                        dir="ltr"
                                                    >
                                                        {remainingQuantity}
                                                    </td>

                                                    {/* Frequency */}
                                                    <td className="px-4 py-3.5">
                                                        {item.frequency || '—'}
                                                    </td>

                                                    {/* Duration */}
                                                    <td
                                                        className="px-4 py-3.5"
                                                        dir="ltr"
                                                    >
                                                        {item.duration || '—'}
                                                    </td>

                                                    {/* Dispense */}
                                                    {canDispense && (
                                                        <td className="px-4 py-3.5">

                                                            {isFullyDispensed ? (
                                                                <span className="text-xs font-medium text-gray-400">
                                                                    Fully dispensed
                                                                </span>
                                                            ) : (
                                                                <div className="flex min-w-[190px] items-end gap-2">

                                                                    <Input
                                                                        aria-label={t(
                                                                            'prescriptions.dispenseQuantity'
                                                                        )}
                                                                        type="number"
                                                                        min="1"
                                                                        max={remainingQuantity}
                                                                        dir="ltr"
                                                                        value={
                                                                            quantities[item.id] ??
                                                                            remainingQuantity
                                                                        }
                                                                        onChange={(event) => {

                                                                            setQuantities(
                                                                                (
                                                                                    current
                                                                                ) => ({
                                                                                    ...current,
                                                                                    [item.id]:
                                                                                        event.target.value,
                                                                                })
                                                                            );

                                                                            setDispensingError(
                                                                                null
                                                                            );
                                                                        }}
                                                                        className="min-w-0"
                                                                    />

                                                                    <Button
                                                                        size="sm"
                                                                        variant="success"
                                                                        loading={
                                                                            dispensingItemId ===
                                                                            item.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleDispense(
                                                                                item
                                                                            )
                                                                        }
                                                                    >
                                                                        {t(
                                                                            'pharmacist.dispenseNow'
                                                                        )}
                                                                    </Button>

                                                                </div>
                                                            )}

                                                        </td>
                                                    )}

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    {/* Dispensing error */}
                    {dispensingError && (
                        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
                            {dispensingError}
                        </p>
                    )}

                    {dispensingSuccess && (
                        <p className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
                            {dispensingSuccess}
                        </p>
                    )}

                </section>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-400 dark:border-surface-800 sm:grid-cols-2">

                    <span>
                        {t('common.createdAt', {
                            ns: 'common',
                        })}
                        :{' '}
                        {formatDateTime(
                            prescription.created_at
                        )}
                    </span>

                    <span>
                        {t('common.updatedAt', {
                            ns: 'common',
                        })}
                        :{' '}
                        {formatDateTime(
                            prescription.updated_at
                        )}
                    </span>

                </div>

                {/* Close */}
                <div className="flex justify-end">

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        {t('actions.close', {
                            ns: 'common',
                        })}
                    </Button>

                </div>

            </div>
        </Modal>
    );
};

export default PrescriptionDetailsModal;
