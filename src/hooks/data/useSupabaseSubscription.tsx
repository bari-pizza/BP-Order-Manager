// generated my postgres.new
// still needs to be tested

// import { useEffect } from 'react';
// import { useQueryClient } from 'react-query';
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const supabaseUrl = 'https://your-supabase-url.supabase.co';
// const supabaseAnonKey = 'your-anon-key';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const useSupabaseSubscription = (tableName, event, queryKey) => {
//     const queryClient = useQueryClient();

//     useEffect(() => {
//         // Subscribe to changes in the specified table
//         const subscription = supabase
//             .from(tableName)
//             .on(event, (payload) => {
//                 console.log(`Change received on ${tableName}:`, payload);
//                 // Invalidate the query to refetch data
//                 queryClient.invalidateQueries(queryKey);
//             })
//             .subscribe();

//         // Cleanup subscription on component unmount
//         return () => {
//             supabase.removeSubscription(subscription);
//         };
//     }, [tableName, event, queryKey, queryClient]);
// };

// export default useSupabaseSubscription;
