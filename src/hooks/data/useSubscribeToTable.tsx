import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';

// call this directly from order.tsx

const useSubscribeToTable = <T extends Record<string, unknown>>({
    tableName,
    initialData,
}: {
    tableName: string;
    initialData: T[];
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
            .channel('order-changes')
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

                    setData((currentData) => {
                        switch (eventType) {
                            case 'INSERT':
                                return [...currentData, newData];
                            case 'UPDATE':
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
