
import { useEffect, useState, useRef } from 'react';

export function useAutoSave<T>(data: T, key: string, delay: number = 2000) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const dataRef = useRef(data);

    // Keep ref in sync
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        const handler = setTimeout(() => {
            // In a real app, this would call an API
            // For now, we simulate saving to localStorage
            // console.log(`Auto-saving to ${key}...`, dataRef.current);

            try {
                localStorage.setItem(key, JSON.stringify(dataRef.current));
                setIsSaving(true);
                setLastSaved(new Date());

                // Reset saving indicator after a brief flash
                setTimeout(() => setIsSaving(false), 1000);
            } catch (e) {
                console.error("Auto-save failed", e);
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [data, key, delay]);

    return { isSaving, lastSaved };
}
