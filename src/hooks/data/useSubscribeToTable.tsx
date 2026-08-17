import { useEffect } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from '../../toast/toastWrapper';
import {
    BusinessDayDrawerSummary,
    BusinessDayDriver,
    BusinessDaySummary,
    CashTransfer,
    GlobalChangeTracker,
    Order,
    Payment,
    Profile,
} from '../../typesAndValidators';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useConditionalToast } from '../../toast/useConditionalToast';
import { getAllDaysDrivers, getAllEmployees } from '../../supabaseQueries';

type ShowToastOptions = ('insert' | 'update' | 'delete')[];

// TODO: make this use context instead

const useSubscribeToTable = <T extends Record<string, unknown>>({
    tableName,
    primaryKeys,
    queryKey,
    isMobile,
    showToast = [],
}: {
    tableName: string;
    primaryKeys: (keyof T)[];
    queryKey: string[];
    isMobile: boolean;
    showToast?: ShowToastOptions;
}) => {
    const queryClient = useQueryClient();

    const conditionalToast = useConditionalToast({ isMobile });

    useEffect(() => {
        const isMatch = (a: T, b: T) => {
            return primaryKeys.every((key) => a[key] === b[key]);
        };

        // Set up the subscription with a filter
        const subscription = supaClient
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
                    // const newData = payload.new as T;
                    // const oldData = payload.old as T;
                    // setData((currentData) => {
                    queryClient.setQueryData(queryKey, (currentData: T[]) => {
                        let newData = currentData;
                        switch (eventType) {
                            case 'INSERT':
                                {
                                    if (showToast.includes('insert')) {
                                        // toast.info(`A new record was added in ${tableName}s table`, {
                                        //     onClick: () => {
                                        //         // toast.info(JSON.stringify(payload, null, 2), {
                                        //         //     autoClose: false,
                                        //         //     closeOnClick: true,
                                        //         // });
                                        //         toast.info(<pre>{JSON.stringify(payload, null, 2)}</pre>, {
                                        //             autoClose: false,
                                        //             closeOnClick: true,
                                        //         });
                                        //     },
                                        // });
                                        conditionalToast({
                                            scenario: [
                                                {
                                                    conditions: [],
                                                    getMessage: () => {
                                                        // const orderNameOrNumber =
                                                        //     payload.new.order_name || payload.new.order_number;
                                                        // const last_updated_by = payload.new.last_updated_by;
                                                        // const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        // return `New order ${orderNameOrNumber} added by ${fullName}.`;
                                                        return `A new record was added in ${tableName}s table`;
                                                    },
                                                },
                                            ],
                                            payload: payload.new as T,
                                        });
                                    }
                                    // return [...currentData, newData];
                                    const newRecord = payload.new as T;
                                    newData = [...currentData, newRecord];
                                }
                                break;
                            case 'UPDATE':
                                {
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
                                    // return currentData.map((item) => {
                                    //     if (isMatch(item, newData)) {
                                    //         return newData;
                                    //     }
                                    //     return item;
                                    // });
                                    newData = currentData.map((item) => {
                                        const newRecord = payload.new as T;
                                        if (isMatch(item, newRecord)) {
                                            return newRecord;
                                        }
                                        return item;
                                    });
                                }
                                break;
                            // TODO: give access to all orders to all drivers (otherwise they can't see updates to orders)
                            case 'DELETE':
                                {
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
                                    const deletedRecord = payload.old as T;
                                    newData = currentData.filter((item) => !isMatch(item, deletedRecord));
                                }
                                break;
                            // return currentData.filter((item) => !isMatch(item, oldData));
                            // return currentData.filter((item) => item[rowIDField] !== rowIDValue);
                            default:
                                // return currentData;
                                newData = currentData;
                        }
                        return newData;
                    });
                    queryClient.invalidateQueries({ queryKey });
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            // channel.unsubscribe();
            supaClient.removeChannel(subscription);
        };
    }, [tableName, showToast, primaryKeys, queryClient, queryKey, conditionalToast]);

    // return data;
};

const getAllDaysOrders = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const formattedDate = businessDate.format('YYYY-MM-DD');
    const { data, error } = await supaClient
        .from('Order')
        .select('*')
        .eq('business_date', formattedDate)
        .order('order_number', { ascending: true });

    if (error) {
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Order[];
};

