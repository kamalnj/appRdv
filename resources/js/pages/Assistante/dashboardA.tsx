import ChartDashAssis from '@/components/ChartDashAssis';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bell, Building2, Calendar, CheckCircle2, Clock, TrendingUp, User, Users } from 'lucide-react';

interface Stats {
    totalEnterprises: number;
    rdvsThisWeek: number;
    totalCommercants: number;
}
interface ChartData {
    totalCompletedRdvs : number;
    totalScheduledRdvs : number;
    totalanceledRdvs : number;
    performanceData:{
        growthPercentage:number;
        successRate:number;
    }
    historicalData?:HistoricalPointsData[];

}

interface HistoricalPointsData{
    date:string;
        completed: number;
    scheduled: number;
    cancelled: number;
}

interface Commercant {
    id: number;
    name: string;
    email: string;
    completedRdvs: number;
}

interface LeastUpcomingRdvs {
    id: number;
    name: string;
    email: string;
    upcomingRdvs: number;
}

interface LatestNotif {
    description: string;
}

interface Props {
    stats: Stats[];
    commercants: Commercant[];
    latestNotif: LatestNotif[];
    leastUpcomingRdvs: LeastUpcomingRdvs[];
   chartData: ChartData;
}

export default function DashboardA({ stats, commercants, latestNotif, leastUpcomingRdvs,chartData }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tableau de bord', href: '/' }];


    const statCards = [
        {
            title: 'Entreprises',
            value: stats[0]?.totalEnterprises || 0,
            icon: Building2,
            subtitle: 'Total enregistrées',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'RDVs cette semaine',
            value: stats[0]?.rdvsThisWeek || 0,
            icon: Calendar,
            subtitle: 'Activité hebdomadaire',
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Commerçants',
            value: stats[0]?.totalCommercants || 0,
            icon: Users,
            subtitle: 'Total actifs',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ];
        const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 17) return 'Bon après-midi';
        return 'Bonsoir';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
                <Head title="Dashboard" />

                    <div className=" ml-2.5 relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-green-500 to-green-500 p-8 text-white shadow-2xl">
                        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10" />
                        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5" />
                        
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">
                                        {getGreeting()}, Assistant
                                    </h1>
                                    <p className="text-orange-100">
                                        Gérez vos rendez-vous et qualifiez les entreprises efficacement
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/entreprises"
                                    className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 font-medium transition-all hover:bg-white/30 hover:scale-105"
                                >
                                    <Calendar className="h-5 w-5" />
                                    Créer un RDV
                                </Link>
                            </div>
                        </div>
                    </div>

                <div className="space-y-8 p-6">
                    {/* Statistics Cards */}
                    <section>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {statCards.map((stat, i) => (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} mb-4`}>
                                                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                            </div>
                                            <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</h3>
                                            <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} opacity-60`}></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Latest News */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                                            <TrendingUp className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analyse des RDVs</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Évolution sur 30 jours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Complétés</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Programmés</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Annulés</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Container */}
                                <ChartDashAssis chartData={chartData} />

                                {/* Chart Summary */}
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{chartData.totalCompletedRdvs}</div>
                                        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Complétés</div>
                                    </div>
                                    <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{chartData.totalScheduledRdvs}</div>
                                        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Programmés</div>
                                    </div>
                                    <div className="rounded-lg bg-orange-50 p-3 text-center dark:bg-orange-900/20">
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{chartData.totalanceledRdvs}</div>
                                        <div className="text-xs text-orange-600/70 dark:text-orange-400/70">Annulés</div>
                                    </div>
                                </div>
                            </div>
                            {/* Performance Indicators */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 p-2">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{chartData.performanceData.growthPercentage > 0 ? '+' : ''}{chartData.performanceData.growthPercentage}%</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">vs mois dernier</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-2">
                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{chartData.performanceData.successRate}%</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Taux de succès</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RDV Analytics Chart */}
                        <div className="space-y-6">
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                                    <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dernières actualités</h2>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mises à jour récentes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {latestNotif.length > 0 ? (
                                            <div className="space-y-4">
                                                {latestNotif.map((notif, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                                    >
                                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                                            {notif.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
                                                <p className="text-gray-500 dark:text-gray-400">Aucune actualité récente</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Merchants Sections */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
                                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Commerçants à contacter</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Moins de RDVs programmés</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {leastUpcomingRdvs.length > 0 ? (
                                    <div className="space-y-4">
                                        {leastUpcomingRdvs.map((merchant) => (
                                            <div
                                                key={merchant.id}
                                                className="flex items-center justify-between rounded-xl bg-orange-50 p-4 transition-colors hover:bg-orange-100 dark:bg-orange-900/10 dark:hover:bg-orange-900/20"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-medium text-white">
                                                        {merchant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{merchant.name}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{merchant.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                        <span className="text-xs font-medium">{merchant.upcomingRdvs} RDVs</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
                                        <p className="text-gray-500 dark:text-gray-400">Tous les commerçants ont des RDVs programmés</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Merchants with Completed RDVs */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Commerçants actifs</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">RDVs récemment complétés</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {commercants.length > 0 ? (
                                    <div className="space-y-4">
                                        {commercants.map((merchant) => (
                                            <div
                                                key={merchant.id}
                                                className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-medium text-white">
                                                        {merchant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{merchant.name}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{merchant.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        <span className="text-xs font-medium">{merchant.completedRdvs} complétés</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
                                        <p className="text-gray-500 dark:text-gray-400">Aucun RDV complété récemment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
