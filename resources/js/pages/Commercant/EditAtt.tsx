import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import SuccessModal from '@/components/ui/SuccessModal';


interface Props {
    attData: {
        id: number;
        entreprise_id: string;
        rdv_id: string;
        loi: boolean;
        dossier_technique: boolean;
        leve_fond: boolean;
        iso: boolean;
        test: boolean;
        test_: boolean;
    };
}

export default function EditAtt({ attData }: Props) {
        const [isModalOpen, setIsModalOpen] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: 'Commercant/dashboardC' },
        { title: 'Calendrier', href: `/calendrier` },
        { title: 'Finalisation', href: '#' },
    ];
    type AttFormData = {
        loi: boolean;
        dossier_technique: boolean;
        leve_fond: boolean;
        iso: boolean;
        test: boolean;
        test_: boolean;
    };

    const { data, setData, put, reset, processing, errors } = useForm<AttFormData>({
        loi: attData.loi,
        dossier_technique: attData.dossier_technique,
        leve_fond: attData.leve_fond,
        iso: attData.iso,
        test: attData.test,
        test_: attData.test_,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/attcom/edit/${attData.id}`, {
            onSuccess: () => {
                reset();
                setIsModalOpen(true);
            },
        });
    };
    type AttKey = keyof AttFormData;

    const checkboxItems: {
        key: AttKey;
        label: string;
        description: string;
        required: boolean;
    }[] = [
        {
            key: 'loi',
            label: 'Loi',
            description: 'Conformité aux réglementations légales',
            required: false,
        },
        {
            key: 'dossier_technique',
            label: 'Dossier technique',
            description: 'Documentation technique complète',
            required: false,
        },
        {
            key: 'leve_fond',
            label: 'Levée de fonds',
            description: 'Processus de financement',
            required: false,
        },
        {
            key: 'iso',
            label: 'Certification ISO',
            description: 'Standards de qualité internationaux',
            required: false,
        },
        {
            key: 'test',
            label: 'Tests de validation',
            description: 'Validation des processus',
            required: false,
        },
        {
            key: 'test_',
            label: 'Tests complémentaires',
            description: 'Tests additionnels si nécessaire',
            required: false,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-6">
                        <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Mise à jour Finalisation</h1>
                        <p className="text-gray-600 dark:text-white">Sélectionnez les éléments requis pour finaliser le processus</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {checkboxItems.map((item) => (
                                <div key={item.key} className="relative">
                                    <label className="flex cursor-pointer items-start space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                                        <input
                                            type="checkbox"
                                            name={item.key}
                                            checked={data[item.key]} 
                                            onChange={(e) => setData(item.key, e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-offset-gray-800"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                        </div>
                                    </label>
                                    {errors[item.key] && <p className="mt-1 text-sm text-red-600">{errors[item.key]}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Réinitialiser
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Traitement...
                                    </span>
                                ) : (
                                    'Finaliser'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
                        <SuccessModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            message="Modifier Avec Succès"
                            buttonText="Continuer"
                            onContinue={() => router.visit('/calendrier')}
                        />
        </AppLayout>
    );
}
