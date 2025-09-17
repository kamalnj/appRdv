import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Briefcase, Calendar, ClipboardList, Download, FileSpreadsheet, MapPin, Mail, Phone, Filter, X } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Entreprise',
    },
];

type RDV = {
    id: number;
    entreprise_id: number;
    assistante_id: number;
    commercant_id: number;
    representant: string;
    email: string;
    fonction: string;
    details?: string;
    telephone?: string;
    date_rdv?: string;
    localisation?: string;
    status?: string;
};

type Entreprise = {
    id: number;
    denomination: string;
};

type Action = {
    id: number;
    entreprise_id: number;
    assistante_id: number;
    feedback: string;
    next_step: string;
    besoin_client?: string;
    commentaire?: string;
    created_at?: string;
};

type Props = {
    rdvs: RDV[];
    actions: Action[];
    entreprise: Entreprise;
};

export default function Details({ rdvs = [], actions = [], entreprise }: Props) {
    const [activeTab, setActiveTab] = useState<'rdvs' | 'actions'>('rdvs');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Filter RDVs by date range
    const filteredRdvs = useMemo(() => {
        if (!dateFrom && !dateTo) return rdvs;
        
        return rdvs.filter(rdv => {
            if (!rdv.date_rdv) return false;
            
            const rdvDate = new Date(rdv.date_rdv);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;
            
            if (fromDate && rdvDate < fromDate) return false;
            if (toDate && rdvDate > toDate) return false;
            
            return true;
        });
    }, [rdvs, dateFrom, dateTo]);

    // Filter Actions by date range
    const filteredActions = useMemo(() => {
        if (!dateFrom && !dateTo) return actions;
        
        return actions.filter(action => {
            if (!action.created_at) return false;
            
            const actionDate = new Date(action.created_at);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;
            
            if (fromDate && actionDate < fromDate) return false;
            if (toDate && actionDate > toDate) return false;
            
            return true;
        });
    }, [actions, dateFrom, dateTo]);

    // Clear filters
    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
    };

    // Check if filters are active
    const hasActiveFilters = dateFrom || dateTo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 py-8">
                {/* Enhanced Header Section */}
                <div className="border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/80 dark:text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent dark:text-white">
                                        RDVs & Actions
                                    </h1>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Gérez vos rendez-vous et suivez vos actions pour{' '}
                                        <span className="font-medium text-blue-600">{entreprise?.denomination || 'votre entreprise'}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className={`transition-all duration-200 ${
                                            showFilters 
                                                ? 'border-orange-600 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50' 
                                                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800/50 dark:hover:border-neutral-600'
                                        }`}
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filtres
                                        {hasActiveFilters && (
                                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                                                !
                                            </span>
                                        )}
                                    </Button>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="border-blue-600 text-blue-600 transition-all duration-200 hover:border-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-300"
                                            onClick={() => document.getElementById('export-menu')?.classList.toggle('hidden')}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Exporter
                                        </Button>
                                        <div
                                            id="export-menu"
                                            className="ring-opacity-5 absolute right-0 z-50 mt-2 hidden w-48 rounded-lg border bg-white shadow-lg ring-1 ring-black dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-white"
                                        >
                                            <div className="py-1">
                                                <a
                                                    href={`/export/entreprise/${entreprise.id}/${activeTab}`}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50 dark:text-white dark:hover:bg-neutral-800/70"
                                                >
                                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                    Exporter {activeTab === 'rdvs' ? 'les RDVs' : 'les Actions'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date Filter Section */}
                            {showFilters && (
                                <div className="mt-6 rounded-lg border border-gray-200 bg-white/60 p-4 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/50">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <label className="text-sm font-medium text-gray-700">Du :</label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <label className="text-sm font-medium text-gray-700">Au :</label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="text-gray-600 hover:bg-gray-50"
                                            >
                                                <X className="mr-1 h-3 w-3" />
                                                Effacer
                                            </Button>
                                        )}
                                    </div>
                                    {hasActiveFilters && (
                                        <div className="mt-3 flex items-center text-sm text-gray-600">
                                            <span>
                                                {activeTab === 'rdvs' 
                                                    ? `${filteredRdvs.length} RDV(s) trouvé(s)`
                                                    : `${filteredActions.length} action(s) trouvée(s)`
                                                } 
                                                {dateFrom && ` depuis le ${new Date(dateFrom).toLocaleDateString('fr-FR')}`}
                                                {dateTo && ` jusqu'au ${new Date(dateTo).toLocaleDateString('fr-FR')}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Enhanced Tab Navigation */}
                            <div className="mt-6 border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('rdvs')}
                                        className={`border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'rdvs'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        <Calendar className="mr-2 inline h-4 w-4" />
                                        RDVs ({hasActiveFilters ? filteredRdvs.length : rdvs?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('actions')}
                                        className={`border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'actions'
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        <ClipboardList className="mr-2 inline h-4 w-4" />
                                        Actions ({hasActiveFilters ? filteredActions.length : actions?.length || 0})
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Content Section */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {activeTab === 'rdvs' ? (
                        <div className="space-y-1">
                            {filteredRdvs && filteredRdvs.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border bg-white/90 shadow-sm backdrop-blur-sm dark:bg-neutral-900/70 ">
                                    {filteredRdvs.map((rdv, index) => (
                                        <div
                                            key={rdv.id}
                                            className={`group border-l-4 border-l-blue-500 transition-all duration-300 hover:bg-blue-50/50 ${
                                                index !== filteredRdvs.length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-1 items-center space-x-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md">
                                                            {rdv.representant.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 flex items-center justify-between">
                                                                <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors dark:text-white">
                                                                    {rdv.representant}
                                                                </h3>
                                                                {rdv.status && (
                                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                                        {rdv.status}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-white">
                                                                <div className="flex min-w-0 items-center">
                                                                    <Mail className="mr-1 h-3 w-3 flex-shrink-0 text-gray-400" />
                                                                    <span className="truncate">{rdv.email}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Briefcase className="mr-1 h-3 w-3 text-gray-400" />
                                                                    <span className="truncate">{rdv.fonction}</span>
                                                                </div>
                                                                {rdv.telephone && (
                                                                    <div className="flex items-center">
                                                                        <Phone className="mr-1 h-3 w-3" />
                                                                        <span>{rdv.telephone}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                                                {rdv.date_rdv && (
                                                                    <div className="flex items-center font-medium text-black dark:text-white">
                                                                        <Calendar className="mr-1 h-3 w-3" />
                                                                        <span>{formatDate(rdv.date_rdv)}</span>
                                                                    </div>
                                                                )}
                                                                {rdv.localisation && (
                                                                    <div className="flex items-center text-gray-600 dark:text-white">
                                                                        <MapPin className="mr-1 h-3 w-3" />
                                                                        <span className="truncate">{rdv.localisation}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {rdv.details && (
                                                                <div className="mt-2">
                                                                    <p className="line-clamp-2 text-sm text-gray-700 dark:text-white italic">{rdv.details}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-2 border-dashed border-gray-200 bg-white/50 py-16 text-center backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-white">
                                    <CardContent>
                                        <Calendar className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                                        <h3 className="mb-2 text-xl font-medium text-gray-900">
                                            {hasActiveFilters ? 'Aucun RDV trouvé pour cette période' : 'Aucun RDV disponible'}
                                        </h3>
                                        <p className="mx-auto mb-4 max-w-md text-gray-600">
                                            {hasActiveFilters 
                                                ? 'Essayez d\'ajuster vos filtres de date' 
                                                : 'Commencez par créer votre premier rendez-vous'
                                            }
                                        </p>
                                        {hasActiveFilters && (
                                            <Button variant="outline" onClick={clearFilters} className="mt-2">
                                                Effacer les filtres
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredActions && filteredActions.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border bg-white/90 shadow-sm backdrop-blur-sm dark:bg-neutral-900/70 ">
                                    {filteredActions.map((action, index) => (
                                        <div
                                            key={action.id}
                                            className={`group border-l-4 border-l-green-500 transition-all duration-300 ${
                                                index !== filteredActions.length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-1 items-center space-x-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md dark:text-white">
                                                            <ClipboardList className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 flex items-center justify-between">
                                                                <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors dark:text-white">
                                                                    {action.feedback}
                                                                </h3>

                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-2 border-green-200 bg-green-50 text-xs text-green-700 dark:text-white dark:border-green-600 dark:bg-green-900/30"
                                                                >
                                                                    {action.next_step}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-1 text-sm text-gray-600 dark:text-white">
                                                                {action.created_at && (
                                                                    <div className="flex items-start">
                                                                        <span className="line-clamp-2 text-black dark:text-white">
                                                                            {formatDate(action.created_at)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {action.besoin_client && (
                                                                    <div className="flex items-center">
                                                                        <span className="truncate">Besoin: {action.besoin_client}</span>
                                                                    </div>
                                                                )}
                                                                {action.commentaire && (
                                                                    <div className="flex items-start">
                                                                        <span className="line-clamp-2">{action.commentaire}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-2 border-dashed border-gray-200 bg-white/50 py-16 text-center backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-white">
                                    <CardContent>
                                        <ClipboardList className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                                        <h3 className="mb-2 text-xl font-medium text-gray-900">
                                            {hasActiveFilters ? 'Aucune action trouvée pour cette période' : 'Aucune action disponible'}
                                        </h3>
                                        <p className="mx-auto mb-4 max-w-md text-gray-600">
                                            {hasActiveFilters 
                                                ? 'Essayez d\'ajuster vos filtres de date' 
                                                : 'Commencez par créer votre première action'
                                            }
                                        </p>
                                        {hasActiveFilters && (
                                            <Button variant="outline" onClick={clearFilters} className="mt-2">
                                                Effacer les filtres
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}