import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from 'react-toastify';
import { Order_Payment, Payment } from '../../typesAndValidators';
import { useQueryClient } from '@tanstack/react-query';

type ShowToastOptions = ('insert' | 'update' | 'delete')[];

export const useSubscribeToTable = <T extends Record<string, unknown>>({
    tableName,
    initialData,
    showToast = [],
}: {
    tableName: string;
    initialData: T[];
    showToast?: ShowToastOptions;
}) => {
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        // Set up the subscription with a filter
        const channel = supaClient
            .channel(tableName + '-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: tableName,
                },
                (payload) => {
                    const eventType = payload.eventType;
                    const newData = payload.new as T;
                    const oldData = payload.old;
                    const rowID = Object.entries(oldData)[0];
                    const rowIDField = rowID[0] as keyof T;
                    const rowIDValue = rowID[1];
                    // console.log(`Change detected in ${tableName}:`, payload);
                    setData((currentData) => {
                        switch (eventType) {
                            case 'INSERT':
                                if (showToast.includes('insert')) {
                                    toast.info(`A new record was added in ${tableName}s table`);
                                }
                                return [...currentData, newData];
                            case 'UPDATE':
                                if (showToast.includes('update')) {
                                    toast.info(`A record was updated in ${tableName}s table`);
                                }
                                return currentData.map((item) => {
                                    if (item[rowIDField] === rowIDValue) {
                                        // loop through each field and update the value
                                        Object.entries(newData).forEach(([key, value]) => {
                                            (item as Record<string, unknown>)[key] = value;
                                        });
                                    }
                                    return item;
                                });
                            case 'DELETE':
                                if (showToast.includes('delete')) {
                                    toast.info(`A record was deleted from ${tableName}s table`);
                                }
                                return currentData.filter((item) => item[rowIDField] !== rowIDValue);
                            default:
                                return currentData;
                        }
                    });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
    }, [tableName, showToast]);

    return data;
};

// custom solution since Order_Payments has to subscribe to both Order and Payment
export const useSubscribeToPayments = (orders: Order_Payment[], queryKey: string[]) => {
    const [updatedOrders, setUpdatedOrders] = useState<Order_Payment[]>([]);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (orders) {
            setUpdatedOrders(orders);
        }
    }, [orders]);

    useEffect(() => {
        const paymentChannel = supaClient
            .channel('payment-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Payment',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    const newPayment = payload.new as Payment;
                    const oldPayment = payload.old as Payment;

                    // console.log(`Change detected in Payment:`, payload);

                    setUpdatedOrders((currentOrders) => {
                        // probably improve this by searching for the order and then updating that order.payments
                        return currentOrders.map((order) => {
                            // Skip orders that aren't affected by this event
                            if (newPayment?.order_id !== order.order_id && eventType !== 'DELETE') {
                                return order;
                            }

                            // Ensure the `payments` array exists
                            const payments = order.payments || [];

                            if (eventType === 'INSERT') {
                                // Add the new payment to the payments list
                                return {
                                    ...order,
                                    payments: [...payments, newPayment],
                                };
                            }

                            if (eventType === 'UPDATE') {
                                // Update the existing payment
                                return {
                                    ...order,
                                    payments: payments.map((payment) =>
                                        payment.payment_id === newPayment.payment_id ? newPayment : payment,
                                    ),
                                };
                            }

                            if (eventType === 'DELETE' && oldPayment) {
                                // Remove the deleted payment
                                return {
                                    ...order,
                                    payments: payments.filter(
                                        (payment) => payment.payment_id !== oldPayment.payment_id,
                                    ),
                                };
                            }

                            // If no changes are needed, return the original order
                            return order;
                        });

                        //                         if (eventType === 'INSERT' || eventType === 'UPDATE') {
                        //                             if (!order.payments) order.payments = [];
                        //                             if (newPayment && newPayment.order_id === order.order_id) {
                        //                                 // Insert or update the payment in the payments list
                        //                                 const updatedPayments =
                        //                                     eventType === 'INSERT'
                        //                                         ? [...order.payments, newPayment]
                        //                                         : order.payments.map((payment) =>
                        //                                               payment.payment_id === newPayment.payment_id ? newPayment : payment,
                        //                                           );
                        //                                 order.payments = updatedPayments;
                        //                             }
                        //                         } else if (eventType === 'DELETE') {
                        //                             // Remove deleted payment from the order's payments
                        //                             order.payments = order.payments.filter(
                        //                                 (payment) => payment.payment_id !== oldPayment.payment_id,
                        //                             );
                        //                         }
                        //                         return order;
                        //                     });
                    });

                    queryClient.invalidateQueries({ queryKey });
                },
            )
            .subscribe();

        return () => {
            paymentChannel.unsubscribe();
        };
    }, [orders]);

    return updatedOrders;
};