const getAllDaysPayments = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const formattedDate = businessDate.format('YYYY-MM-DD');
    const { data, error } = await supaClient.from('Payment').select('*').eq('business_date', formattedDate);

    if (error) {
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Payment[];
};

const getBusinessDaySummary = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const { data, error } = await supaClient
        .from('BusinessDaySummary')
        .select('*')
        .eq('business_date', businessDate.format('YYYY-MM-DD'));

    if (error) {
        return [] as BusinessDaySummary[];
    }
    if (!data || data.length === 0) return [] as BusinessDaySummary[];

    return [data[0] as unknown as BusinessDaySummary];
};

const getBusinessDayDrawerSummaries = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const { data, error } = await supaClient
        .from('BusinessDayDrawer')
        .select('*')
        .eq('business_date', businessDate.format('YYYY-MM-DD'));

    if (error) {
        return [] as BusinessDayDrawerSummary[];
    }
    if (!data || data.length === 0) return [] as BusinessDayDrawerSummary[];

    return data as unknown as BusinessDayDrawerSummary[];
};

const getCashTransfers = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const { data, error } = await supaClient
        .from('CashTransfer')
        .select('*')
        .eq('business_date', businessDate.format('YYYY-MM-DD'));

    if (error) {
        return [] as CashTransfer[];
    }

    if (!data || data.length === 0) return [] as CashTransfer[];

    return data as unknown as CashTransfer[];
};

// THIS WORKED
// by using setQueryData instead of invalidating the query, we can keep the data in the cache without refetching it
// TODO: look to do something similar in the api (its causing it to invalidate the query and refetch instead of just updating the cache)

// TODO: might be smart to make all drawers automatically use profile.id as their default drawer.id
// TODO:conditional toast
// [x] - let driver know when changes are made to their order or payment (isMobile && lastUpdatedBy !== 'driver')
// [x] - let manager know when changes are made to any order or payment (!isMobile && lastUpdatedBy !== 'manager')

