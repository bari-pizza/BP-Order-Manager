import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { toast } from 'react-toastify';

type ShowToastOptions = ('insert' | 'update' | 'delete')[];

const useSubscribeToTable = <T extends Record<string, unknown>>({
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
                                    toast.info(`Other user inserted a record in ${tableName}s table`);
                                }
                                return [...currentData, newData];
                            case 'UPDATE':
                                if (showToast.includes('update')) {
                                    toast.info(`Other user updated a record in ${tableName}s table`);
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
                                    toast.info(`Other user deleted a record from ${tableName}s table`);
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
    }, [tableName]);

    return data;
};

export default useSubscribeToTable;
