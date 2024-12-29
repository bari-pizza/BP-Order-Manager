import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from 'react-toastify';
import { Order, Payment } from '../../typesAndValidators';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useConditionalToast } from '../../toast/useConditionalToast';

type ShowToastOptions = ('insert' | 'update' | 'delete')[];

// TODO: make this use context instead

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
        .select('*')
        .eq('business_date', formattedDate)
        .order('order_number', { ascending: true });
    // const { data, error } = await supaClient
    //     .from('Order')
    //     .select(
    //         `
    //     *,
    //     payments:Payment (
    //       *
    //     )
    //   `,
    //     )
    //     .eq('business_date', formattedDate)
    //     .order('order_number', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Order[];
};

const getAllDaysPayments = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const formattedDate = businessDate.format('YYYY-MM-DD');
    const { data, error } = await supaClient.from('Payment').select('*').eq('business_date', formattedDate);

    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Payment[];
};

// THIS WORKED
// by using setQueryData instead of invalidating the query, we can keep the data in the cache without refetching it
// TODO: look to do something similar in the api (its causing it to invalidate the query and refetch instead of just updating the cache)

// TODO: might be smart to make all drawers automatically use profile.id as their default drawer.id
// TODO:conditional toast
// [ ] - let driver know when changes are made to their order or payment (isMobile && lastUpdatedBy !== 'driver')
// [ ] - let manager know when changes are made to any order or payment (!isMobile && lastUpdatedBy !== 'manager')

