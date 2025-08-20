import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Filter, PlusCircleIcon, Search, Settings, Shield, Trash2, User, UserCheck, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

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

interface Props {
    stats: AdminStats;
    users: User[];
}

type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';

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
    icon: React.ComponentType<{ className?: string }>;
    subtitle: string;
    color?: ColorType;
}) => {
    const colorClasses: Record<ColorType, string> = {
        blue: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30',
        green: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-800/30',
        yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/30',
        red: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-800/30',
        purple: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/30',
        indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30',
    };

    const iconColorClasses: Record<ColorType, string> = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25',
        green: 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25',
        yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/25',
        red: 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25',
        purple: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25',
        indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/25',
    };

    const hoverGradients: Record<ColorType, string> = {
        blue: 'from-blue-400/10 to-indigo-400/10',
        green: 'from-green-400/10 to-emerald-400/10',
        yellow: 'from-yellow-400/10 to-orange-400/10',
        red: 'from-red-400/10 to-pink-400/10',
        purple: 'from-purple-400/10 to-pink-400/10',
        indigo: 'from-indigo-400/10 to-purple-400/10',
    };

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorClasses[color]}`}
        >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradients[color]}`}></div>
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


const UserRow = ({ user, onDelete }: { user: User; onDelete: (id: number) => void }) => {
    const [confirming, setConfirming] = useState(false);

    const handleDeleteClick = () => {
        setConfirming(true);
    };

    const handleConfirm = () => {
        onDelete(user.id);
        setConfirming(false); 
    };

    const handleCancel = () => {
        setConfirming(false);
    };

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
                        <div className="truncate text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
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
                <div className="space-y-1">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.lastActive?.lastSeen || 'Aucune donnée'}</div>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                    {!confirming ? (
                        <button
                            onClick={handleDeleteClick}
                            className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-pink-700 hover:shadow-lg"
                        >
                            <Trash2 size={16} />
                            <span className="text-sm">Supprimer</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleConfirm}
                                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-lg"
                            >
                                Confirmer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-gray-500 hover:to-gray-600 hover:shadow-lg"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};


const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 17) return 'Bon après-midi';
    return 'Bonsoir';
};

export default function AdminDashboard({ stats, users }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'assistant' | 'commerçant'>('all');

    // Filter users based on search term and role
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const handleDeleteUser = (userId: number) => {
        router.delete(route('user.destroy', userId), {
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 p-8 text-white shadow-2xl">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="mb-1 text-3xl font-bold">{getGreeting()}, Admin</h1>
                            <p className="text-blue-100">Gérez les utilisateurs et surveillez les performances du système</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/register"
                            className="flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            Nouvel utilisateur
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-5 my-5 space-y-8">
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

                {/* User Management Table */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="lg:col-span-4">
                        <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/70 shadow-xl backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="border-b border-neutral-200/60 bg-gradient-to-r from-neutral-50/80 to-transparent p-8 dark:border-neutral-700/60 dark:from-neutral-800/50">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Gestion des utilisateurs</h2>
                                        </div>
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {filteredUsers.length} / {users.length} utilisateur{users.length > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    {/* Filter Controls */}
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Search Input */}
                                        <div className="relative max-w-md flex-1">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                            <input
                                                type="text"
                                                placeholder="Rechercher par nom ou email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-blue-400"
                                            />
                                        </div>

                                        {/* Role Filter */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                <Filter className="h-4 w-4" />
                                                Filtrer par rôle:
                                            </div>
                                            <select
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'assistant' | 'commerçant')}
                                                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-blue-400"
                                            >
                                                <option value="all">Tous les rôles</option>
                                                <option value="assistant">Assistant</option>
                                                <option value="commerçant">Commerçant</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(searchTerm || roleFilter !== 'all') && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Filtres actifs:</span>
                                            {searchTerm && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    Recherche: "{searchTerm}"
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            {roleFilter !== 'all' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                    Rôle: {roleFilter}
                                                    <button
                                                        onClick={() => setRoleFilter('all')}
                                                        className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setRoleFilter('all');
                                                }}
                                                className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                                            >
                                                Effacer tous les filtres
                                            </button>
                                        </div>
                                    )}
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
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />)
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Users className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                                                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                                            Aucun utilisateur trouvé
                                                        </div>
                                                        <div className="text-xs text-neutral-400 dark:text-neutral-500">
                                                            Essayez de modifier vos critères de recherche
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
