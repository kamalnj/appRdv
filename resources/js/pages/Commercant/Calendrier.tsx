import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, Link } from '@inertiajs/react';
import { MapPin, MoveLeft, Send, X, Calendar, Clock, User, Phone, MessageCircle, Mail, CheckCircle2, XCircle, ArrowRight, Edit } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendrier des RDVs',
        href: '/calendrier',
    },
];

interface RdvEvent {
    title: string;
    start: string;
    end: string;
    localisation: string;
    representer_par: string;
    email: string;
    besoin_client: string;
    telephone: string;
    commentaire: string;
    idEntreprise: number;
    idRdv: number;
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    rdvs: RdvEvent[];
}

export default function Calendrier({ rdvs }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [qualifierConfirm, setqualifierConfirm] = useState<number | null>(null);
    
    const handlequalifierClick = (actionId: number) => {
        setqualifierConfirm(actionId);
    };

    const cancelqualifier = () => {
        setqualifierConfirm(null);
    };

    const handleEventClick = (info: any) => {
        setSelectedEvent(info.event);
        setIsModalOpen(true);
    };

    const EventModal = ({ isOpen, onClose, event }: any) => {
        if (!event) return null;
        
        const isQualifie = qualifierConfirm === event.idEntreprise;
        const hasAttcom = event.extendedProps.hasAttcom; 
        const idAttcom = event.extendedProps.idAttcom;
        console.log(idAttcom);

        return (
            <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <DialogTitle as="h2" className="text-xl font-bold">
                                                {event.title}
                                            </DialogTitle>
                                            <p className="text-blue-100 text-sm mt-1">
                                                Détails du rendez-vous
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={onClose} 
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 hover:scale-105"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Left Column - Event Details */}
                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-semibold text-gray-900">Date & Heure</span>
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">Date:</span>
                                                    <span>{event.start.toLocaleDateString('fr-FR', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}</span>
                                                </div>
                                                {event.start.toTimeString() !== event.end?.toTimeString() && (
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span>{event.start.toLocaleTimeString('fr-FR', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })} - {event.end?.toLocaleTimeString('fr-FR', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {event.extendedProps.representer_par && (
                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                        <User className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">Représentant</span>
                                                </div>
                                                <p className="text-sm text-gray-700 ml-11">{event.extendedProps.representer_par}</p>
                                            </div>
                                        )}

                                        {event.extendedProps.besoin_client && (
                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                                        <MessageCircle className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">Besoin Client</span>
                                                </div>
                                                <p className="text-sm text-gray-700 ml-11">{event.extendedProps.besoin_client}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                                    <Phone className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <span className="font-semibold text-gray-900">Contact</span>
                                            </div>
                                            <div className="space-y-3 text-sm">
                                                {event.extendedProps.telephone && (
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <a 
                                                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                        >
                                                            {event.extendedProps.telephone}
                                                        </a>
                                                    </div>
                                                )}
                                                {event.extendedProps.email && (
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-4 w-4 text-gray-500" />
                                                        <a
                                                            href={`mailto:${event.extendedProps.email}`}
                                                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                        >
                                                            {event.extendedProps.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {event.extendedProps.localisation && (
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <a
                                                            href={`https://www.google.com/maps/search/${encodeURIComponent(event.extendedProps.localisation)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                        >
                                                            {event.extendedProps.localisation}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {event.extendedProps.commentaire && (
                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                        <MessageCircle className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">Commentaire</span>
                                                </div>
                                                <p className="text-sm text-gray-700 ml-11">{event.extendedProps.commentaire}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Action requise pour ce rendez-vous
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        {!isQualifie ? (
                                            <button
                                                onClick={() => handlequalifierClick(event.idEntreprise)}
                                                className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105"
                                            >
                                                <MoveLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                                <span>Qualifier</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/qualifier1/${event.extendedProps.idRdv}`}
                                                    className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105"
                                                >
                                                    <CheckCircle2 size={16} className="transition-transform group-hover:scale-110" />
                                                    <span>Accepter</span>
                                                </Link>
                                                <Link
                                                    href={`/qualifier2/${event.extendedProps.idRdv}`}
                                                    className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-105"
                                                >
                                                    <XCircle size={16} className="transition-transform group-hover:scale-110" />
                                                    <span>Refuser</span>
                                                </Link>
                                                <button
                                                    onClick={cancelqualifier}
                                                    className="inline-flex items-center space-x-2 rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-gray-600 hover:shadow-xl hover:scale-105"
                                                >
                                                    <X size={16} />
                                                    <span>Annuler</span>
                                                </button>
                                            </div>
                                        )}
                                        
                                            {hasAttcom ? (
                                        <Link
                                            href={`/attcom1/edit/${event.extendedProps.idAttcom}`}
                                            className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-700 hover:to-orange-800 hover:shadow-xl hover:scale-105"
                                        >
                                            <Edit size={16} className="transition-transform group-hover:scale-110" />
                                            <span>Modifier</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/final/${event.extendedProps.idRdv}`}
                                            className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-800 hover:shadow-xl hover:scale-105"
                                        >
                                            <span>Finaliser</span>
                                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </Link>)}
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendrier des RDVs" />
            <div className="p-6">
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
                />
                <EventModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    event={selectedEvent} 
                />
            </div>
        </AppLayout>
    );
}