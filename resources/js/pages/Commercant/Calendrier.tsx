import { ErrorMessage } from '@/components/ErrorMessage';
import EventModal from '@/components/EventModal';
import { useAppointmentModal } from '@/hooks/useAppointmentModal';
import { useAppointmentQualifier } from '@/hooks/useAppointmentQualifier';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CalendarEvent, Props } from '@/types/calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendrier des RDVs',
        href: '/calendrier',
    },
];

export default function Calendrier({ rdvs }: Props) {
    const { isModalOpen, selectedEvent, error, openModal, closeModal, setError } = useAppointmentModal();

    const { qualifierConfirm, isLoading, startQualification, cancelQualification } = useAppointmentQualifier();

    const handleEventClick = useCallback(
        (info: any) => {
            try {
                const calendarEvent: CalendarEvent = {
                    title: info.event.title,
                    start: info.event.start,
                    end: info.event.end,
                    extendedProps: info.event.extendedProps,
                };
                openModal(calendarEvent);
            } catch (err) {
                setError("Erreur lors du chargement de l'événement");
                console.error('Event click error:', err);
            }
        },
        [openModal, setError],
    );

    const handleQualifierClick = useCallback(
        async (actionId: number) => {
            try {
                await startQualification(actionId);
            } catch (err) {
                setError('Erreur lors de la qualification');
                console.error('Qualifier error:', err);
            }
        },
        [startQualification, setError],
    );

    const handleDismissError = useCallback(() => {
        setError(null);
    }, [setError]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendrier des RDVs" />
            <div className="p-6">
                {error && <ErrorMessage message={error} onDismiss={handleDismissError} />}

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                    <FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        eventClick={handleEventClick}
                        events={rdvs}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        locale="fr"
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        eventDisplay="block"
                        eventBackgroundColor="#3b82f6"
                        eventBorderColor="#2563eb"
                        eventTextColor="#ffffff"
                        nowIndicator={true}
                        dayMaxEvents={true}
                        weekends={true}
                        businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: '08:00',
                            endTime: '18:00',
                        }}
                        eventClassNames="hover:scale-105 transition-transform duration-200 cursor-pointer"
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'short',
                        }}
                        dayHeaderClassNames={() => [
                            'text-gray-700 dark:text-gray-200 font-medium text-sm bg-gray-50 dark:bg-neutral-800 border-b dark:border-neutral-700',
                        ]}
                    />
                </div>

                <EventModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    event={selectedEvent}
                    qualifierConfirm={qualifierConfirm}
                    onQualifierClick={handleQualifierClick}
                    onCancelQualifier={cancelQualification}
                    isLoading={isLoading}
                />
            </div>
        </AppLayout>
    );
}
