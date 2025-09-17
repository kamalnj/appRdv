import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, Search,Eye, FileText, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises à recontacter',
        href: '/entreprises_recontact',
    },
];


interface Entreprise {
    id: number;
    denomination: string;
    tribunal: string;
    rc: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprises: PaginatedResponse<Entreprise>;
}


export default function EntepriseRec({ auth, entreprises }: Props) {
    const [search, setSearch] = useState('');
    const [tribunalFilter, setTribunalFilter] = useState('');

    const tribunals = Array.from(new Set(entreprises.data.map((e) => e.tribunal))).sort();

    // Compter les filtres actifs

    const filteredEntreprises = entreprises.data.filter((entreprise) => {
        const matchSearch =
            entreprise.denomination.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.tribunal.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.rc.toLowerCase().includes(search.toLowerCase());

        const matchTribunal = tribunalFilter ? entreprise.tribunal === tribunalFilter : true;

        return matchSearch && matchTribunal;
    });

    const clearFilters = () => {
        setSearch('');
        setTribunalFilter('');
        router.visit(route('entreprises.recontact'), { 
            method: 'get',
            preserveState: false 
        });
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises à recontacter" />

            <div className="min-h-screen bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
                    <div className="space-y-6">
    
                        {/* Section Recherche et Filtres */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="space-y-4">
                                {/* Barre de recherche et boutons */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom, tribunal ou RC..."
                                            className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Filtres standards */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <select
                                        value={tribunalFilter}
                                        onChange={(e) => setTribunalFilter(e.target.value)}
                                        className="dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-w-48"
                                    >
                                        <option value="">Tous les tribunaux</option>
                                        {tribunals.map((tribunal) => (
                                            <option key={tribunal} value={tribunal}>
                                                {tribunal}
                                            </option>
                                        ))}
                                    </select>

                                    {(search || tribunalFilter ) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section Résultats */}
                        <div className="bg-white rounded-xl shadow-sm border dark:text-neutral-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">
                                        Résultats
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            ({filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''})
                                        </span>
                                    </h3>
                                    
                                    {filteredEntreprises.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {filteredEntreprises.length} sur {entreprises.data.length} entreprise{entreprises.data.length > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {filteredEntreprises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-50 mb-2">Aucune entreprise trouvée</h3>
                                    <p className="text-gray-500 text-center max-w-md">
                                        Aucune entreprise ne correspond à vos critères de recherche. 
                                        Essayez de modifier vos filtres ou votre recherche.
                                    </p>
                                    {(search || tribunalFilter ) && (
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Entreprise
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tribunal
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    RC
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            {filteredEntreprises.map((entreprise) => (
                                                <tr key={entreprise.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-neutral-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-neutral-50">
                                                                    {entreprise.denomination}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Briefcase className="h-4 w-4 text-gray-400 mr-2 dark:text-neutral-50" />
                                                            <span className="text-sm text-gray-900 dark:text-neutral-50">{entreprise.tribunal}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-sm font-mono text-gray-900 dark:text-neutral-50">{entreprise.rc}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/entreprises/${entreprise.id}`}
                                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Consulter
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 dark:border-neutral-700/60 dark:bg-neutral-900/70'>
                <div className="flex items-center space-x-2">
                    {entreprises.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                link.active 
                                    ? 'bg-indigo-600 text-white' 
                                    : link.url 
                                        ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700' 
                                        : 'text-gray-400 cursor-not-allowed'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
                
                <div className="text-sm text-gray-500">
                    Affichage de {entreprises.from} à {entreprises.to} sur {entreprises.total} résultats
                </div>
            </div>
        </AppLayout>
    );
}