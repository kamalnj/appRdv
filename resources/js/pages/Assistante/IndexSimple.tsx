import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin, Mail, Phone, CirclePlus, X, Edit, Share2, Star, Calendar, Users, TrendingUp, ArrowLeft } from 'lucide-react';

interface Entreprise {
    id: number;
    nom: string;
    secteur: string;
    localisation: string;
    email: string;
    telephone: string;
    active: boolean;
    dateCreation?: string;
    employees?: number;
    revenue?: string;
    created_at?: string;
    updated_at?: string;
    hasRdv?: boolean;
    hasAction?: boolean;

}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprise: Entreprise;
}

export default function IndexSimple({ auth, entreprise }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Entreprises',
            href: '/entreprises',
        },
        {
            title: entreprise.nom,
            href: `/entreprises/${entreprise.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={entreprise.nom} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/entreprises"
                                    className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors group"
                                >
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-sm font-medium">Retour aux entreprises</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header de l'entreprise */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Building2 className="text-white" size={32} />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{entreprise.nom}</h1>
                                            <div className="flex items-center space-x-2">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                                <h2 className="text-xl font-semibold text-slate-800 mb-6">Informations détaillées</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <Briefcase className="text-indigo-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Secteur d'activité</p>
                                                <p className="text-lg text-slate-800">{entreprise.secteur}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="text-emerald-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Localisation</p>
                                                <p className="text-lg text-slate-800">{entreprise.localisation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Mail className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Email</p>
                                                <p className="text-lg text-slate-800">
                                                    <a 
                                                        href={`mailto:${entreprise.email}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {entreprise.email}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Phone className="text-purple-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Téléphone</p>
                                                <p className="text-lg text-slate-800">
                                                    <a 
                                                        href={`tel:${entreprise.telephone}`}
                                                        className="hover:text-purple-600 transition-colors"
                                                    >
                                                        {entreprise.telephone}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions rapides */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions rapides</h3>
                                <div className="space-y-3">
                                             <a 
                                        href={`/entreprises/${entreprise.id}/action`}
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <CirclePlus size={16} />
                                        <span>Action</span>
                                    </a>
                                    <a 
                                        href={`mailto:${entreprise.email}`}
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Mail size={16} />
                                        <span>Contacter</span>
                                    </a>
                                    <a 
                                        href={`https://www.google.com/maps/search/${encodeURIComponent(entreprise.localisation)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <MapPin size={16} />
                                        <span>Localiser</span>
                                    </a>
                                    {entreprise.hasRdv && entreprise.hasAction && (
                                        <a
                                            href={`/entreprises/${entreprise.id}/liste-actions`}
                                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <Calendar size={16} />
                                            <span>Liste des Actions</span>
                                        </a>
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