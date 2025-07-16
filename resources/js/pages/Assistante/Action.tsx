// Updated Action.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import PageHeader from '@/components/PageHeader';
import ActionSection from '@/components/ActionSection';
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
}

interface Props {
    entreprise: { id: number; denomination: string };
    assistants: Array<{ id: number; name: string }>;
    commercants: Array<{ id: number; name: string }>;
    rdvsPris: Record<string, string[]>; 
}

export default function Action({ entreprise, assistants, commercants, rdvsPris }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Entreprises', href: '/entreprises' },
        { title: entreprise.denomination, href: `/entreprises/${entreprise.id}` },
        { title: 'Nouveau Action', href: `/entreprises/${entreprise.id}/action` },
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
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Additional client-side validation for RDV conflicts
        if (form.data.commercant_id && form.data.date_rdv) {
            const rdvsIndisponibles = rdvsPris[form.data.commercant_id] || [];
            const normalizeDate = (dateStr: string) => dateStr.slice(0, 16);
            
            if (rdvsIndisponibles.some(d => normalizeDate(d) === normalizeDate(form.data.date_rdv))) {
                alert('Ce créneau est déjà réservé, veuillez en choisir un autre.');
                return;
            }
        }
        
        console.log('Form data:', form.data);
        form.post(`/entreprises/${entreprise.id}/action`, {
            onSuccess: () => {
                form.reset();
                alert('RDV et Action créés avec succès!');
            },
            onError: (errors) => {
                console.log('Backend validation errors:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={entreprise.denomination} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
                <div className="mx-auto max-w-5xl px-4">
                    <PageHeader
                        title="Créer RDV et Action"
                        subtitle="Entreprise:"
                        entrepriseName={entreprise.denomination}
                    />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <ActionSection form={form} />
                        <RDVSection 
                            form={form} 
                            commercants={commercants} 
                            rdvsPris={rdvsPris || {}} // Pass the rdvsPris prop
                        />
                        <SubmitButton isProcessing={form.processing} />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}