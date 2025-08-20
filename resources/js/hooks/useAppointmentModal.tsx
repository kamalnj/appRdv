import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';

export const useAppointmentModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openModal = useCallback((event: CalendarEvent) => {
        try {
            setSelectedEvent(event);
            setIsModalOpen(true);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des détails de l\'événement');
            console.error('Modal open error:', err);
        }
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setError(null);
    }, []);

    return {
        isModalOpen,
        selectedEvent,
        error,
        openModal,
        closeModal,
        setError,
    };
};