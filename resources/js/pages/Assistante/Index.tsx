import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin, Search, Upload, Filter, Download, Plus, Eye, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Assistante/Index',
    },
];

interface Entreprise {
    id: number;
    denomination: string;
    tribunal: string;
    rc: string;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    entreprises: PaginatedResponse<Entreprise>;
}

export default function Index({ auth, entreprises }: Props) {
    const [search, setSearch] = useState('');
    const [tribunalFilter, settribunalFilter] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const tribunals = Array.from(new Set(entreprises.data.map((e) => e.tribunal))).sort();

    const filteredEntreprises = entreprises.data.filter((entreprise) => {
        const matchSearch =
            entreprise.denomination.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.tribunal.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.rc.toLowerCase().includes(search.toLowerCase());

        const matchtribunal = tribunalFilter ? entreprise.tribunal === tribunalFilter : true;

        return matchSearch && matchtribunal;
    });

    const { post, reset, setData, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
        setData('file', file || null);
    };

    const handleImport = () => {
        if (!selectedFile) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }

        post(`/users-import`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setSelectedFile(null);
                alert('Importation réussie !');
            },
            onError: (errors) => {
                console.log('Erreur de validation :', errors);
            },
        });
    };

    const clearFilters = () => {
        setSearch('');
        settribunalFilter('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
          

                        {/* Import Section */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-indigo-500" />
                                    Importer des données
                                </h2>
                                <span className="text-sm text-gray-500">Formats acceptés: CSV, XLSX, XLS</span>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={handleImport}
                                        disabled={!selectedFile || processing}
                                        className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? 'Importation...' : 'Importer'}
                                    </button>
                                </div>
                                
                                {selectedFile && (
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                        <FileText className="h-4 w-4" />
                                        <span>Fichier sélectionné: {selectedFile.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                                      {/* Search and Filters */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Bar */}
                                <div className="flex-1 relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom, tribunal ou RC..."
                                        className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                {/* Filters */}
                                <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                                    <select
                                        value={tribunalFilter}
                                        onChange={(e) => settribunalFilter(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-w-48"
                                    >
                                        <option value="">Tous les tribunaux</option>
                                        {tribunals.map((tribunal) => (
                                            <option key={tribunal} value={tribunal}>
                                                {tribunal}
                                            </option>
                                        ))}
                                    </select>

                                    {(search || tribunalFilter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Effacer les filtres
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Résultats
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            ({filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''})
                                        </span>
                                    </h3>
                                    
                                    {filteredEntreprises.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {filteredEntreprises.length} sur {entreprises.data.length} entreprise{entreprises.data.length > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {filteredEntreprises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
                                    <p className="text-gray-500 text-center max-w-md">
                                        Aucune entreprise ne correspond à vos critères de recherche. 
                                        Essayez de modifier vos filtres ou votre recherche.
                                    </p>
                                    {(search || tribunalFilter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Entreprise
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tribunal
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    RC
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredEntreprises.map((entreprise) => (
                                                <tr key={entreprise.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {entreprise.denomination}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-sm text-gray-900">{entreprise.tribunal}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-sm font-mono text-gray-900">{entreprise.rc}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/entreprises/${entreprise.id}`}
                                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Consulter
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
            
                        </div>
                    </div>
                </div>
            </div>
                               <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200'>
                <div className="flex items-center space-x-2">
                    {entreprises.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                link.active 
                                    ? 'bg-indigo-600 text-white' 
                                    : link.url 
                                        ? 'text-gray-700 hover:bg-gray-100' 
                                        : 'text-gray-400 cursor-not-allowed'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
                
                {/* Optional: Add pagination info */}
                <div className="text-sm text-gray-500">
                    Affichage de {entreprises.from} à {entreprises.to} sur {entreprises.total} résultats
                </div>
            </div>
        </AppLayout>
    );
}