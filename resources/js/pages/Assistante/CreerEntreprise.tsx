import { ActivityLocationSection } from '@/components/ActivityLocationSection';
import { ContactManagementSection } from '@/components/ContactManagementSection';
import { FinancialInfoSection } from '@/components/FinancialInfoSection';
import { GeneralInfoSection } from '@/components/GeneralInfoSection';
import SuccessModal from '@/components/ui/SuccessModal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

const CreerEntreprise = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Nouvelle Entreprise', href: '/entreprises' }];
    
    const [formData, setFormData] = useState({
        denomination: '',
        rc: '',
        tribunal: '',
        capital_social: '',
        object_social: '',
        adresse: '',
        ice: '',
        bilan_date: '',
        chiffre_affaire: '',
        tel: '',
        diregeants: '',
        lot: '',
    });

    const handleChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (formData.tel) {
            const phones = formData.tel.split(',').map(t => t.trim());
            const phoneRegex = /^0[5-7]\d{8}$/;
            phones.forEach(phone => {
                if (!phoneRegex.test(phone)) {
                    newErrors.tel = 'Format invalide. Utilisez: 0650724022,0650724023';
                }
            });
        }

        if (formData.diregeants) {
            const dirigeants = formData.diregeants.split(',');
            dirigeants.forEach(item => {
                const parts = item.split('-');
                if (parts.length !== 3) {
                    newErrors.diregeants = 'Format invalide. Utilisez: Nom-Prenom-Fonction';
                }
            });
        }

        if (formData.ice && !/^\d{15}$/.test(formData.ice)) {
            newErrors.ice = 'ICE doit contenir 15 chiffres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const formattedTels = formData.tel.split(',').map(t => t.trim());
        const formattedDirigeants = formData.diregeants
            .split(',')
            .map(item => {
                const [nom, prenom, fonction] = item.split('-').map(s => s.trim());
                return { nom, prenom, fonction };
            });

        const formattedData = {
            ...formData,
            tel: formattedTels,
            diregeants: formattedDirigeants,
        };

        console.log("📦 Data sent to Laravel:", formattedData);

        router.post('/save-entreprises', formattedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                setIsModalOpen(true);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error("Validation errors:", errors);
                setErrors(errors as Record<string, string>);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une Nouvelle Entreprise" />
            <div className="mx-auto max-w-5xl py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Nouvelle Entreprise
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Remplissez les informations ci-dessous pour créer une nouvelle entreprise dans le système
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <GeneralInfoSection
                        formData={{
                            denomination: formData.denomination,
                            ice: formData.ice,
                            rc: formData.rc,
                            tribunal: formData.tribunal,
                            lot: formData.lot,
                        }}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <FinancialInfoSection
                        formData={{
                            capital_social: formData.capital_social,
                            chiffre_affaire: formData.chiffre_affaire,
                            bilan_date: formData.bilan_date,
                        }}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <ActivityLocationSection
                        formData={{
                            object_social: formData.object_social,
                            adresse: formData.adresse,
                        }}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <ContactManagementSection
                        formData={{
                            tel: formData.tel,
                            diregeants: formData.diregeants,
                        }}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <div className="flex items-center justify-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => router.visit('/entreprises')}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-4 w-4" />
                                    Enregistrer l'Entreprise
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <SuccessModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    message="Entreprise enregistrée avec succès !"
                    buttonText="Voir les Entreprises"
                    onContinue={() => router.visit('/entreprises')}
                />
            </div>
        </AppLayout>
    );
};

export default CreerEntreprise;