import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Building2, MapPin, Save, X, CheckCircle2,ArrowLeft,Scale,Euro,Hash,Calendar,Target,FileText} from 'lucide-react'
import FormField from '@/components/FormField'
import FormSection from '@/components/FormSection'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Assistante/Index',
    },
    {
        title: 'Modifier Les Informations',
        href: '#',
    },
]

interface Entreprise {
    id: number
    denomination: string
    rc: string
    tribunal: string
    capital_social: string
    adresse: string
    object_social: string
    ice: string
    bilan_date: string
    chiffre_affaire: string
}

interface Props {
    entreprise: Entreprise
}

const useEntrepriseForm = (entreprise: Entreprise) => {
    const [showSuccess, setShowSuccess] = useState(false)
    
    const formData = useForm({
        denomination: entreprise.denomination || '',
        rc: entreprise.rc || '',
        tribunal: entreprise.tribunal || '',
        capital_social: entreprise.capital_social || '',
        adresse: entreprise.adresse || '',
        object_social: entreprise.object_social || '',
        ice: entreprise.ice || '',
        bilan_date: entreprise.bilan_date || '',
        chiffre_affaire: entreprise.chiffre_affaire || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        formData.put(`/entreprise/${entreprise.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 5000)
            }
        })
    }

    const handleCancel = () => {
        window.history.back()
    }

  

    const hideSuccessBanner = () => {
        setShowSuccess(false)
    }

    return {
        ...formData,
        showSuccess,
        handleSubmit,
        handleCancel,
        hideSuccessBanner
    }
}

const formFieldsConfig = {
    general: [
        {
            name: 'denomination',
            label: 'Dénomination sociale',
            type: 'text' as const,
            icon: <Building2 className="h-4 w-4" />,
            placeholder: 'Entrez la dénomination de l\'entreprise',
            required: true
        },
        {
            name: 'adresse',
            label: 'Adresse',
            type: 'textarea' as const,
            icon: <MapPin className="h-4 w-4" />,
            placeholder: 'Entrez l\'adresse complète',
            required: true,
            rows: 3
        },
        {
            name: 'object_social',
            label: 'Objet social',
            type: 'textarea' as const,
            icon: <Target className="h-4 w-4" />,
            placeholder: 'Décrivez l\'objet social de l\'entreprise',
            rows: 4
        }
    ],
    legal: [
        {
            name: 'rc',
            label: 'Registre de Commerce',
            type: 'text' as const,
            icon: <FileText className="h-4 w-4" />,
            placeholder: 'Ex: RC 123456'
        },
        {
            name: 'tribunal',
            label: 'Tribunal',
            type: 'text' as const,
            icon: <Scale className="h-4 w-4" />,
            placeholder: 'Ex: Tribunal de Commerce de Casablanca'
        },
        {
            name: 'ice',
            label: 'Identifiant ICE',
            type: 'text' as const,
            icon: <Hash className="h-4 w-4" />,
            placeholder: 'Ex: 002345678000071'
        },
        {
            name: 'capital_social',
            label: 'Capital social',
            type: 'text' as const,
            icon: <Euro className="h-4 w-4" />,
            placeholder: 'Ex: 100 000 DH'
        }
    ],
    financial: [
        {
            name: 'bilan_date',
            label: 'Date du bilan',
          type: 'number' as const,
            min: 1900,
         max: 2100,
                icon: <Calendar className="h-4 w-4" />
        },
        {
            name: 'chiffre_affaire',
            label: 'Chiffre d\'affaires',
            type: 'text' as const,
            icon: <Euro className="h-4 w-4" />,
            placeholder: 'Ex: 2 500 000 DH'
        }
    ]
}

export default function EntrepriseUpdate({ entreprise }: Props) {
    const {
        data,
        setData,
        processing,
        errors,
        showSuccess,
        handleSubmit,
        handleCancel,
        hideSuccessBanner
    } = useEntrepriseForm(entreprise)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-neutral-900 dark:to-blue-950/30 py-8">
                
                {/* Success Banner */}
                {showSuccess && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Mise à jour réussie</p>
                                <p className="text-sm opacity-90">Les informations ont été sauvegardées</p>
                            </div>
                            <button
                                onClick={hideSuccessBanner}
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4 group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Retour à la liste
                        </button>
                        
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Modifier l'entreprise</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">Mettre à jour les informations de base</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Section Informations générales */}
                        <FormSection 
                            title="Informations générales"
                            subtitle="Données principales de l'entreprise"
                            icon={<Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                            headerBgColor="bg-blue-50/50 dark:bg-blue-900/10"
                        >
                            {formFieldsConfig.general.map((field) => (
                                <FormField
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    value={data[field.name as keyof typeof data]}
                                    onChange={(value) => setData(field.name as keyof typeof data, value)}
                                    error={errors[field.name as keyof typeof errors]}
                                    icon={field.icon}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    rows={field.rows}
                                />
                            ))}
                        </FormSection>

                        {/* Section Informations légales */}
                        <FormSection 
                            title="Informations légales"
                            subtitle="Documents et références officielles"
                            icon={<Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                            headerBgColor="bg-purple-50/50 dark:bg-purple-900/10"
                        >
                            {formFieldsConfig.legal.map((field) => (
                                <FormField
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    value={data[field.name as keyof typeof data]}
                                    onChange={(value) => setData(field.name as keyof typeof data, value)}
                                    error={errors[field.name as keyof typeof errors]}
                                    icon={field.icon}
                                    placeholder={field.placeholder}
                                />
                            ))}
                        </FormSection>

                        {/* Section Informations financières */}
                        <FormSection 
                            title="Informations financières"
                            subtitle="Données comptables et financières"
                            icon={<Euro className="h-5 w-5 text-green-600 dark:text-green-400" />}
                            iconBgColor="bg-green-100 dark:bg-green-900/30"
                            headerBgColor="bg-green-50/50 dark:bg-green-900/10"
                        >
                            {formFieldsConfig.financial.map((field) => (
                                <FormField
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    value={data[field.name as keyof typeof data]}
                                    onChange={(value) => setData(field.name as keyof typeof data, value)}
                                    error={errors[field.name as keyof typeof errors]}
                                    icon={field.icon}
                                    placeholder={field.placeholder}
                                />
                            ))}
                        </FormSection>

                        {/* Action Buttons */}
                        <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-xl dark:shadow-neutral-900/50 ring-1 ring-gray-900/5 dark:ring-neutral-700/50">
                            <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-neutral-800/50">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="order-2 sm:order-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 flex items-center justify-center font-medium"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="order-1 sm:order-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold shadow-sm hover:shadow-md"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                                Mise à jour...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Mettre à jour
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}