export const useSetupOrderPaymentSubscriptions = ({
    businessDate,
    showToast,
    isMobile,
}: {
    businessDate: dayjs.Dayjs;
    showToast?: ShowToastOptions;
    isMobile: boolean;
}) => {
    // useSuspenseQuery({
    //     queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
    //     queryFn: () => getAllDaysOrders({ businessDate }),
    //     refetchOnWindowFocus: false,
    //     staleTime: 1000 * 60 * 30,
    // });
    useSuspenseQueries({
        queries: [
            {
                queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getAllDaysOrders({ businessDate }),
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['payments', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getAllDaysPayments({ businessDate }),
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 30,
            },
        ],
    });

    // const [data, setData] = useState<Order_Payment[]>([]);

    // useEffect(() => {
    //     if (initialOrderData) {
    //         setData(initialOrderData);
    //     }
    // }, [initialOrderData]);

    const queryClient = useQueryClient();

    const conditionalToast = useConditionalToast({ isMobile });

    useEffect(() => {
        // const currentData = queryClient.getQueryData(['orders', businessDate.format('YYYY-MM-DD')]) as Order[];
        // let newData = currentData;
        // Set up the subscription with a filter

        // console.log('subscribing to order changes ' + businessDate.format('YYYY-MM-DD'));

        const channel = supaClient
            .channel('order-changes-' + businessDate.format('YYYY-MM-DD'))
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Order',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    // setData((currentData) => {
                    queryClient.setQueryData(['orders', businessDate.format('YYYY-MM-DD')], (currentData: Order[]) => {
                        let newData = currentData;
                        switch (eventType) {
                            case 'INSERT':
                                {
                                    if (showToast?.includes('insert')) {
                                        conditionalToast({
                                            scenario: [
                                                {
                                                    conditions: [
                                                        // order belongs to driver
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'drawer_id',
                                                            comparison: 'eq',
                                                        },
                                                        // lastUpdatedBy someone else
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'last_updated_by',
                                                            comparison: 'neq',
                                                        },
                                                    ],
                                                    getMessage: (context) => {
                                                        const orderNameOrNumber =
                                                            payload.new.order_name || payload.new.order_number;
                                                        return `New order ${orderNameOrNumber} added by ${context.profileFullName}`;
                                                    },
                                                },
                                            ],
                                            payload: payload.new as Order,
                                        });
                                    }
                                    const newOrder = payload.new as Order;
                                    newData = [...currentData, newOrder];
                                }
                                break;
                            case 'UPDATE':
                                {
                                    if (showToast?.includes('update')) {
                                        conditionalToast({
                                            scenario: [
                                                {
                                                    conditions: [
                                                        {
                                                            ctxField: 'isMobile',
                                                            ctxValue: true,
                                                            comparison: 'eq',
                                                        },
                                                        // order belongs to driver
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'drawer_id',
                                                            comparison: 'eq',
                                                        },
                                                        // lastUpdatedBy someone else
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'last_updated_by',
                                                            comparison: 'neq',
                                                        },
                                                    ],
                                                    getMessage: () => {
                                                        const orderNameOrNumber =
                                                            payload.new.order_name || payload.new.order_number;
                                                        return `A change was made to order ${orderNameOrNumber} by someone else.`;
                                                    },
                                                },
                                                {
                                                    conditions: [
                                                        {
                                                            ctxField: 'isMobile',
                                                            ctxValue: false,
                                                            comparison: 'eq',
                                                        },
                                                        // lastUpdatedBy someone else
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'last_updated_by',
                                                            comparison: 'neq',
                                                        },
                                                    ],
                                                    getMessage: () => {
                                                        const orderNameOrNumber =
                                                            payload.new.order_name || payload.new.order_number;
                                                        return `A change was made to order ${orderNameOrNumber} by someone else.`;
                                                    },
                                                },
                                            ],
                                            payload: payload.new as Order,
                                        });
                                    }
                                    newData = currentData.map((item) => {
                                        const newOrder = payload.new as Order;
                                        if (item.order_id === newOrder.order_id) {
                                            // update the order part of the item
                                            return { ...item, ...newOrder };
                                        }
                                        return item;
                                    });
                                }
                                break;
                            case 'DELETE':
                                {
                                    if (showToast?.includes('delete')) {
                                        conditionalToast({
                                            scenario: [
                                                {
                                                    conditions: [
                                                        // order belongs to driver
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'drawer_id',
                                                            comparison: 'eq',
                                                        },
                                                        // lastUpdatedBy someone else
                                                        {
                                                            ctxField: 'profile.id',
                                                            payloadField: 'last_updated_by',
                                                            comparison: 'neq',
                                                        },
                                                    ],
                                                    getMessage: (context) => {
                                                        const orderNameOrNumber =
                                                            payload.old.order_name || payload.old.order_number;
                                                        return `Order ${orderNameOrNumber} was deleted by ${context.profileFullName}.`;
                                                    },
                                                },
                                            ],
                                            payload: payload.old as Order,
                                        });
                                    }
                                    const orderID = (payload.old as Order).order_id;
                                    newData = currentData.filter((item) => item.order_id !== orderID);
                                }
                                break;
                            // return currentData.filter((item) => item[rowIDField] !== rowIDValue);
                            default:
                                newData = currentData;
                        }
                        return newData;
                    });

                    // queryClient.setQueryData(['orders', businessDate.format('YYYY-MM-DD')], newData);

                    // });
                    // queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
            // console.log('Unsubscribing from order changes ' + businessDate.format('YYYY-MM-DD'));
        };
    }, [businessDate, showToast, queryClient, conditionalToast]);

    // Effect for payments
    useEffect(() => {
        // Set up the subscription with a filter
        // const currentData = (queryClient.getQueryData(['payments', businessDate.format('YYYY-MM-DD')]) ||
        //     []) as Payment[];
        // let newData = currentData;
        // console.log('subscribing to payment changes ' + businessDate.format('YYYY-MM-DD'));

        const channel = supaClient
            .channel('payment-changes-' + businessDate.format('YYYY-MM-DD'))
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

                    // setData((currentData) => {
                    queryClient.setQueryData(
                        ['payments', businessDate.format('YYYY-MM-DD')],
                        (currentData: Payment[]) => {
                            let newData = currentData;
                            if (eventType === 'INSERT') {
                                // if (showToast?.includes('insert')) {
                                //     toast.info(`Payment added`, {
                                //         autoClose: 500,
                                //     });
                                // }
                                newData = [...currentData, newPayment];
                            }

                            // TODO: lets see if I can get orders from queryClient and check them to see if a payment belongs to this user or not
                            if (eventType === 'UPDATE') {
                                if (showToast?.includes('update')) {
                                    conditionalToast({
                                        scenario: [
                                            {
                                                conditions: [
                                                    // order belongs to driver
                                                    {
                                                        ctxField: 'profile.id',
                                                        payloadField: 'drawer_id',
                                                        comparison: 'eq',
                                                    },
                                                    // lastUpdatedBy someone else
                                                    {
                                                        ctxField: 'profile.id',
                                                        payloadField: 'last_updated_by',
                                                        comparison: 'neq',
                                                    },
                                                ],
                                                getMessage: (context) => {
                                                    const orderNameOrNumber =
                                                        payload.new.order_name || payload.new.order_number;
                                                    return `A change was made to order ${orderNameOrNumber} by ${context.profileFullName}.`;
                                                },
                                            },
                                        ],
                                        payload: payload.new as Payment,
                                    });
                                }
                                newData = currentData.map((payment) => {
                                    // Skip orders that aren't affected by this event
                                    if (newPayment?.order_id !== payment.order_id) {
                                        return payment;
                                    }
                                    return newPayment;
                                });
                            }

                            if (eventType === 'DELETE') {
                                if (showToast?.includes('delete')) {
                                    toast.info(`Payment for order ${oldPaymentID} was deleted`, {
                                        onClick: () => {
                                            toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                                autoClose: false,
                                                closeOnClick: true,
                                            });
                                        },
                                        autoClose: 500,
                                    });
                                }
                                newData = currentData.filter((payment) => payment.payment_id !== oldPaymentID);
                            }
                            return newData;
                            // newData = currentData.map((payment) => {
                            //     // Skip orders that aren't affected by this event
                            //     if (newPayment?.order_id !== payment.order_id && eventType !== 'DELETE') {
                            //         return payment;
                            //     }

                            //     if (eventType === 'INSERT') {
                            //         // Add the new payment to the payments list
                            //         if (showToast?.includes('insert')) {
                            //             toast.info(`Payment added`);
                            //         }
                            //         return {
                            //             ...payment,
                            //             payments: [...payments, newPayment],
                            //         };
                            //     }

                            //     if (eventType === 'UPDATE') {
                            //         // Update the existing payment
                            //         console.log(`Payment for order ${order.order_number || order.order_name} was updated`);
                            //         // if (showToast?.includes('update')) {
                            //         //     toast.info(
                            //         //         `Payment for order ${order.order_number || order.order_name} was updated`,
                            //         //         {
                            //         //             onClick: () => {
                            //         //                 toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                            //         //                     autoClose: false,
                            //         //                     closeOnClick: true,
                            //         //                 });
                            //         //             },
                            //         //             autoClose: 500,
                            //         //         },
                            //         //     );
                            //         // }
                            //         return {
                            //             ...order,
                            //             payments: payments.map((payment) =>
                            //                 payment.payment_id === newPayment.payment_id ? newPayment : payment,
                            //             ),
                            //         };
                            //     }

                            //     if (eventType === 'DELETE' && oldPaymentID) {
                            //         // Remove the deleted payment
                            //         return {
                            //             ...order,
                            //             payments: payments.filter((payment) => payment.payment_id !== oldPaymentID),
                            //         };
                            //     }

                            //     // If no changes are needed, return the original order
                            //     return order;
                            // });
                            // });
                            // queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
                            // queryClient.setQueryData(['payments', businessDate.format('YYYY-MM-DD')], newData);
                        },
                    );
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
    }, [businessDate, showToast, queryClient, conditionalToast]);

    // const orders = queryClient.getQueryData(['orders', businessDate.format('YYYY-MM-DD')]) as Order[];
    // const payments = queryClient.getQueryData(['payments', businessDate.format('YYYY-MM-DD')]) as Payment[];
    // const orderPayments: Order_Payment[] = orders.map((order) => ({
    //     ...order,
    //     payments: payments.filter((payment) => payment.order_id === order.order_id),
    // }));

    // orderPayments.sort(sortOrders);

    // return orderPayments;
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
