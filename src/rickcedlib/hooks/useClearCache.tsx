import { useCallback } from 'react';

export const useClearCache = () => {
    const clearCacheAndReload = useCallback(async () => {
        try {
            // Unregister Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            }

            // Clear Caches
            if ('caches' in window) {
                const cacheKeys = await caches.keys();
                for (const key of cacheKeys) {
                    await caches.delete(key);
                }
            }

            // Clear Local and Session Storage
            localStorage.clear();
            sessionStorage.clear();

            if ('indexedDB' in window) {
                const dbs = await window.indexedDB.databases();
                for (const db of dbs) {
                    if (db && db.name) {
                        window.indexedDB.deleteDatabase(db.name);
                    }
                }
            }

            window.location.reload();
        } catch (error) {
            console.error('Error clearing cache and reloading:', error);
            alert('There was an error clearing the cache. Please try again.');
        }
    }, []);

    return clearCacheAndReload;
};
