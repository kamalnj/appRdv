import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Rdv {
  id: number;
  date_rdv: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  entreprise: {
    id: number;
    denomination: string;
  };
  commercant: {
    name: string;
  };
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface RdvData {
  data: Rdv[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links?: PaginationLink[];
}

interface Props {
  rdvs?: RdvData; 
}

export default function Rdvs({ rdvs }: Props) {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusConfig = (status: Rdv['status']) => {
    const configs = {
      scheduled: {
        label: 'Planifié',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        dot: 'bg-blue-500'
      },
      completed: {
        label: 'Terminé',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        dot: 'bg-green-500'
      },
      cancelled: {
        label: 'Annulé',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        dot: 'bg-red-500'
      }
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const getStats = () => {
    if (!rdvs?.data) return { scheduled: 0, completed: 0, cancelled: 0 };
    return rdvs.data.reduce((acc, rdv) => {
      acc[rdv.status]++;
      return acc;
    }, { scheduled: 0, completed: 0, cancelled: 0 });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Liste Rdvs', href: '/rdvs' }
  ];

  const stats = getStats();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Rdvs" />
      
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rendez-vous de cette semaine
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gérez vos rendez-vous 
            </p>
          </div>
          

        </div>

        {/* Main Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
          {rdvs?.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Entreprise
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Date & Heure
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Commercial
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Statut
                    </th>
                
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {rdvs.data.map((rdv) => {
                    const statusConfig = getStatusConfig(rdv.status);
                    return (
                      <tr key={rdv.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {rdv.entreprise.denomination}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(rdv.date_rdv)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {rdv.commercant.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/entreprises/${rdv.entreprise.id}/liste-actions`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Consulter
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun rendez-vous cette semaine
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Vos rendez-vous apparaîtront ici une fois programmés.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {rdvs?.links?.length ? (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de <span className="font-medium">{rdvs.from || 0}</span> à{' '}
                <span className="font-medium">{rdvs.to || 0}</span> sur{' '}
                <span className="font-medium">{rdvs.total}</span> résultats
              </div>
              <div className="flex space-x-2">
                {rdvs.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-300 dark:border-gray-600'
                        : 'text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}