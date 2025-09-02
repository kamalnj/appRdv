import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building, Calendar, ChevronDown, ChevronUp, Edit, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Entreprise {
    id: number;
    denomination: string;
}

interface Action {
    id: number;
    created_at: string;
    feedback?: string;
    next_step?: string;
    besoin_client?: string;
    commentaire?: string;
    hasRdv?: boolean;
    rdv?: Rdv;
}

interface Rdv {
    id: number;
    date_rdv: string;
    representant?: string;
    fonction?: string;
    details?:string;
    telephone?: string;
    email?: string;
    localisation?: string;
    commercant_id?: string;
    commercant?: {
        name: string;
    };
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprise: Entreprise;
    actions: Action[];
    rdvs: Rdv[];
}

export default function ListeAction({ entreprise, actions, rdvs }: Props) {
    const [expandedActions, setExpandedActions] = useState<Set<number>>(new Set());
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const toggleActionDetails = (actionId: number) => {
        const newExpanded = new Set(expandedActions);
        if (newExpanded.has(actionId)) {
            newExpanded.delete(actionId);
        } else {
            newExpanded.add(actionId);
        }
        setExpandedActions(newExpanded);
    };

    const handleDeleteClick = (actionId: number) => {
        setDeleteConfirm(actionId);
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Entreprises',
            href: '/entreprises',
        },
        {
            title: entreprise.denomination,
            href: `/entreprises/${entreprise.id}`,
        },
        {
            title: 'Liste des actions',
            href: `/entreprises/${entreprise.id}/liste-actions`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Actions - ${entreprise.denomination}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
                <div className="sticky top-0 z-10 border-b border-white/30 bg-white/80 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/entreprises"
                                    className="group flex items-center space-x-2 rounded-lg bg-white/60 px-3 py-2 text-slate-600 transition-all duration-200 hover:bg-white/80 hover:text-indigo-600 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                                >
                                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                    <span className="text-sm font-medium">Retour aux entreprises</span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <Building size={20} />
                                <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{entreprise.denomination}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <MessageSquare size={24} className="text-indigo-600" />
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-amber-50">Actions</h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {actions.map((action) => {
                                const isExpanded = expandedActions.has(action.id);
                                const isDeleting = deleteConfirm === action.id;

                                return (
                                    <div
                                        key={action.id}
                                        className="overflow-hidden rounded-2xl border border-white/30 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/80"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-slate-800 dark:text-amber-50">Action</h4>
                                                        <p className="text-sm text-slate-600 dark:text-amber-50">
                                                            Créée le{' '}
                                                            {new Date(action.created_at).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => toggleActionDetails(action.id)}
                                                        className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg"
                                                        aria-expanded={isExpanded}
                                                        aria-controls={`action-details-${action.id}`}
                                                    >
                                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        <span className="text-sm">{isExpanded ? 'Masquer' : 'Voir'}</span>
                                                    </button>

                                                    <Link
                                                        href={`/entreprises/${entreprise.id}/actions/${action.id}/edit`}
                                                        className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
                                                    >
                                                        <Edit size={16} />
                                                        <span className="text-sm">Modifier</span>
                                                    </Link>

                                                    {!isDeleting ? (
                                                        <button
                                                            onClick={() => handleDeleteClick(action.id)}
                                                            className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-pink-700 hover:shadow-lg"
                                                            aria-label={`Supprimer l'action ${action.id}`}
                                                        >
                                                            <Trash2 size={16} />
                                                            <span className="text-sm">Supprimer</span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={`/entreprises/${entreprise.id}/actions/${action.id}/delete`}
                                                                method="delete"
                                                                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-lg"
                                                            >
                                                                <span>Confirmer</span>
                                                            </Link>
                                                            <button
                                                                onClick={cancelDelete}
                                                                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-slate-500 hover:to-slate-600 hover:shadow-lg"
                                                            >
                                                                <span>Annuler</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div
                                                id={`action-details-${action.id}`}
                                                className="border-t border-white/30 bg-gradient-to-r from-emerald-50/70 to-green-50/70 backdrop-blur-sm"
                                            >
                                                <div className="border-b border-white/30 p-6">
                                                    <h5 className="mb-4 text-lg font-semibold text-emerald-800">Détails de l'action</h5>
                                                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                        <div>
                                                            <span className="font-medium text-slate-700">Feedback:</span>
                                                            <p className="mt-1 ml-2 text-slate-600">{action.feedback || 'Non spécifié'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-700">Prochaine étape:</span>
                                                            <p className="mt-1 ml-2 text-slate-600">{action.next_step || 'Non spécifié'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-700">Besoin client:</span>
                                                            <p className="mt-1 ml-2 text-slate-600">{action.besoin_client || 'Non spécifié'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-700">Commentaire:</span>
                                                            <p className="mt-1 ml-2 text-slate-600">{action.commentaire || 'Non spécifié'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <h5 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-blue-800">
                                                        <Calendar size={20} />
                                                        <span>Rendez-vous associé</span>
                                                    </h5>
                                                    {!action.rdv ? (
                                                        <div className="py-8 text-center">
                                                            <Calendar size={48} className="mx-auto mb-4 text-slate-400" />
                                                            <p className="text-slate-500">Aucun rendez-vous associé à cette action.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-xl   p-4">
                                                            <div className="mb-3 flex items-start justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <div>
                                                                        <span className="font-medium text-slate-700">Date du RDV :</span>

                                                                        <p className="text-slate-700">
                                                                            {new Date(action.rdv.date_rdv).toLocaleDateString('fr-FR', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                                                <div>
                                                                    <span className="font-medium text-slate-700">Représentant:</span>
                                                                    <p className="text-slate-600">{action.rdv.representant}</p>
                                                                </div>
                                                                          <div>
                                                                    <span className="font-medium text-slate-700">Fonction du Représentant:</span>
                                                                    <p className="text-slate-600">{action.rdv.fonction}</p>
                                                                </div>
                                                                          <div>
                                                                    <span className="font-medium text-slate-700">Détails:</span>
                                                                    <p className="text-slate-600">{action.rdv.details}</p>
                                                                </div>
                                                                          <div>
                                                                    <span className="font-medium text-slate-700">Téléphone:</span>
                                                                    <p className="text-slate-600">{action.rdv.telephone}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-700">Email:</span>
                                                                    <p className="text-slate-600">{action.rdv.email}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-700">Localisation:</span>
                                                                    <p className="text-slate-600">{action.rdv.localisation}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-700">Nom du Commerçant:</span>
                                                                    <p className="text-slate-600">{action.rdv.commercant?.name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
