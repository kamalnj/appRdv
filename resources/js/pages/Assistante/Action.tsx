import SuccessModal from '@/components/ui/SuccessModal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import ActionSection from '@/components/ActionSection';
import PageHeader from '@/components/PageHeader';
import RDVSection from '@/components/RDVSection';
import SubmitButton from '@/components/SubmitButton';

interface CombinedData {
    [key: string]: string | boolean;
    entreprise_id: string;
    commercant_id: string;
    date_rdv: string;
    representant: string;
    email: string;
    localisation: string;
    feedback: string;
    next_step: string;
    besoin_client: string;
    commentaire_action: string;
    contact: string;
    fonction: string;
    details: string;
    telephone: string;
}

interface Props {
    entreprise: { id: number; denomination: string };
    assistants: Array<{ id: number; name: string }>;
    commercants: Array<{ id: number; name: string }>;
    rdvsPris: Record<string, { date_rdv: string; details: string }[]>;
}

export default function Action({ entreprise, commercants, rdvsPris }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRDVForm, setShowRDVForm] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Entreprises', href: '/entreprises' },
        { title: entreprise.denomination, href: `/entreprises/${entreprise.id}` },
        { title: 'Nouvelle Action', href: `/entreprises/${entreprise.id}/action` },
    ];

    const form = useForm<CombinedData>({
        entreprise_id: entreprise.id.toString(),
        commercant_id: '',
        date_rdv: '',
        representant: '',
        email: '',
        localisation: '',
        feedback: '',
        next_step: '',
        besoin_client: '',
        commentaire_action: '',
        contact: '',
        fonction: '',
        details: '',
        telephone: '',
    });

    // Save only Action
    const handleSaveAction: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(`/entreprises/${entreprise.id}/action-only`, {
            onSuccess: () => setIsModalOpen(true),
        });
    };

    // Save Action + RDV
    const handleSaveActionWithRDV: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(`/entreprises/${entreprise.id}/action`, {
            onSuccess: () => setIsModalOpen(true),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={entreprise.denomination} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
                <div className="mx-auto max-w-5xl px-4">
                    <PageHeader 
                        title="Créer Action et/ou RDV" 
                        subtitle="Entreprise:" 
                        entrepriseName={entreprise.denomination} 
                    />

                    {/* Action Form */}
                    <form onSubmit={handleSaveAction} className="space-y-8 ">
                        <ActionSection form={form} />

                        <div className="flex gap-4 justify-end">
                            <SubmitButton
                                isProcessing={form.processing}
                            />

                            {!showRDVForm && (
                                <button
                                    type="button"
                                    onClick={() => setShowRDVForm(true)}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                Ajouter un RDV
                                </button>
                            )}
                        </div>
                    </form>

                    {/* RDV Form (appears after button click) */}
                    {showRDVForm && (
                        <form onSubmit={handleSaveActionWithRDV} className="space-y-8 mt-8">
                            <RDVSection 
                                form={form} 
                                commercants={commercants} 
                                rdvsPris={rdvsPris || {}} 
                            />
                            <SubmitButton
                                isProcessing={form.processing}
                            />
                        </form>
                    )}
                </div>
            </div>

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message="Enregistré avec succès !"
                buttonText="Continuer"
                onContinue={() => router.visit(`/entreprises/${entreprise.id}`)}
            />
        </AppLayout>
    );
}
