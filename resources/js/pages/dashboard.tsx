import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { get } from 'http';
import { BarChart3, Mail, Plus, Settings, Shield, Trash2, UserCheck, Users, Eye, Edit3, Calendar, Activity } from 'lucide-react';

interface AdminStats {
    activeAssistants: number;
    activeCommercants: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'assistant' | 'commercant';
    lastActive: {
        lastSeen: string;
        lastActivity: string;
    };
}

interface usersWithLastActivity {
    lastSeen: string;
    lastActivity: string;
}

interface Props {
    stats: AdminStats;
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin/dashboard',
    },
];

const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    color = 'blue',
}: {
    title: string;
    value: number | string;
    icon: any;
    subtitle: string;
    color?: string;
}) => {
    const colorClasses: any = {
        blue: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30',
        green: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-800/30',
        yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/30',
        red: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-800/30',
        purple: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/30',
        indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30',
    };

    const iconColorClasses: any = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25',
        green: 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25',
        yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/25',
        red: 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25',
        purple: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25',
        indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/25',
    };

    return (
        <div className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorClasses[color]}`}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-r ${color === 'blue' ? 'from-blue-400/10 to-indigo-400/10' : color === 'green' ? 'from-green-400/10 to-emerald-400/10' : 'from-purple-400/10 to-pink-400/10'}`}></div>
            </div>
            
            <div className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`rounded-xl p-3 shadow-lg ${iconColorClasses[color]}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{title}</h3>
                  
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

const UserRow = ({
    user,
    usersWithLastActivity,
    onDelete,
}: {
    user: User;
    usersWithLastActivity: usersWithLastActivity;
    onDelete: (id: number) => void;
}) => {





    return (
        <tr className="group border-b border-neutral-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-neutral-50/50 hover:to-transparent dark:border-neutral-800 dark:hover:from-neutral-800/30">
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-lg font-bold text-white shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        user.role === 'assistant'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    }`}
                >
                    {user.role === 'assistant' ? <UserCheck className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                        <p className="text-xs ml-6 font-bold text-black dark:text-neutral-400 mt-1">
                            {user.lastActive?.lastSeen || 'Aucune Donnée'}
                        </p>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <button 
                        onClick={() => onDelete(user.id)} 
                        className="flex text-xs font-bold items-center justify-center rounded-lg p-2 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30 group"
                    >
                        <Trash2 className="h-4 mx-2 w-4 text-red-500" />
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default function AdminDashboard({ stats, users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />

            {/* Enhanced Header */}
            <div className="mt-6 mb-10 mx-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-3 shadow-xl shadow-blue-500/25">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-300">
                                Administration
                            </h1>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400">
                                Gérez les utilisateurs et surveillez les performances du système
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            href='/register' 
                            className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <Plus className="relative h-5 w-5" />
                            <span className="relative">Nouvel utilisateur</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-8 mx-5 my-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    <StatCard 
                        title="Assistants Actifs" 
                        value={stats.activeAssistants} 
                        icon={UserCheck} 
                        subtitle="Utilisateurs assistant connectés" 
                        color="green" 
                    />
                    <StatCard 
                        title="Commerçants Actifs" 
                        value={stats.activeCommercants} 
                        icon={Users} 
                        subtitle="Comptes commerçant enregistrés" 
                        color="purple" 
                    />
                </div>

                {/* Enhanced Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Enhanced User Management */}
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/70 backdrop-blur-sm shadow-xl dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="border-b border-neutral-200/60 bg-gradient-to-r from-neutral-50/80 to-transparent p-8 dark:border-neutral-700/60 dark:from-neutral-800/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                            Gestion des utilisateurs
                                        </h2>
                                    </div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {users.length} utilisateur{users.length > 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-800 dark:to-neutral-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Utilisateur
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4" />
                                                    Rôle
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Statut & Activité
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-300">
                                                <div className="flex items-center gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    Actions
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                        {users.map((user) => (
                                            <UserRow
                                                usersWithLastActivity={user.lastActive}
                                                key={user.id}
                                                user={user}
                                                onDelete={(id) => console.log('Delete user', id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                    

                            {/* Quick Actions */}
                            <div className="rounded-2xl border border-neutral-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-xl dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                    Actions Rapides
                                </h3>
                                <div className="space-y-3">
                                    <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                        <BarChart3 className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium">Voir les analyses</span>
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                        <Mail className="h-4 w-4 text-green-500" />
                                        <span className="text-sm font-medium">Envoyer message</span>
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                        <Settings className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-medium">Paramètres système</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}