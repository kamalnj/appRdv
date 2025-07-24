import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {Building2,Calendar,Activity,Users,Target,TrendingUp,Plus,Search,Filter,Eye,Edit,UserCheck,MessageCircle,Star,
} from 'lucide-react';

export default function AssistantDashboardStatic() {
  const mockStats = [
    {
      title: 'Total Entreprises',
      value: 35,
      icon: Building2,
      subtitle: 'Entreprises gérées',
      color: 'teal',
    },
    {
      title: 'Actions Actives',
      value: 12,
      icon: Activity,
      subtitle: 'En cours',
      color: 'blue',
    },
    {
      title: 'RDV Planifiés',
      value: 8,
      icon: Calendar,
      subtitle: 'Cette semaine',
      color: 'purple',
    },
    {
      title: 'Commerçants',
      value: 4,
      icon: Users,
      subtitle: 'Disponibles',
      color: 'green',
    },
    {
      title: 'Objectif mensuel',
      value: '14/20',
      icon: Target,
      subtitle: 'Progression',
      color: 'orange',
    },
    {
      title: 'Taux de conversion',
      value: '73%',
      icon: TrendingUp,
      subtitle: 'Ce mois',
      color: 'indigo',
    },
  ];

  const mockEnterprises = [
    {
      id: 1,
      name: 'Alpha Corp',
      contact: 'M. Karim',
      lastContact: 'Il y a 2 jours',
      priority: 'high',
      status: 'new',
    },
    {
      id: 2,
      name: 'Beta Solutions',
      contact: 'Mme Nadia',
      lastContact: 'Hier',
      priority: 'medium',
      status: 'rdv_scheduled',
      assignedCommercant: 'Yassine',
    },
    {
      id: 3,
      name: 'Gamma Tech',
      contact: 'M. Amine',
      lastContact: 'Il y a 1 semaine',
      priority: 'low',
      status: 'completed',
    },
  ];

  const mockCommercants = [
    {
      id: 1,
      name: 'Yassine',
      location: 'Casablanca',
      availability: 'available',
      rating: 4.5,
      completedRdvs: 15,
    },
    {
      id: 2,
      name: 'Salma',
      location: 'Rabat',
      availability: 'busy',
      rating: 4.7,
      completedRdvs: 10,
    },
  ];

  const mockActions = [
    {
      id: 1,
      enterprise: 'Alpha Corp',
      description: 'Appel effectué avec le client',
      timestamp: 'Aujourd’hui à 09:30',
      status: 'completed',
    },
    {
      id: 2,
      enterprise: 'Beta Solutions',
      description: 'RDV confirmé avec Mme Nadia',
      timestamp: 'Hier à 15:00',
      status: 'pending',
    },
  ];

  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 p-8 space-y-8">
      <Head title="Dashboard Statique" />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Assistant Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">Interface statique pour révision</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm">
            <Plus className="w-4 h-4" />
            Nouvelle entreprise
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
            <Calendar className="w-4 h-4" />
            Planifier RDV
          </button>
        </div>
      </header>

      {/* Statistiques */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockStats.map((stat, i) => (
          <div key={i} className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border dark:border-neutral-700">
            <div className={`p-2 w-fit rounded-lg ${colorClasses[stat.color]}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-neutral-800 dark:text-white">{stat.value}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.title}</p>
            <p className="text-xs text-neutral-400 mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </section>

      {/* Pipeline */}
      <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl border dark:border-neutral-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Pipeline</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800"
            />
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {['new', 'rdv_scheduled', 'completed'].map((status) => {
            const data = mockEnterprises.filter((e) => e.status === status);
            const title =
              status === 'new'
                ? 'Nouveaux'
                : status === 'rdv_scheduled'
                ? 'RDV planifiés'
                : 'Terminés';
            return (
              <div key={status} className="min-w-[250px] flex-1">
                <h3 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">{title}</h3>
                <div className="space-y-3">
                  {data.map((e) => (
                    <div key={e.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border dark:border-neutral-700">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-neutral-800 dark:text-white">{e.name}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            e.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : e.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {e.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.contact}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Voir
                        </button>
                        <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                          <Edit className="w-3 h-3" /> Modifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Commerçants & Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commerçants */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Commerçants disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCommercants.map((c) => (
              <div key={c.id} className="p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium text-neutral-800 dark:text-white">{c.name}</h4>
                    <p className="text-xs text-neutral-500">{c.location}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.availability === 'available'
                        ? 'bg-green-100 text-green-700'
                        : c.availability === 'busy'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {c.availability}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" /> {c.rating}
                  </span>
                  <span>{c.completedRdvs} RDVs</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-teal-100 text-teal-700 rounded px-3 py-2 text-sm font-medium hover:bg-teal-200">
                    Assigner
                  </button>
                  <button className="p-2 border rounded-lg">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions récentes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Actions récentes</h3>
            <div className="space-y-3">
              {mockActions.map((a) => (
                <div key={a.id} className="flex gap-2 items-start p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      a.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-neutral-900 dark:text-white font-medium">{a.description}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{a.enterprise} • {a.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
    </AppLayout>
  );
}
