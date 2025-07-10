import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin } from 'lucide-react';

interface Entreprise {
    id: number;
    nom: string;
    secteur: string;
    localisation: string;
    email: string;
    telephone: string;
    active: boolean;
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprise: Entreprise;
}

export default function Show({ auth, entreprise }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Entreprises',
            href: '/entreprises',
        },
        {
            title: entreprise.nom,
            href: `/entreprises/${entreprise.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={entreprise.nom} />
            <Link href="/entreprises" className="ml-1.5 text-sm text-indigo-600 hover:underline">
                ← Retour à la liste
            </Link>
            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">{entreprise.nom}</h1>
                </div>

                <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Building2 className="text-indigo-500" />
                        <span className="text-lg">{entreprise.nom}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <Briefcase className="text-indigo-500" />
                        <span>Secteur : {entreprise.secteur}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="text-indigo-500" />
                        <span>Localisation : {entreprise.localisation}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <span className="font-medium">Email :</span>
                        <span>{entreprise.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <span className="font-medium">Téléphone :</span>
                        <span>{entreprise.telephone}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <span className="font-medium">Statut :</span>
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                entreprise.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {entreprise.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <button className=" cursor-pointer inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600">
                        Actions
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
