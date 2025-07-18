import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin, Mail, Phone, CirclePlus, Calendar,TrendingUp, ArrowLeft, DollarSign, FileText,User, Hash, ExternalLink,Copy, CheckCircle,Shield} from 'lucide-react';
import { useState } from 'react';

interface Entreprise {
    id: number;
    denomination: string;
    rc: string;
    tribunal: string;
    capital_social: string;
    adresse: string;
    object_social: string;
    ice: string;
    bilan_date: string;
    chiffre_affaire: string;
    tel: string;
    diregeants: string;
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
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Entreprises',
            href: '/entreprises',
        },
        {
            title: entreprise.denomination,
            href: `/entreprises/${entreprise.id}`,
        },
    ];

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={entreprise.denomination} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/entreprises"
                                    className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-all duration-200 group bg-white/60 px-3 py-2 rounded-lg hover:bg-white/80 hover:shadow-sm"
                                >
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-sm font-medium">Retour aux entreprises</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
                                <div className="relative">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start space-x-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white/20">
                                                <Building2 className="text-white" size={36} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <h1 className="text-3xl font-bold text-slate-800">{entreprise.denomination}</h1>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Shield size={16} className="text-slate-400" />
                                                        <span>RC: {entreprise.rc}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(entreprise.rc, 'rc')}
                                                            className="text-slate-400 hover:text-slate-600 transition-colors">
                                                            {copiedField === 'rc' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Hash size={16} className="text-slate-400" />
                                                        <span>ICE: {entreprise.ice}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(entreprise.ice, 'ice')}
                                                            className="text-slate-400 hover:text-slate-600 transition-colors">
                                                            {copiedField === 'ice' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="text-green-600" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Chiffre d'Affaires</p>
                                        <p className="text-2xl font-bold text-slate-800">{(entreprise.chiffre_affaire)}</p>
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="text-blue-600" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Capital Social</p>
                                        <p className="text-2xl font-bold text-slate-800">{(entreprise.capital_social)}</p>
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="text-purple-600" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Tribunal</p>
                                        <p className="text-lg font-semibold text-slate-800">{entreprise.tribunal}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-slate-200">
                                    <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                                        <FileText size={20} className="text-indigo-600" />
                                        <span>Informations détaillées</span>
                                    </h2>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="group">
                                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <Briefcase className="text-indigo-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-1">Registre du Commerce</p>
                                                        <p className="text-lg font-semibold text-slate-800">{entreprise.rc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(entreprise.rc, 'rc-detail')}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                                                    >
                                                        {copiedField === 'rc-detail' ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Phone className="text-orange-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-1">Téléphone</p>
                                                        <p className="text-lg font-semibold text-slate-800">
                                                            <p className="hover:text-orange-600 transition-colors">
                                                                {entreprise.tel}
                                                            </p>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <User className="text-red-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-1">Dirigeants</p>
                                                        <p className="text-lg font-semibold text-slate-800">{entreprise.diregeants}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Calendar className="text-purple-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-1">Date du Bilan</p>
                                                        <p className="text-lg font-semibold text-slate-800">{(entreprise.bilan_date)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="group">
                                                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FileText className="text-indigo-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-2">Objet Social</p>
                                                        <p className="text-sm text-slate-800 leading-relaxed">{entreprise.object_social}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <MapPin className="text-green-600" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-600 mb-2">Adresse</p>
                                                        <p className="text-sm text-slate-800 leading-relaxed">{entreprise.adresse}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                        <CirclePlus size={18} className="text-indigo-600" />
                                        <span>Actions rapides</span>
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <a 
                                        href={`/entreprises/${entreprise.id}/action`}
                                        className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <CirclePlus size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Nouvelle Action</span>
                                    </a>         
                                    <a 
                                        href={`https://www.google.com/maps/search/${encodeURIComponent(entreprise.adresse)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <MapPin size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Localiser</span>
                                        <ExternalLink size={14} />
                                    </a>
                                    
                                    {entreprise.hasRdv && entreprise.hasAction && (
                                        <a
                                            href={`/entreprises/${entreprise.id}/liste-actions`}
                                            className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Liste des Actions</span>
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