import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, Search,Eye, FileText, AlertCircle, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Assistante/Index',
    },
];

interface AttCom {
    loi?: boolean;
    dossier_technique?: boolean;
    leve_fond?: boolean;
    iso?: boolean;
    test?: boolean;
    test_?: boolean;
    [key: string]: boolean | undefined;
}

interface Entreprise {
    id: number;
    denomination: string;
    tribunal: string;
    rc: string;
    attcom?: AttCom;
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
    filters?: { [key: string]: boolean };
}

// Configuration des filtres de documents (basée sur votre code)
const docFields = [
    { key: 'loi', label: 'Loi' },
    { key: 'dossier_technique', label: 'Dossier Technique'},
    { key: 'leve_fond', label: 'Levée de Fonds' },
    { key: 'iso', label: 'ISO'},
    { key: 'test', label: 'Test'},
    { key: 'test_', label: 'Test_'},
];

export default function Index({ auth, entreprises, filters = {} }: Props) {
    const [search, setSearch] = useState('');
    const [tribunalFilter, setTribunalFilter] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>(filters || {});

    const tribunals = Array.from(new Set(entreprises.data.map((e) => e.tribunal))).sort();

    // Compter les filtres actifs
    const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length;

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
        setSelectedFilters({});
        router.visit(route('entreprises.index'), { 
            method: 'get',
            preserveState: false 
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedFilters((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const applyAdvancedFilters = () => {
        router.get(route('entreprises.index'), {
            filters: selectedFilters,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
        
        setShowAdvancedFilters(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

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

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            className={`inline-flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                activeFiltersCount > 0 
                                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Filtres avancés
                                            {activeFiltersCount > 0 && (
                                                <span className="ml-2 bg-indigo-600 text-white rounded-full px-2 py-0.5 text-xs">
                                                    {activeFiltersCount}
                                                </span>
                                            )}
                                        </button>
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

                                    {(search || tribunalFilter || activeFiltersCount > 0) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>

                                {/* Filtres avancés */}
                                {showAdvancedFilters && (
                                    <div className="border-t pt-4 mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Filtres avancés
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                            {docFields.map((filter) => (
                                                <label
                                                    key={filter.key}
                                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        selectedFilters[filter.key]
                                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400'
                                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={filter.key}
                                                        className="sr-only"
                                                        checked={!!selectedFilters[filter.key]}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <span className="text-sm font-medium">{filter.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => setShowAdvancedFilters(false)}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={applyAdvancedFilters}
                                                className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Appliquer les filtres
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Filtres actifs */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filtres actifs:</span>
                                        {Object.entries(selectedFilters).map(([key, value]) => {
                                            if (!value) return null;
                                            const filter = docFields.find(f => f.key === key);
                                            return (
                                                <span
                                                    key={key}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                >
                                                    {filter?.label}
                                                    <button
                                                        onClick={() => {
                                                            const newFilters = { ...selectedFilters };
                                                            delete newFilters[key];
                                                            setSelectedFilters(newFilters);
                                                        }}
                                                        className="ml-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
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
                                    {(search || tribunalFilter || activeFiltersCount > 0) && (
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
                                                                {entreprise.attcom && (
                                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                                        {docFields.map(({ key , label }) => (
                                                                            <span
                                                                                key={key}
                                                                                className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded ${
                                                                                    entreprise.attcom?.[key] 
                                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                                                }`}
                                                                                title={docFields.find(f => f.key === key)?.label}
                                                                            >
                                                                                {label}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
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