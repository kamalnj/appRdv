import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, Clock, Edit, Mail, MapPin, MessageCircle, MoveLeft, Phone, User, X, XCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { EventModalProps } from '../types/calendar';
import { LoadingSpinner } from './LoadingSpinner';

const EventModal = memo(({ isOpen, onClose, event, qualifierConfirm, onQualifierClick, onCancelQualifier, isLoading }: EventModalProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);

    const handleQualifierClick = useCallback(() => {
        if (event?.extendedProps.idEntreprise) {
            onQualifierClick(event.extendedProps.idEntreprise);
        }
    }, [event?.extendedProps.idEntreprise, onQualifierClick]);

    if (!event) return null;

    const isQualifie = qualifierConfirm === event.extendedProps.idEntreprise;
    const hasAttcom = event.extendedProps.hasAttcom;
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
                            {isLoading && (
                                <div className="mb-4 flex justify-center">
                                    <LoadingSpinner />
                                </div>
                            )}

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
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800">
                            <div className="flex items-center justify-between">
                                {/* Cas 1 : isqualified = false (Rendez-vous annulé) */}
                                {!extendedProps.isqualified && extendedProps.isqualified !== null ? (
                                    <div className="flex w-full items-center justify-center">
                                        <div className="flex items-center space-x-2 text-red-600">
                                            <XCircle size={20} />
                                            <span className="text-sm font-semibold dark:text-white">Rendez-vous annulé</span>
                                        </div>
                                    </div>
                                ) : extendedProps.isqualified === null ? (
                                    // Cas 2 : isqualified = null (à qualifier)
                                    <>
                                        <div className="text-sm text-gray-500 dark:text-white">Action requise pour ce rendez-vous</div>

                                        <div className="flex items-center space-x-3">
                                            {!isQualifie ? (
                                                // Bouton "Qualifier"
                                                <button
                                                    onClick={handleQualifierClick}
                                                    disabled={isLoading}
                                                    className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <MoveLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                                    <span>Qualifier</span>
                                                </button>
                                            ) : (
                                                // Boutons Accepter / Refuser / Annuler qualification
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/qualifier1/${extendedProps.idRdv}`}
                                                        className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                                    >
                                                        <CheckCircle2 size={16} className="transition-transform group-hover:scale-110" />
                                                        <span>Accepter</span>
                                                    </Link>
                                                    <Link
                                                        href={`/noqualifier/${extendedProps.idRdv}`}
                                                        className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                                                    >
                                                        <XCircle size={16} className="transition-transform group-hover:scale-110" />
                                                        <span>Refuser</span>
                                                    </Link>
                                                    <button
                                                        onClick={onCancelQualifier}
                                                        className="inline-flex items-center space-x-2 rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-600 hover:shadow-xl focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                                    >
                                                        <X size={16} />
                                                        <span>Annuler</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // Cas 3 : isqualified = true (Déjà qualifié)
                                    <>
                                        <div className="text-sm text-gray-500 dark:text-white">Rendez-vous qualifié</div>

                                        <div className="flex items-center space-x-3">
                                            {!hasAttcom ? (
                                                // Pas encore d’attcom → bouton Finaliser
                                                <Link
                                                    href={`/final/${extendedProps.idRdv}`}
                                                    className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-800 hover:shadow-xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                                >
                                                    <span>Finaliser</span>
                                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            ) : (
                                                // Déjà un attcom → bouton Modifier
                                                extendedProps.idAttcom && (
                                                    <Link
                                                        href={`/attcom1/edit/${extendedProps.idAttcom}`}
                                                        className="group inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
                                                    >
                                                        <Edit size={16} className="transition-transform group-hover:scale-110" />
                                                        <span>Modifier</span>
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
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
