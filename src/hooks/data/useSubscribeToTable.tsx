import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from 'react-toastify';
import { Order, Order_Payment, Payment } from '../../typesAndValidators';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

type ShowToastOptions = ('insert' | 'update' | 'delete')[];

export const useSubscribeToTable = <T extends Record<string, unknown>>({
    tableName,
    initialData,
    primaryKeys,
    queryKey,
    showToast = [],
}: {
    tableName: string;
    initialData: T[];
    primaryKeys: (keyof T)[];
    queryKey: string[];
    showToast?: ShowToastOptions;
}) => {
    const [data, setData] = useState<T[]>([]);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        const isMatch = (a: T, b: T) => {
            return primaryKeys.every((key) => a[key] === b[key]);
        };

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
                    const oldData = payload.old as T;
                    setData((currentData) => {
                        switch (eventType) {
                            case 'INSERT':
                                if (showToast.includes('insert')) {
                                    toast.info(`A new record was added in ${tableName}s table`, {
                                        onClick: () => {
                                            // toast.info(JSON.stringify(payload, null, 2), {
                                            //     autoClose: false,
                                            //     closeOnClick: true,
                                            // });
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                    });
                                }
                                return [...currentData, newData];
                            case 'UPDATE':
                                if (showToast.includes('update')) {
                                    toast.info(`A record was updated in ${tableName}s table`, {
                                        onClick: () => {
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                    });
                                }
                                return currentData.map((item) => {
                                    if (isMatch(item, newData)) {
                                        return newData;
                                    }
                                    return item;
                                });
                            // TODO: give access to all orders to all drivers (otherwise they can't see updates to orders)
                            case 'DELETE':
                                if (showToast.includes('delete')) {
                                    toast.info(`A record was deleted from ${tableName}s table`, {
                                        onClick: () => {
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                    });
                                }
                                return currentData.filter((item) => !isMatch(item, oldData));
                            // return currentData.filter((item) => item[rowIDField] !== rowIDValue);
                            default:
                                return currentData;
                        }
                    });
                    queryClient.invalidateQueries({ queryKey });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
    }, [tableName, showToast, primaryKeys, queryClient, queryKey]);

    return data;
};

const getAllDaysOrders = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    console.log('getAllDaysOrders');
    const formattedDate = businessDate.format('YYYY-MM-DD');
    const { data, error } = await supaClient
        .from('Order')
        .select(
            `
        *,
        payments:Payment (
          *
        )
      `,
        )
        .eq('business_date', formattedDate)
        .order('order_number', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Order_Payment[];
};

export const useSubscribeToOrderPayments = ({
    businessDate,
    showToast,
}: {
    businessDate: dayjs.Dayjs;
    showToast?: ShowToastOptions;
}) => {
    const { data: initialOrderData } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysOrders({ businessDate }),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });

    const [data, setData] = useState<Order_Payment[]>([]);

    useEffect(() => {
        if (initialOrderData) {
            setData(initialOrderData);
        }
    }, [initialOrderData]);

    const queryClient = useQueryClient();

    useEffect(() => {
        // Set up the subscription with a filter
        const channel = supaClient
            .channel('order-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Order',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    setData((currentData) => {
                        switch (eventType) {
                            case 'INSERT': {
                                if (showToast?.includes('insert')) {
                                    toast.info(`A new record was added in Orders table`, {
                                        onClick: () => {
                                            // toast.info(JSON.stringify(payload, null, 2), {
                                            //     autoClose: false,
                                            //     closeOnClick: true,
                                            // });
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                    });
                                }
                                const newData = { ...(payload.new as Order), payments: [] as Payment[] };
                                return [...currentData, newData];
                            }
                            case 'UPDATE': {
                                if (showToast?.includes('update')) {
                                    toast.info(
                                        `Order ${payload.new.order_number || payload.new.order_name} was updated`,
                                        {
                                            onClick: () => {
                                                toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                    autoClose: false,
                                                    closeOnClick: true,
                                                });
                                            },
                                        },
                                    );
                                }
                                return currentData.map((item) => {
                                    const newOrder = payload.new as Order;
                                    if (item.order_id === newOrder.order_id) {
                                        // update the order part of the item
                                        return { ...item, ...newOrder };
                                    }
                                    return item;
                                });
                            }
                            // TODO: give access to all orders to all drivers (otherwise they can't see updates to orders)
                            case 'DELETE': {
                                if (showToast?.includes('delete')) {
                                    toast.info(`A record was deleted from Orders table`, {
                                        onClick: () => {
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                    });
                                }
                                const orderID = (payload.old as Order).order_id;
                                return currentData.filter((item) => item.order_id !== orderID);
                            }
                            // return currentData.filter((item) => item[rowIDField] !== rowIDValue);
                            default:
                                return currentData;
                        }
                    });
                    queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
    }, [businessDate, showToast, queryClient]);

    // Effect for payments
    useEffect(() => {
        // Set up the subscription with a filter
        const channel = supaClient
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
                    const oldPaymentID = payload.old ? (payload.old as Payment).payment_id : null;

                    setData((currentData) => {
                        return currentData.map((order) => {
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

                            if (eventType === 'DELETE' && oldPaymentID) {
                                // Remove the deleted payment
                                return {
                                    ...order,
                                    payments: payments.filter((payment) => payment.payment_id !== oldPaymentID),
                                };
                            }

                            // If no changes are needed, return the original order
                            return order;
                        });
                    });
                    queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
    }, [businessDate, showToast, queryClient]);

    return data;
};