export const useSetupAllSubscriptions = ({
    businessDate,
    showToast,
    isMobile,
}: {
    businessDate: dayjs.Dayjs;
    showToast?: ShowToastOptions;
    isMobile: boolean;
}) => {
    useSuspenseQueries({
        queries: [
            {
                queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getAllDaysOrders({ businessDate }),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['payments', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getAllDaysPayments({ businessDate }),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['profiles'],
                queryFn: () => getAllEmployees(),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['businessDaySummaries', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getBusinessDaySummary({ businessDate }),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['businessDayDrawerSummaries', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getBusinessDayDrawerSummaries({ businessDate }),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['cashTransfers', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getCashTransfers({ businessDate }),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
            {
                queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')],
                queryFn: () => getAllDaysDrivers(businessDate),
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                staleTime: 1000 * 60 * 30,
            },
        ],
    });

    const queryClient = useQueryClient();

    const conditionalToast = useConditionalToast({ isMobile });

    // Effect for orders
    useEffect(() => {
        const getLastUpdatedByFullName = (lastUpdatedBy: string) => {
            const users = queryClient.getQueryData(['profiles']) as Profile[];
            const lastUpdatedByUser = users?.find((user) => user.id === lastUpdatedBy);
            if (!lastUpdatedByUser) return 'someone';
            return lastUpdatedByUser?.first_name + ' ' + lastUpdatedByUser?.last_name;
        };

        const subscription = supaClient
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
                                                    getMessage: () => {
                                                        const orderNameOrNumber =
                                                            payload.new.order_name || payload.new.order_number;
                                                        const last_updated_by = payload.new.last_updated_by;
                                                        const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        return `New order ${orderNameOrNumber} added by ${fullName}.`;
                                                    },
                                                },
                                                {
                                                    conditions: [
                                                        // working on desktop
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
                                                        // return `New order ${orderNameOrNumber} was added by someone else.`;
                                                        const last_updated_by = payload.new.last_updated_by;
                                                        const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        return `New order ${orderNameOrNumber} added by ${fullName}.`;
                                                    },
                                                },
                                            ],
                                            payload: payload.new as Order,
                                        });
                                    }
                                    const newOrder = payload.new as Order;
                                    const list = currentData ?? [];
                                    newData = list.some((order) => order.order_id === newOrder.order_id)
                                        ? list
                                        : [...list, newOrder];
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
                                                        const last_updated_by = payload.new.last_updated_by;
                                                        const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        return `A change was made to order ${orderNameOrNumber} by ${fullName}.`;
                                                    },
                                                },
                                                {
                                                    conditions: [
                                                        // working on desktop
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
                                                        const last_updated_by = payload.new.last_updated_by;
                                                        const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        return `A change was made to order ${orderNameOrNumber} by ${fullName}.`;
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
                                                    getMessage: () => {
                                                        const orderNameOrNumber =
                                                            payload.old.order_name || payload.old.order_number;
                                                        const last_updated_by = payload.old.last_updated_by;
                                                        const fullName = getLastUpdatedByFullName(last_updated_by);
                                                        return `Order ${orderNameOrNumber} was deleted by ${fullName}.`;
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
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            // channel.unsubscribe();
            supaClient.removeChannel(subscription);
            // console.log('Unsubscribing from order changes ' + businessDate.format('YYYY-MM-DD'));
        };
    }, [businessDate, showToast, queryClient, conditionalToast]);

    // Effect for payments
    useEffect(() => {
        const subscription = supaClient
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
                                const list = currentData ?? [];
                                newData = list.some((payment) => payment.payment_id === newPayment.payment_id)
                                    ? list
                                    : [...list, newPayment];
                            }

                            // TODO: lets see if I can get orders from queryClient and check them to see if a payment belongs to this user or not
                            if (eventType === 'UPDATE') {
                                if (showToast?.includes('update')) {
                                    // conditionalToast({
                                    //     scenario: [
                                    //         {
                                    //             conditions: [
                                    //                 // order belongs to driver
                                    //                 {
                                    //                     ctxField: 'profile.id',
                                    //                     payloadField: 'drawer_id',
                                    //                     comparison: 'eq',
                                    //                 },
                                    //                 // lastUpdatedBy someone else
                                    //                 {
                                    //                     ctxField: 'profile.id',
                                    //                     payloadField: 'last_updated_by',
                                    //                     comparison: 'neq',
                                    //                 },
                                    //             ],
                                    //             getMessage: (context) => {
                                    //                 const orderNameOrNumber =
                                    //                     payload.new.order_name || payload.new.order_number;
                                    //                 return `A change was made to order ${orderNameOrNumber} by ${context.profileFullName}.`;
                                    //             },
                                    //         },
                                    //     ],
                                    //     payload: payload.new as Payment,
                                    // });
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
                        },
                    );
                },
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            // channel.unsubscribe();
            supaClient.removeChannel(subscription);
        };
    }, [businessDate, showToast, queryClient, conditionalToast]);

    // Effect of GlobalChangeTracker
    useEffect(() => {
        const queryKeys = {
            AppSetting: 'constants',
            Drawer: 'drawers',
            Driver: 'drivers',
            OrderOrigin: 'origins',
            Profile: 'profiles',
            Resource: 'resources',
        };

        const subscription = supaClient
            .channel('public:GlobalChangeTracker')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'GlobalChangeTracker' }, (payload) => {
                const { table_name } = payload.new as GlobalChangeTracker;

                if (table_name === 'All Tables') {
                    queryClient.invalidateQueries();
                } else if (table_name in queryKeys) {
                    // Invalidate queries for the specific table
                    queryClient.invalidateQueries({ queryKey: [queryKeys[table_name as keyof typeof queryKeys]] });
                }
            })
            .subscribe();

        return () => {
            supaClient.removeChannel(subscription);
        };
    }, [queryClient]);

    useSubscribeToTable<BusinessDaySummary>({
        tableName: 'BusinessDaySummary',
        primaryKeys: ['business_date'],
        queryKey: ['businessDaySummaries', businessDate.format('YYYY-MM-DD')],
        isMobile,
        showToast,
    });

    useSubscribeToTable<BusinessDayDrawerSummary>({
        tableName: 'BusinessDayDrawer',
        primaryKeys: ['business_date', 'drawer_id'],
        queryKey: ['businessDayDrawerSummaries', businessDate.format('YYYY-MM-DD')],
        isMobile,
        showToast,
    });

    useSubscribeToTable<CashTransfer>({
        tableName: 'CashTransfer',
        primaryKeys: ['cash_transfer_id'],
        queryKey: ['cashTransfers', businessDate.format('YYYY-MM-DD')],
        isMobile,
        showToast,
    });
    useSubscribeToTable<BusinessDayDriver>({
        tableName: 'BusinessDayDriver',
        primaryKeys: ['business_date', 'drawer_id'],
        queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')],
        isMobile,
        showToast,
    });
};
