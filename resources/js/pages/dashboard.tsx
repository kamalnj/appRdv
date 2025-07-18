import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    UserCheck, 
    UserX, 
    Settings, 
    TrendingUp, 
    Bell,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Mail,
    Shield,
    Activity,
    BarChart3,
    Calendar,
    Clock
} from 'lucide-react';

interface AdminStats {
    totalUsers: number;
    activeAssistants: number;
    activeCommercants: number;
    pendingApprovals: number;
    systemHealth: number;
    monthlyConversions: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'assistant' | 'commercant';
    status: 'active' | 'inactive' | 'pending';
    lastActive: string;
    performance: number;
}

interface Props {
    stats: AdminStats;
    users: User[];
    recentActivity: Array<{
        id: number;
        type: string;
        message: string;
        timestamp: string;
        user: string;
    }>;
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
    trend, 
    subtitle,
    color = 'blue'
}: { 
    title: string; 
    value: number | string; 
    icon: any; 
    trend?: { isPositive: boolean; percentage: number };
    subtitle: string;
    color?: string;
}) => {
    const colorClasses:any = {
        blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
        green: 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400',
        yellow: 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400',
        red: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400',
        purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
        indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 p-6 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {title}
                    </h3>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        trend.isPositive 
                            ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400' 
                            : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                    }`}>
                        <TrendingUp className={`h-3 w-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
                        {trend.percentage}%
                    </div>
                )}
            </div>
            
            <div className="space-y-2">
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

const UserRow = ({ user, onEdit, onDelete, onView }: { 
    user: User; 
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onView: (id: number) => void;
}) => (
    <tr className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{user.name}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                user.role === 'assistant' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
            }`}>
                {user.role}
            </span>
        </td>
        <td className="px-6 py-4">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                user.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    : user.status === 'inactive'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
            }`}>
                {user.status}
            </span>
        </td>
        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
            {user.lastActive}
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <div className="w-12 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${user.performance}%` }}
                    />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {user.performance}%
                </span>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onView(user.id)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                    <Eye className="h-4 w-4 text-neutral-500" />
                </button>
                <button 
                    onClick={() => onEdit(user.id)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                    <Edit className="h-4 w-4 text-blue-500" />
                </button>
                <button 
                    onClick={() => onDelete(user.id)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </td>
    </tr>
);

export default function AdminDashboard({ stats, users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />
            
            {/* Header */}
            <div className="mb-8 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 ml-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                Administration
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Gérez les utilisateurs et surveillez les performances du système
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="h-4 w-4" />
                            Nouvel utilisateur
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="flex justify-center gap-4">
                    <StatCard
                        title="Total Utilisateurs"
                        value={stats.totalUsers}
                        icon={Users}
                        trend={{ isPositive: true, percentage: 12 }}
                        subtitle="Utilisateurs actifs"
                        color="blue"
                    />
                    <StatCard
                        title="Assistants"
                        value={stats.activeAssistants}
                        icon={UserCheck}
                        trend={{ isPositive: true, percentage: 8 }}
                        subtitle="Assistants actifs"
                        color="green"
                    />
                    <StatCard
                        title="Commerçants"
                        value={stats.activeCommercants}
                        icon={Users}
                        trend={{ isPositive: false, percentage: 3 }}
                        subtitle="Commerçants actifs"
                        color="purple"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Management */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900">
                            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                        Gestion des utilisateurs
                                    </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Utilisateur
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Rôle
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Dernière activité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Performance
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-900">
                                        {users.map((user) => (
                                            <UserRow 
                                                key={user.id} 
                                                user={user}
                                                onEdit={(id) => console.log('Edit user', id)}
                                                onDelete={(id) => console.log('Delete user', id)}
                                                onView={(id) => console.log('View user', id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                                Actions rapides
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full p-3 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Plus className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">Ajouter un utilisateur</span>
                                    </div>
                                </button>
                                <button className="w-full p-3 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Envoyer une annonce</span>
                                    </div>
                                </button>
                                <button className="w-full p-3 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm font-medium">Générer un rapport</span>
                                    </div>
                                </button>
                                <button className="w-full p-3 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Settings className="h-4 w-4 text-indigo-600" />
                                        <span className="text-sm font-medium">Paramètres système</span>
                                    </div>
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </AppLayout>
    );
}