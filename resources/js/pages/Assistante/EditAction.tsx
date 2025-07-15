import AppLayout from '@/layouts/app-layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { FEEDBACK_OPTIONS, NEXT_STEP_OPTIONS, BESOIN_CLIENT_OPTIONS } from '@/constants/formOptions';
import { type BreadcrumbItem } from '@/types';
import { CalendarIcon, EnvelopeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    entreprise: {
        id: number;
        nom: string;
    };
    action: {
        id: number;
        feedback: string;
        next_step: string;
        besoin_client: string;
        commentaire: string;
    };
    rdv: {
        date_rdv: string;
        representant: string;
        email: string;
        localisation: string;
        commercant_id: number;
    };
    commercants: { id: number; name: string }[];
}

export default function EditAction({ entreprise, action, rdv, commercants }: Props) {
    const [activeTab, setActiveTab] = useState<'action' | 'rdv'>('action');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const { data, setData, put, processing, errors } = useForm({
        feedback: action.feedback || '',
        next_step: action.next_step || '',
        besoin_client: action.besoin_client || '',
        commentaire_action: action.commentaire || '',
        date_rdv: rdv.date_rdv || '',
        representant: rdv.representant || '',
        email: rdv.email || '',
        localisation: rdv.localisation || '',
        commercant_id: rdv.commercant_id || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            await put(`/entreprises/${entreprise.id}/actions/${action.id}`);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Entreprises',
            href: '/entreprises',
        },
        {
            title: entreprise.nom,
            href: `/entreprises/${entreprise.id}`,
        },
        {
            title: 'Liste des actions',
            href: `/entreprises/${entreprise.id}/liste-actions`,
        },
        {
            title: 'Modifier action',
            href: `/entreprises/${entreprise.id}/actions/{action}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier Action - ${entreprise.nom}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Modifier l'action</h1>
                        <p className="text-lg text-gray-600">
                            Pour l'entreprise <span className="font-semibold text-blue-600">{entreprise.nom}</span>
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="flex rounded-2xl border border-gray-200/50 bg-white/70 p-2 shadow-sm backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('action')}
                                className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                                    activeTab === 'action'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                }`}
                            >
                                Détails de l'action
                            </button>
                            <button
                                onClick={() => setActiveTab('rdv')}
                                className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                                    activeTab === 'rdv'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                }`}
                            >
                                Rendez-vous associé
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-2xl border border-gray-200/50 bg-white/70 shadow-sm backdrop-blur-sm">
                            {/* Action Tab */}
                            <div className={`p-8 transition-all duration-300 ${activeTab === 'action' ? 'block' : 'hidden'}`}>
                                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    Détails de l'action
                                </h2>

                                <div className="grid gap-6">
                                    <SelectField
                                        label="* Feedback"
                                        value={data.feedback}
                                        onChange={(value) => setData('feedback', value as string)}
                                        error={errors.feedback}
                                        options={FEEDBACK_OPTIONS}
                                        placeholder="Choisissez un feedback"
                                        required={true}
                                    />

                                    <SelectField
                                        label="* Prochaine étape"
                                        value={data.next_step}
                                        onChange={(value) => setData('next_step', value as string)}
                                        error={errors.next_step}
                                        options={NEXT_STEP_OPTIONS}
                                        placeholder="Choisissez une étape"
                                        required={true}
                                    />

                                    <SelectField
                                        label="* Besoin du client"
                                        value={data.besoin_client}
                                        onChange={(value) => setData('besoin_client', value as string)}
                                        error={errors.besoin_client}
                                        options={BESOIN_CLIENT_OPTIONS}
                                        placeholder="Choisissez le besoin"
                                        required={true}
                                    />

                                    <InputField
                                        label="Commentaire"
                                        value={data.commentaire_action}
                                        onChange={(value) => setData('commentaire_action', value)}
                                        error={errors.commentaire_action}
                                        multiline={true}
                                        rows={3}
                                        placeholder="Ajoutez vos commentaires additionnels..."
                                    />
                                </div>
                            </div>

                            {/* RDV Tab */}
                            <div className={`p-8 transition-all duration-300 ${activeTab === 'rdv' ? 'block' : 'hidden'}`}>
                                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    Rendez-vous associé
                                </h2>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Date et heure du RDV"
                                            value={data.date_rdv}
                                            onChange={(value) => setData('date_rdv', value)}
                                            error={errors.date_rdv}
                                            type="datetime-local"
                                            icon={CalendarIcon}
                                        />
                                    </div>

                                    <InputField
                                        label="Représentant"
                                        value={data.representant}
                                        onChange={(value) => setData('representant', value)}
                                        error={errors.representant}
                                        placeholder="Nom du représentant"
                                        icon={UserIcon}
                                    />

                                    <InputField
                                        label="Email"
                                        value={data.email}
                                        onChange={(value) => setData('email', value)}
                                        error={errors.email}
                                        type="email"
                                        placeholder="email@exemple.com"
                                        icon={EnvelopeIcon}
                                    />

                                    <InputField
                                        label="Localisation"
                                        value={data.localisation}
                                        onChange={(value) => setData('localisation', value)}
                                        error={errors.localisation}
                                        placeholder="Adresse du rendez-vous"
                                        icon={MapPinIcon}
                                    />

                                    <SelectField
                                        label="Commerçant"
                                        value={data.commercant_id}
                                        onChange={(value) => setData('commercant_id', Number(value))}
                                        error={errors.commercant_id}
                                        options={commercants.map((c) => ({ id: c.id, name: c.name }))}
                                        placeholder="-- Sélectionner un commerçant --"
                                        icon={UserIcon}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="rounded-b-2xl border-t border-gray-200/50 bg-gray-50/50 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {saveStatus === 'success' && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                                <span className="text-sm font-medium">Modifications enregistrées</span>
                                            </div>
                                        )}
                                        {saveStatus === 'error' && (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                <span className="text-sm font-medium">Erreur lors de l'enregistrement</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || isSaving}
                                        className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all duration-200 ${
                                            processing || isSaving
                                                ? 'cursor-not-allowed bg-gray-400'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95'
                                        } text-white shadow-lg`}
                                    >
                                        {(processing || isSaving) && (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        )}
                                        {processing || isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}