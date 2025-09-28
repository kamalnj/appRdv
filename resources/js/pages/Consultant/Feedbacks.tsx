import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import {  Calendar, Download, Eye, Filter, Sparkles, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Feedbacks', href: '/feedbacks' }];

interface FeedbackItem {
    feedback: string;
    count: number;
}

interface Assistante {
    id: number;
    name: string;
}

interface Filters {
    assistante_id: number | null;
    date_from: string | null;
    date_to: string | null;
}

interface Props {
    feedbackData: FeedbackItem[];
    assistantes: Assistante[];
    filters: Filters;
}

const Feedbacks = ({ feedbackData, assistantes, filters }: Props) => {
    const [selectedAssistanteId, setSelectedAssistanteId] = useState<number | null>(filters.assistante_id);
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from || '');
    const [dateTo, setDateTo] = useState<string>(filters.date_to || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const applyFilters = () => {
        setIsLoading(true);

        router.get(
            '/feedbacks',
            {
                assistante_id: selectedAssistanteId || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const clearFilters = () => {
        setSelectedAssistanteId(null);
        setDateFrom('');
        setDateTo('');
        setIsLoading(true);
        router.get(
            '/feedbacks',
            {},
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const hasChanges =
            selectedAssistanteId !== filters.assistante_id || dateFrom !== (filters.date_from || '') || dateTo !== (filters.date_to || '');

        if (hasChanges) {
            timeoutRef.current = setTimeout(applyFilters, 600);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [selectedAssistanteId, dateFrom, dateTo]);

    const totalCount = feedbackData.reduce((sum, item) => sum + item.count, 0);
    const hasActiveFilters = selectedAssistanteId || dateFrom || dateTo ;
    const selectedAssistanteName = assistantes.find((a) => a.id === selectedAssistanteId)?.name;

    // Filter and sort data
    const filteredData = feedbackData
        .map((item) => ({
            ...item,
            percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0,
        }))

    const exportData = () => {
        if (!filteredData?.length) return;

        const BOM = '\uFEFF';
        const headers = ['Type de Feedback', 'Nombre', 'Pourcentage'];

        const escapeCSV = (value: string | number) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (/[",;\n]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = filteredData.map((item) => [escapeCSV(item.feedback), escapeCSV(item.count), escapeCSV(`${item.percentage.toFixed(2)}%`)]);

        const delimiter = ';';
        const csvContent = [headers, ...rows].map((row) => row.join(delimiter)).join('\n');

        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `feedbacks-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
                <div className="mx-auto max-w-7xl space-y-8 pb-8">
                    {/* Enhanced Header */}
                    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
                        <div className="relative px-8 py-10">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analyse des Feedbacks</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                    {isLoading && (
                                        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                            <span className="text-sm font-medium">Mise à jour...</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                                            hasActiveFilters
                                                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filtres
                                        {hasActiveFilters && (
                                            <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                                                {[selectedAssistanteName, dateFrom, dateTo].filter(Boolean).length}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={exportData}
                                        disabled={filteredData.length === 0}
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Download className="h-4 w-4" />
                                        Exporter CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collapsible Filters */}
                    {showFilters && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                        <Sparkles className="h-5 w-5 text-blue-600" />
                                        Filtres Avancés
                                    </h3>
                                    <button onClick={() => setShowFilters(false)} className="rounded-lg p-2 transition-colors hover:bg-white/50">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 p-6">
                                <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-md">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Filter className="h-5 w-5 text-blue-500" />
                                        Filtres
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* Assistante Filter */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <User className="h-4 w-4 text-gray-500" />
                                                Assistante
                                            </label>
                                            <select
                                                value={selectedAssistanteId ?? ''}
                                                onChange={(e) => setSelectedAssistanteId(e.target.value ? Number(e.target.value) : null)}
                                                disabled={isLoading}
                                                className="w-full rounded-xl border-gray-300 px-3 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                                            >
                                                <option value="">Toutes les assistantes</option>
                                                {assistantes.map((assistante) => (
                                                    <option key={assistante.id} value={assistante.id}>
                                                        {assistante.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Date From */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                Date de début
                                            </label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full rounded-xl border-gray-300 px-3 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                                            />
                                        </div>

                                        {/* Date To */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                Date de fin
                                            </label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                min={dateFrom || undefined}
                                                disabled={isLoading}
                                                className="w-full rounded-xl border-gray-300 px-3 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Active Filters */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                                        <span className="text-sm font-medium text-gray-600">Filtres actifs:</span>
                                        {selectedAssistanteName && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                                {selectedAssistanteName}
                                            </span>
                                        )}
                                        {dateFrom && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                                Depuis: {new Date(dateFrom).toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                        {dateTo && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                                Jusqu'à: {new Date(dateTo).toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                        <button
                                            onClick={clearFilters}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                                        >
                                            <X className="h-3 w-3" />
                                            Tout effacer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Mode Toggle & Results */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                        <Eye className="h-5 w-5 text-blue-600" />
                                        Résultats des Feedbacks
                                    </h3>
                                </div>
                            </div>
                        </div>
                        {/* Results Content */}
                        {filteredData.length > 0 ? (
                            <div className="p-6">
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                                                        Type de Feedback
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-gray-700 uppercase">
                                                        Nombre
                                                </th>
                                       
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {filteredData.map((item, index) => {
                                                return (
                                                    <tr key={index} className="transition-colors hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium`}>
                                                                    {item.feedback}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="inline-flex items-center rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-lg font-bold text-blue-900">
                                                                {item.count.toLocaleString()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="py-16">
                                <div className="text-center">
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                        {isLoading ? '🔄 Chargement en cours...' : ' Aucun feedback trouvé'}
                                    </h3>
                                    <p className="mx-auto max-w-md text-lg text-gray-600">
                                        {isLoading
                                            ? 'Nous récupérons les données pour les critères sélectionnés.'
                                            : hasActiveFilters
                                              ? 'Aucun résultat ne correspond à vos critères de recherche.'
                                              : "Il semble qu'il n'y ait aucun feedback disponible pour le moment."}
                                    </p>
                           
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Feedbacks;
