import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Assistante/Index',
    },
];

interface Entreprise {
    id: number;
    nom: string;
    secteur: string;
    localisation: string;
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprises: Entreprise[];
}

export default function Index({ auth, entreprises }: Props) {
    const [search, setSearch] = useState('');
    const [secteurFilter, setSecteurFilter] = useState('');
    const [localisationFilter, setLocalisationFilter] = useState('');

    const secteurs = Array.from(new Set(entreprises.map((e) => e.secteur))).sort();
    const localisations = Array.from(new Set(entreprises.map((e) => e.localisation))).sort();

    const filteredEntreprises = entreprises.filter((entreprise) => {
        const matchSearch =
            entreprise.nom.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.secteur.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.localisation.toLowerCase().includes(search.toLowerCase());

        const matchSecteur = secteurFilter ? entreprise.secteur === secteurFilter : true;
        const matchLocalisation = localisationFilter ? entreprise.localisation === localisationFilter : true;

        return matchSearch && matchSecteur && matchLocalisation;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="rounded-xl border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={secteurFilter}
                        onChange={(e) => setSecteurFilter(e.target.value)}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">Tous les secteurs</option>
                        {secteurs.map((secteur) => (
                            <option key={secteur} value={secteur}>
                                {secteur}
                            </option>
                        ))}
                    </select>

                    <select
                        value={localisationFilter}
                        onChange={(e) => setLocalisationFilter(e.target.value)}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">Toutes les localisations</option>
                        {localisations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>

                
                {filteredEntreprises.length === 0 ? (
    <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
        <span className="text-gray-400">Aucune entreprise ne correspond à votre recherche.</span>
    </div>
) : (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Secteur
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntreprises.map((entreprise) => (
                    <tr key={entreprise.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-indigo-500" />
                                <span className="text-lg font-bold text-gray-800">{entreprise.nom}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{entreprise.secteur}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link
                                href={`/entreprises/${entreprise.id}`}
                                className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                Voir
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

            </div>
        </AppLayout>
    );
}