// custom solution since Order_Payments has to subscribe to both Order and Payment
// export const useSubscribeToPayments = (orders: Order_Payment[], queryKey: string[]) => {
//     const [updatedOrders, setUpdatedOrders] = useState<Order_Payment[]>([]);

//     const queryClient = useQueryClient();

//     useEffect(() => {
//         if (orders) {
//             setUpdatedOrders(orders);
//         }
//     }, [orders]);

//     useEffect(() => {
//         const paymentChannel = supaClient
//             .channel('payment-changes')
//             .on(
//                 'postgres_changes',
//                 {
//                     event: '*',
//                     schema: 'public',
//                     table: 'Payment',
//                 },
//                 (payload) => {
//                     const eventType = payload.eventType;
//                     const newPayment = payload.new as Payment;
//                     const oldPayment = payload.old as Payment;

//                     // console.log(`Change detected in Payment:`, payload);

//                     setUpdatedOrders((currentOrders) => {
//                         // probably improve this by searching for the order and then updating that order.payments
//                         return currentOrders.map((order) => {
//                             // Skip orders that aren't affected by this event
//                             if (newPayment?.order_id !== order.order_id && eventType !== 'DELETE') {
//                                 return order;
//                             }

//                             // Ensure the `payments` array exists
//                             const payments = order.payments || [];

//                             if (eventType === 'INSERT') {
//                                 // Add the new payment to the payments list
//                                 return {
//                                     ...order,
//                                     payments: [...payments, newPayment],
//                                 };
//                             }

//                             if (eventType === 'UPDATE') {
//                                 // Update the existing payment
//                                 return {
//                                     ...order,
//                                     payments: payments.map((payment) =>
//                                         payment.payment_id === newPayment.payment_id ? newPayment : payment,
//                                     ),
//                                 };
//                             }

//                             if (eventType === 'DELETE' && oldPayment) {
//                                 // Remove the deleted payment
//                                 return {
//                                     ...order,
//                                     payments: payments.filter(
//                                         (payment) => payment.payment_id !== oldPayment.payment_id,
//                                     ),
//                                 };
//                             }

//                             // If no changes are needed, return the original order
//                             return order;
//                         });
//                     });

//                     queryClient.invalidateQueries({ queryKey });
//                 },
//             )
//             .subscribe();

//         return () => {
//             paymentChannel.unsubscribe();
//         };
//     }, [orders, queryKey, queryClient]);

//     return updatedOrders;
// };
