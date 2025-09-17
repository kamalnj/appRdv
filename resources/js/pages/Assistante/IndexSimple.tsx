import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle,
    CirclePlus,
    Copy,
    DollarSign,
    ExternalLink,
    FileText,
    Hash,
    MapPin,
    Phone,
    Shield,
    TrendingUp,
    User,
} from 'lucide-react';
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
    tel?: string[];
    diregeants?: Array<{
        nom: string;
        prenom: string;
        fonction: string;
    }>;
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

export default function IndexSimple({ entreprise }: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    
    interface ExpandableTextProps {
        text: string;
        maxLength?: number;
        className?: string;
    }

    const ExpandableText = ({ text, maxLength = 150, className = "" }: ExpandableTextProps) => {
        const [isExpanded, setIsExpanded] = useState(false);
        
        if (!text) return null;
        
        const shouldTruncate = text.length > maxLength;
        const displayText = isExpanded ? text : text.slice(0, maxLength);
        
        return (
            <div className={className}>
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {displayText}
                    {!isExpanded && shouldTruncate && '...'}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 cursor-pointer flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded"
                    >
                        <span>{isExpanded ? 'Voir moins' : 'Voir plus'}</span>
                        {isExpanded ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                )}
            </div>
        );
    };

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

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="sticky top-0 z-20 border-b border-white/20 dark:border-neutral-700/60 bg-white/80 dark:bg-neutral-900/80 shadow-sm backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/entreprises"
                                    className="group flex items-center space-x-2 rounded-lg bg-white/60 dark:bg-neutral-800/60 px-3 py-2 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-white/80 dark:hover:bg-neutral-700/80 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
                                >
                                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                    <span className="text-sm font-medium">Retour aux entreprises</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 p-8 shadow-xl backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:to-purple-400/10"></div>
                                <div className="relative">
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg ring-4 ring-white/20 dark:ring-neutral-700/20">
                                                <Building2 className="text-white" size={36} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-3 flex items-center space-x-3">
                                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{entreprise.denomination}</h1>
                                                </div>
                                                <div className="mb-4 flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center space-x-1">
                                                        <Shield size={16} className="text-slate-400 dark:text-slate-500" />
                                                        <span>RC: {entreprise.rc}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(entreprise.rc, 'rc')}
                                                            className="text-slate-400 dark:text-slate-500 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                                                        >
                                                            {copiedField === 'rc' ? (
                                                                <CheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <Copy size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Hash size={16} className="text-slate-400 dark:text-slate-500" />
                                                        <span>ICE: {entreprise.ice}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(entreprise.ice, 'ice')}
                                                            className="text-slate-400 dark:text-slate-500 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                                                        >
                                                            {copiedField === 'ice' ? (
                                                                <CheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <Copy size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 p-6 shadow-lg backdrop-blur-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Chiffre d'Affaires</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{entreprise.chiffre_affaire}</p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 p-6 shadow-lg backdrop-blur-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <DollarSign className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Capital Social</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{entreprise.capital_social}</p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 p-6 shadow-lg backdrop-blur-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                            <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Tribunal</p>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{entreprise.tribunal}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 shadow-xl backdrop-blur-sm">
                                <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 px-8 py-6">
                                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                                        <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
                                        <span>Informations détaillées</span>
                                    </h2>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div className="space-y-6">
                                            <div className="group">
                                                <div className="flex items-center space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                                        <Briefcase className="text-indigo-600 dark:text-indigo-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Registre du Commerce</p>
                                                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{entreprise.rc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(entreprise.rc, 'rc-detail')}
                                                        className="text-slate-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-300"
                                                    >
                                                        {copiedField === 'rc-detail' ? (
                                                            <CheckCircle size={18} className="text-green-500" />
                                                        ) : (
                                                            <Copy size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                        <Phone className="text-orange-600 dark:text-orange-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Téléphone</p>
                                                        <div className="space-y-1">
                                                            {entreprise.tel?.map((telephone, index) => (
                                                                <p
                                                                    key={index}
                                                                    className="text-lg font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                                                                >
                                                                    {telephone}
                                                                </p>
                                                            )) || <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Aucun téléphone</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                                        <User className="text-red-600 dark:text-red-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Dirigeants</p>
                                                        <div className="space-y-1">
                                                            {entreprise.diregeants?.map((dirigeant, index) => (
                                                                <p key={index} className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                                    {dirigeant.prenom} {dirigeant.nom} - {dirigeant.fonction}
                                                                </p>
                                                            )) || <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Aucun dirigeant</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                        <Calendar className="text-purple-600 dark:text-purple-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Date du Bilan</p>
                                                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{entreprise.bilan_date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="group">
                                                <div className="flex items-start space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                                        <FileText className="text-indigo-600 dark:text-indigo-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Objet Social</p>
                                                        <ExpandableText 
                                                            text={entreprise.object_social} 
                                                            maxLength={150} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <div className="flex items-start space-x-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-4 transition-all duration-200 hover:shadow-md">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                        <MapPin className="text-green-600 dark:text-green-400" size={22} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Adresse</p>
                                                        <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{entreprise.adresse}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-2xl border border-white/20 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-900/90 shadow-xl backdrop-blur-sm">
                                <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4">
                                    <h3 className="flex items-center space-x-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        <CirclePlus size={18} className="text-indigo-600 dark:text-indigo-400" />
                                        <span>Actions rapides</span>
                                    </h3>
                                </div>
                                <div className="space-y-4 p-6">
                                    <Link
                                        href={`/entreprises/${entreprise.id}/action`}
                                        className="group flex w-full transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-emerald-600 hover:to-green-700 dark:hover:from-emerald-700 dark:hover:to-green-800 hover:shadow-xl"
                                    >
                                        <CirclePlus size={18} className="transition-transform group-hover:scale-110" />
                                        <span className="font-medium">Nouvelle Action</span>
                                    </Link>
                                    <Link
                                        href={`https://www.google.com/maps/search/${encodeURIComponent(entreprise.adresse)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex w-full transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-700 dark:hover:to-pink-800 hover:shadow-xl"
                                    >
                                        <MapPin size={18} className="transition-transform group-hover:scale-110" />
                                        <span className="font-medium">Localiser</span>
                                        <ExternalLink size={14} />
                                    </Link>

                                    {entreprise.hasAction && (
                                        <Link
                                            href={`/entreprises/${entreprise.id}/liste-actions`}
                                            className="group flex w-full transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-800 hover:shadow-xl"
                                        >
                                            <Calendar size={18} className="transition-transform group-hover:scale-110" />
                                            <span className="font-medium">Liste des Actions</span>
                                        </Link>
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