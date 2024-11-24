import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from 'react-toastify';
import { Order_Payment, Payment } from '../../typesAndValidators';

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
                    console.log(`Change detected in ${tableName}:`, payload);
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
export const useSubscribeToPayments = (orders: Order_Payment[]) => {
    const [updatedOrders, setUpdatedOrders] = useState<Order_Payment[]>([]);

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

                    console.log(`Change detected in Payment:`, payload);

                    setUpdatedOrders((currentOrders) => {
                        return currentOrders.map((order) => {
                            if (eventType === 'INSERT' || eventType === 'UPDATE') {
                                if (!order.payments) order.payments = [];
                                if (newPayment && newPayment.order_id === order.order_id) {
                                    // Insert or update the payment in the payments list
                                    const updatedPayments =
                                        eventType === 'INSERT'
                                            ? [...order.payments, newPayment]
                                            : order.payments.map((payment) =>
                                                  payment.payment_id === newPayment.payment_id ? newPayment : payment,
                                              );
                                    order.payments = updatedPayments;
                                }
                            } else if (eventType === 'DELETE') {
                                // Remove deleted payment from the order's payments
                                order.payments = order.payments.filter(
                                    (payment) => payment.payment_id !== oldPayment.payment_id,
                                );
                            }
                            return order;
                        });
                    });
                },
            )
            .subscribe();

        return () => {
            paymentChannel.unsubscribe();
        };
    }, [orders]);

    return updatedOrders;
};
