import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Briefcase, Eye, FileText, Search, Settings, X } from 'lucide-react';
import { useState } from 'react';

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
    rdvs_count: number;
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
    { key: 'dossier_technique', label: 'Dossier Technique' },
    { key: 'leve_fond', label: 'Levée de Fonds' },
    { key: 'iso', label: 'ISO' },
    { key: 'test', label: 'Test' },
    { key: 'test_', label: 'Test_' },
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
            preserveState: false,
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
        router.get(
            route('entreprises.index'),
            {
                filters: selectedFilters,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );

        setShowAdvancedFilters(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

            <div className="min-h-screen bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Section Recherche et Filtres */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="space-y-4">
                                {/* Barre de recherche et boutons */}
                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom, tribunal ou RC..."
                                            className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            className={`inline-flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                                activeFiltersCount > 0
                                                    ? 'border border-indigo-200 bg-indigo-100 text-indigo-700'
                                                    : 'border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            Filtres avancés
                                            {activeFiltersCount > 0 && (
                                                <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                                                    {activeFiltersCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Filtres standards */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <select
                                        value={tribunalFilter}
                                        onChange={(e) => setTribunalFilter(e.target.value)}
                                        className="min-w-48 rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
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
                                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>

                                {/* Filtres avancés */}
                                {showAdvancedFilters && (
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Filtres avancés</h4>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                            {docFields.map((filter) => (
                                                <label
                                                    key={filter.key}
                                                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                                                        selectedFilters[filter.key]
                                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900/20'
                                                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
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
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => setShowAdvancedFilters(false)}
                                                className="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={applyAdvancedFilters}
                                                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                            >
                                                Appliquer les filtres
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Filtres actifs */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex flex-wrap gap-2 border-t pt-2">
                                        <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Filtres actifs:</span>
                                        {Object.entries(selectedFilters).map(([key, value]) => {
                                            if (!value) return null;
                                            const filter = docFields.find((f) => f.key === key);
                                            return (
                                                <span
                                                    key={key}
                                                    className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
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
                        <div className="rounded-xl border bg-white shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-neutral-50">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">
                                        Résultats
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            ({filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''})
                                        </span>
                                    </h3>

                                    {filteredEntreprises.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {filteredEntreprises.length} sur {entreprises.data.length} entreprise
                                            {entreprises.data.length > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {filteredEntreprises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-neutral-50">Aucune entreprise trouvée</h3>
                                    <p className="max-w-md text-center text-gray-500">
                                        Aucune entreprise ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre
                                        recherche.
                                    </p>
                                    {(search || tribunalFilter || activeFiltersCount > 0) && (
                                        <button onClick={clearFilters} className="mt-4 font-medium text-indigo-600 hover:text-indigo-700">
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Entreprise
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Tribunal
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">RC</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    RDV
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            {filteredEntreprises.map((entreprise) => (
                                                <tr key={entreprise.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-neutral-50">
                                                                    {entreprise.denomination}
                                                                </div>
                                                                {entreprise.attcom && (
                                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                                        {docFields.map(({ key, label }) => (
                                                                            <span
                                                                                key={key}
                                                                                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${
                                                                                    entreprise.attcom?.[key]
                                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                                                }`}
                                                                                title={docFields.find((f) => f.key === key)?.label}
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
                                                            <Briefcase className="mr-2 h-4 w-4 text-gray-400 dark:text-neutral-50" />
                                                            <span className="text-sm text-gray-900 dark:text-neutral-50">{entreprise.tribunal}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FileText className="mr-2 h-4 w-4 text-gray-400" />
                                                            <span className="font-mono text-sm text-gray-900 dark:text-neutral-50">
                                                                {entreprise.rc}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center font-mono text-sm text-gray-900 dark:text-neutral-50">
                                                            {entreprise.rdvs_count > 0 ? (
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                    OUI
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-800 dark:text-red-100">
                                                                    NON
                                                                </span>
                                                            )}{' '}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Link
                                                            href={`/entreprises/${entreprise.id}`}
                                                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
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
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                <div className="flex items-center space-x-2">
                    {entreprises.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                link.active
                                    ? 'bg-indigo-600 text-white'
                                    : link.url
                                      ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                      : 'cursor-not-allowed text-gray-400'
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
