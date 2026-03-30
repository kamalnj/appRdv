import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, Clock, Edit, Mail, MapPin, MessageCircle, MoveLeft, Phone, User, X, XCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { EventModalProps } from '../types/calendar';

const EventModal = memo(({ isOpen, onClose, event,  }: EventModalProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);


    if (!event) return null;


    const { extendedProps } = event;
   


    const formatPhoneNumbers = (phones: string[]) => {
        return phones
            .filter((tel: string) => tel.trim() !== '')
            .map((tel: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a
                        href={`tel:${tel.trim()}`}
                        className="rounded text-blue-600 transition-colors hover:text-blue-700 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {tel.trim()}
                    </a>
                </div>
            ));
    };

    const InfoSection = ({
        icon: Icon,
        title,
        children,
        bgColor = 'bg-gray-50',
        iconColor = 'text-gray-600',
        iconBg = 'bg-gray-100',
    }: {
        icon: any;
        title: string;
        children: React.ReactNode;
        bgColor?: string;
        iconColor?: string;
        iconBg?: string;
    }) => (
        <div className={`rounded-xl dark:bg-neutral-500 ${bgColor} p-4`}>
            <div className="mb-3 flex items-center space-x-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <span className="font-semibold text-gray-900">{title}</span>
            </div>
            <div className="ml-11">{children}</div>
        </div>
    );

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50" initialFocus={closeButtonRef}>
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-neutral-800"
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
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
                                        <DialogTitle as="h2" id="modal-title" className="text-xl font-bold">
                                            {event.title}
                                        </DialogTitle>
                                        <p id="modal-description" className="mt-1 text-sm text-blue-100">
                                            Détails du rendez-vous
                                        </p>
                                    </div>
                                </div>
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:scale-105 hover:bg-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                                    aria-label="Fermer la modal"
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
                                    <InfoSection
                                        icon={Calendar}
                                        title="Date & Heure"
                                        bgColor="bg-gray-50"
                                        iconColor="text-blue-600"
                                        iconBg="bg-blue-100"
                                    >
                                        <div className="space-y-2 text-sm font-semibold text-gray-900">
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    {event.start.toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            {event.end && event.start.toTimeString() !== event.end.toTimeString() && (
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span>
                                                        {event.start.toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}{' '}
                                                        -{' '}
                                                        {event.end.toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </InfoSection>

                                    {extendedProps.representer_par && (
                                        <InfoSection icon={User} title="Représentant" iconColor="text-green-600" iconBg="bg-green-100">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.representer_par}</p>
                                        </InfoSection>
                                    )}
                                         {extendedProps.fonction && (
                                        <InfoSection icon={User} title="Fonction du Représentant" iconColor="text-green-600" iconBg="bg-green-100">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.fonction}</p>
                                        </InfoSection>
                                    )}
                                         {extendedProps.telephoneR && (
                                        <InfoSection icon={User} title="Téléphone du Représentant" iconColor="text-green-600" iconBg="bg-green-100">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.telephoneR}</p>
                                        </InfoSection>
                                    )}

                                </div>

                                {/* Right Column - Contact & Additional Info */}
                                <div className="space-y-4">
                                    <InfoSection icon={Phone} title="Contact" iconColor="text-orange-600" iconBg="bg-orange-100">
                                        <div className="space-y-3 text-sm">
                                            {extendedProps.telephone && formatPhoneNumbers(extendedProps.telephone)}

                                            {extendedProps.email && (
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                    <a
                                                        href={`mailto:${extendedProps.email}`}
                                                        className="rounded text-blue-600 transition-colors hover:text-blue-700 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {extendedProps.email}
                                                    </a>
                                                </div>
                                            )}

                                            {extendedProps.localisation && (
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <a
                                                        href={`https://www.google.com/maps/search/${encodeURIComponent(extendedProps.localisation)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded text-blue-600 transition-colors hover:text-blue-700 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {extendedProps.localisation}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </InfoSection>

                                    {extendedProps.commentaire && (
                                        <InfoSection icon={MessageCircle} title="Commentaire">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.commentaire}</p>
                                        </InfoSection>
                                    )}
                                         {extendedProps.besoin_client && (
                                        <InfoSection icon={MessageCircle} title="Besoin Client" iconColor="text-purple-600" iconBg="bg-purple-100">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.besoin_client}</p>
                                        </InfoSection>
                                    )}
                                           {extendedProps.details && (
                                        <InfoSection icon={MessageCircle} title="Détails" iconColor="text-purple-600" iconBg="bg-purple-100">
                                            <p className="text-sm font-semibold text-gray-900">{extendedProps.details}</p>
                                        </InfoSection>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
});

EventModal.displayName = 'EventModal';

export default EventModal;
