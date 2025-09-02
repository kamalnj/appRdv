import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import SuccessModal from '@/components/ui/SuccessModal';


interface FinalFormData {
        [key: string]: string | boolean;
    entreprise_id: string;
    rdv_id: string;
    loi: boolean;
    dossier_technique: boolean;
    leve_fond: boolean;
    iso: boolean;
    test: boolean;
    test_: boolean;
}

interface Props {
    rdvs: { id: number };
    entreprise: { id: number; denomination: string };
}

export default function Final({ rdvs, entreprise }: Props) {
            const [isModalOpen, setIsModalOpen] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: 'Commercant/dashboardC' },
        { title: 'Calendrier', href: `/calendrier` },
        { title: 'Finalisation', href: '#' },
    ];

    const { data, setData, reset, post, processing, errors } = useForm<FinalFormData>({
        entreprise_id: entreprise.id.toString(),
        rdv_id: rdvs.id.toString(),
        loi: false,
        dossier_technique: false,
        leve_fond: false,
        iso: false,
        test: false,
        test_: false,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('Form data:', data);
        post(`/final/${rdvs.id}/${entreprise.id}`, {
            onSuccess: () => {
                reset();
                setIsModalOpen(true);
            },
        });
    };

    const checkboxItems = [
        {
            key: 'loi' ,
            label: 'Loi',
            description: 'Conformité aux réglementations légales',
            required: true
        },
        {
            key: 'dossier_technique' ,
            label: 'Dossier technique',
            description: 'Documentation technique complète',
            required: true
        },
        {
            key: 'leve_fond' ,
            label: 'Levée de fonds',
            description: 'Processus de financement',
            required: true
        },
        {
            key: 'iso' ,
            label: 'Certification ISO',
            description: 'Standards de qualité internationaux',
            required: false
        },
        {
            key: 'test',
            label: 'Tests de validation',
            description: 'Validation des processus',
            required: false
        },
        {
            key: 'test_' ,
            label: 'Tests complémentaires',
            description: 'Tests additionnels si nécessaire',
            required: false
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-white">
                            Finalisation - {entreprise.denomination}
                        </h1>
                        <p className="text-gray-600">
                            Sélectionnez les éléments requis pour finaliser le processus
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {checkboxItems.map((item) => (
                                <div key={item.key} className="relative">
                                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:border-gray-700 dark:hover:bg-gray-700">
                                        <input
                                            type="checkbox"
                                            name={item.key}
                                            checked={data[item.key] as boolean}
                                            onChange={(e) => setData(item.key, e.target.checked)}
                                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded "
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </label>
                                    {errors[item.key] && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[item.key]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Réinitialiser
                            </button>
                            
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                                        message="Enregistrer Avec Succès"
                                        buttonText="Continuer"
                                        onContinue={() => router.visit('/calendrier')}
                                    />
        </AppLayout>
    );
}