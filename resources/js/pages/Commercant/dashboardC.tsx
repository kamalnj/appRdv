import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CheckCircle, Mail, Navigation, Phone, Timer, User,Clock,Target,} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau du bord',
        href: '/dashboardC',
    },
];

interface CommercantStats {
    todayRdvs: number;
    rdvsThisWeek: number;
    completed: number;
    completionRate: number;
    totalQualified: number;
    totalrdvs:number;
}

interface RdvAppointment {
    id: number;
    entreprise: {
        denomination: string;
    };
    date_rdv: string;
    status: string;
    representer_par: string;
    email: string;
    telephone: string;
}

interface Props {
    CommercantStats: CommercantStats[];
    RdvAppointment: RdvAppointment[];
}



const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    color = 'orange',
}: {
    title: string;
    value: number | string;
    icon: any;
    subtitle: string;
    color?: string;

}) => {
    const colorClasses: Record<string, string> = {
        orange: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        amber: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        green: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        blue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        purple: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        red: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-700">
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100/50 to-transparent dark:from-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl border p-3 ${colorClasses[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

const AppointmentCard = ({ 
    appointment, 
    isToday = false,
}: { 
    appointment: RdvAppointment; 
    isToday?: boolean;
}) => {
    const enterpriseName = appointment.entreprise.denomination || 'Entreprise inconnue';
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'scheduled': return 'Planifié';
            case 'cancelled': return 'Annulé';
            default: return 'En attente';
        }
    };

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                isToday
                    ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:border-orange-800 dark:from-orange-950/20 dark:to-orange-900/10'
                    : 'border-gray-200/60 bg-white dark:border-gray-700 dark:bg-gray-900'
            }`}
        >
            {isToday && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-red-500" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 font-semibold text-white shadow-lg">
                            {enterpriseName.charAt(0).toUpperCase()}
                        </div>
                        {isToday && (
                            <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {enterpriseName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {appointment.representer_par || 'Représentant non spécifié'}
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{appointment.date_rdv || 'Date non spécifiée'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{appointment.email || 'Email non disponible'}</span>
                            </div>
                            {appointment.telephone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span>{appointment.telephone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function dashboardC({ CommercantStats, RdvAppointment }: Props) {
    const appointments = RdvAppointment || [];
    const stats = CommercantStats?.[0] || {
        todayRdvs: 0,
        rdvsThisWeek: 0,
        completed: 0,
        completionRate: 0,
    };
    
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = appointments.filter((apt) => {
        const dateOnly = apt?.date_rdv?.split(' ')[0];
        return dateOnly === today;
    });

    const upcomingAppointments = appointments.filter((apt) => apt?.status === 'scheduled');
    

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 17) return 'Bon après-midi';
        return 'Bonsoir';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="p-6 space-y-8">
                    {/* Enhanced Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
                        {/* Background decoration */}
                        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10" />
                        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5" />
                        
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">
                                        {getGreeting()}, Commerçant
                                    </h1>
                                    <p className="text-orange-100">
                                        Gérez vos rendez-vous et qualifiez les entreprises efficacement
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/calendrier"
                                    className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 font-medium transition-all hover:bg-white/30 hover:scale-105"
                                >
                                    <Calendar className="h-5 w-5" />
                                    Mon planning
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard 
                            title="Aujourd'hui" 
                            value={stats.todayRdvs} 
                            icon={Calendar} 
                            subtitle="Rendez-vous planifiés" 
                            color="orange"
                        />
                        <StatCard 
                            title="Cette semaine" 
                            value={stats.rdvsThisWeek} 
                            icon={Timer} 
                            subtitle="RDV à venir" 
                            color="blue"
                        />
                        <StatCard 
                            title="Complétés" 
                            value={stats.completed} 
                            icon={CheckCircle} 
                            subtitle="Ce mois-ci" 
                            color="green"
                        />
                        <StatCard 
                            title="Taux de complétion" 
                            value={`${stats.completionRate}%`} 
                            icon={Target} 
                            subtitle="Performance globale" 
                            color="purple"
                        />
                    </div>

                    <div className="rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900/80">
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-2">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Planning d'aujourd'hui
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {todayAppointments.length > 0
                                            ? `${todayAppointments.length} rendez-vous programmé${todayAppointments.length > 1 ? 's' : ''}`
                                            : "Aucun rendez-vous prévu"}
                                    </p>
                                </div>
                            </div>
                            
                        </div>

                        {todayAppointments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                {todayAppointments.map((appointment) => (
                                    <AppointmentCard 
                                        key={appointment.id} 
                                        appointment={appointment} 
                                        isToday={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                    <Calendar className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Journée libre
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Aucun rendez-vous prévu pour aujourd'hui
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div >
                        {/* Upcoming Appointments */}
                        <div className="lg:col-span-2">
                            <div className="rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900/80">
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-2">
                                            <Navigation className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                Prochains rendez-vous
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {upcomingAppointments.length} rendez-vous à venir
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {upcomingAppointments.slice(0, 4).map((appointment) => (
                                        <AppointmentCard 
                                            key={appointment.id} 
                                            appointment={appointment}
                                        />
                                    ))}
                                    
                                    {upcomingAppointments.length === 0 && (
                                        <div className="py-12 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                <Navigation className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Aucun rendez-vous à venir
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </AppLayout>
    );
}