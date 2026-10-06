import { useState, useEffect } from 'react';

const MGRS_STORAGE_KEY = 'mgrs_enabled';
const EVENT_NAME = 'mgrs_toggled';

export function useMGRSStorage() {
    const [isMGRSEnabled, setIsMGRSEnabled] = useState<boolean>(() => {
        const stored = localStorage.getItem(MGRS_STORAGE_KEY);
        // Default to true as per user request
        if (stored === null) return true;
        return stored === 'true';
    });

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === MGRS_STORAGE_KEY) {
                setIsMGRSEnabled(e.newValue === 'true');
            }
        };

        const handleCustomChange = (e: Event) => {
            const customEvent = e as CustomEvent<boolean>;
            setIsMGRSEnabled(customEvent.detail);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(EVENT_NAME, handleCustomChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(EVENT_NAME, handleCustomChange);
        };
    }, []);

    const toggleMGRS = () => {
        const newValue = !isMGRSEnabled;
        localStorage.setItem(MGRS_STORAGE_KEY, String(newValue));
        setIsMGRSEnabled(newValue);
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newValue }));
    };

    return { isMGRSEnabled, toggleMGRS };
}
