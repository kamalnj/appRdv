import { useState, useCallback } from 'react';


export const useAppointmentQualifier = () => {
    const [qualifierConfirm, setQualifierConfirm] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const startQualification = useCallback(async (actionId: number) => {
        try {
            setIsLoading(true);
            setQualifierConfirm(actionId);
            // Simulate async operation - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
            console.error('Qualification error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelQualification = useCallback(() => {
        setQualifierConfirm(null);
        setIsLoading(false);
    }, []);

    return {
        qualifierConfirm,
        isLoading,
        startQualification,
        cancelQualification,
    };
};