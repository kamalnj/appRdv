import SearchAndFilters, { type ActiveFilter, type FilterOption } from '@/components/SearchAndFilters';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowUpDown, Briefcase, Building2, Download, Eye, FileText, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Entreprise',
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

export default function Index({ entreprises }: Props) {
    const [search, setSearch] = useState('');
    const [tribunalFilter, setTribunalFilter] = useState('');
    const tribunals = Array.from(new Set(entreprises.data.map((e) => e.tribunal))).sort();

    const filteredEntreprises = entreprises.data
        .filter((entreprise) => {
            const matchSearch =
                entreprise.denomination.toLowerCase().includes(search.toLowerCase()) ||
                entreprise.tribunal.toLowerCase().includes(search.toLowerCase()) ||
                entreprise.rc.toLowerCase().includes(search.toLowerCase());

            const matchTribunal = tribunalFilter ? entreprise.tribunal === tribunalFilter : true;

            return matchSearch && matchTribunal;
        })


    const clearFilters = () => {
        setSearch('');
        setTribunalFilter('');
    };

    const filterOptions: FilterOption[] = tribunals.map((tribunal) => ({
        value: tribunal,
        label: tribunal,
    }));

    const filters = [
        {
            key: 'tribunal',
            label: 'Tribunaux',
            value: tribunalFilter,
            options: filterOptions,
            onChange: setTribunalFilter,
            placeholder: 'Tous les tribunaux',
        },
    ];

    const activeFilters: ActiveFilter[] = [];
    if (tribunalFilter) {
        activeFilters.push({
            key: 'tribunal',
            label: 'Tribunal',
            value: tribunalFilter,
            onRemove: () => setTribunalFilter(''),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entreprises</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <a href='https://smartserv.ma/appS2/export/listeEntreprise' className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
                                    
                                    <Download className="h-4 w-4" />
                                    Exporter
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SearchAndFilters
                            searchValue={search}
                            onSearchChange={setSearch}
                            searchPlaceholder="Rechercher par nom, tribunal ou RC..."
                            filters={filters}
                            activeFilters={activeFilters}
                            onClearAll={clearFilters}
                        />

                        {/* Results Section */}
                        <div className="rounded-xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/80">
                            {/* Results Header */}
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Résultats</h3>
                                        <p className="text-sm text-gray-500">
                                            {filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''} trouvée
                                            {filteredEntreprises.length > 1 ? 's' : ''}
                                            {filteredEntreprises.length !== entreprises.data.length && (
                                                <span> sur {entreprises.data.length} au total</span>
                                            )}
                                        </p>
                                    </div>


                                </div>
                            </div>

                            {/* Results Content */}
                            {filteredEntreprises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-6 dark:from-neutral-800 dark:to-neutral-700">
                                        <AlertCircle className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Aucune entreprise trouvée</h3>
                                    <p className="mb-6 max-w-md text-center text-gray-500">
                                        Aucune entreprise ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre
                                        recherche.
                                    </p>
                                    {(search || tribunalFilter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                        >
                                            <X className="h-4 w-4" />
                                            Effacer les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                            <thead className="bg-gray-50/50 dark:bg-neutral-900/50">
                                                <tr>
                                                    <th
                                                        className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            Entreprise
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            Tribunal
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            RC
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white/50 dark:divide-neutral-700 dark:bg-neutral-900/50">
                                                {filteredEntreprises.map((entreprise) => (
                                                    <tr
                                                        key={entreprise.id}
                                                        className="group transition-all hover:bg-gray-50/50 dark:hover:bg-neutral-800/50"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="mr-3 flex-shrink-0">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50">
                                                                        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                </div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {entreprise.denomination}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                                                                <span className="text-sm text-gray-900 dark:text-white">{entreprise.tribunal}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <FileText className="mr-2 h-4 w-4 text-gray-400" />
                                                                <span className="font-mono text-sm text-gray-900 dark:text-white">
                                                                    {entreprise.rc}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link
                                                                href={`details/${entreprise.id}`}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all group-hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                Consulter
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Pagination */}
            {entreprises.total > entreprises.per_page && (
                <div className="border-t border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/80">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-2">
                            {entreprises.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                        link.active
                                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                                            : link.url
                                              ? 'text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700'
                                              : 'cursor-not-allowed text-gray-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{entreprises.from}</span>
                            {' à '}
                            <span className="font-medium text-gray-700 dark:text-gray-300">{entreprises.to}</span>
                            {' sur '}
                            <span className="font-medium text-gray-700 dark:text-gray-300">{entreprises.total}</span>
                            {' résultats'}
                        </div>
                    </div>
                </div>
            )}
            </AppLayout>
    );
}
