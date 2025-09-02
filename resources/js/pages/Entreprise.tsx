import SuccessModal from '@/components/ui/SuccessModal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, Briefcase, Delete, Eye, FileText, MoreVertical, RotateCcw, Search, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entreprises',
        href: '/Entreprise',
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

interface DropdownMenuProps {
    entrepriseId: number;
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; right: number };
}

const DropdownMenu = ({ entrepriseId, isOpen, onClose, position }: DropdownMenuProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                const target = event.target as Element;
                if (!target.closest('button[data-dropdown-trigger]')) {
                    onClose();
                }
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            // Use setTimeout to avoid immediate closing when opening
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('keydown', handleEscapeKey);
            }, 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="fixed z-50 min-w-[150px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            style={{
                top: position.top,
                right: position.right,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <Link
                href={`/entreprise/${entrepriseId}/show`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                onClick={onClose}
            >
                <Eye className="mr-3 h-4 w-4 text-indigo-500" />
                Voir
            </Link>
            <Link
                href={`/entreprise/${entrepriseId}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                onClick={onClose}
            >
                <RotateCcw className="mr-3 h-4 w-4 text-green-500" />
                Modifier
            </Link>
            <Link
                href={`/entreprise/${entrepriseId}/delete`}
                method="delete"
                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                onClick={onClose}
            >
                <Delete className="mr-3 h-4 w-4 text-red-500" />
                Supprimer
            </Link>
        </div>
    );
};

export default function Index({ entreprises }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [tribunalFilter, setTribunalFilter] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    const tribunals = Array.from(new Set(entreprises.data.map((e) => e.tribunal))).sort();

    const filteredEntreprises = entreprises.data.filter((entreprise) => {
        const matchSearch =
            entreprise.denomination.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.tribunal.toLowerCase().includes(search.toLowerCase()) ||
            entreprise.rc.toLowerCase().includes(search.toLowerCase());

        const matchTribunal = tribunalFilter ? entreprise.tribunal === tribunalFilter : true;

        return matchSearch && matchTribunal;
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
            alert('Veuillez sélectionner un fichier.');
            return;
        }

        post(`/users-import`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setSelectedFile(null);
                setIsModalOpen(true);
            },
            onError: (errors) => {
                let msg = "Une erreur s'est produite lors de l'importation. Veuillez réessayer.";

                if (errors) {
                    if (Array.isArray(errors.file) && errors.file.length > 0) {
                        msg = errors.file[0];
                    } else {
                        const firstKey = Object.keys(errors)[0];
                        const firstVal = errors[firstKey];
                        if (Array.isArray(firstVal) && firstVal.length > 0) {
                            msg = firstVal[0];
                        } else if (typeof firstVal === 'string') {
                            msg = firstVal;
                        }
                    }
                }
                alert(msg);
            },
        });
    };

    const clearFilters = () => {
        setSearch('');
        setTribunalFilter('');
        router.visit(route('entreprise.index'), {
            method: 'get',
            preserveState: false,
        });
    };

    const handleDropdownClick = (e: React.MouseEvent, entrepriseId: number) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom + 5,
            right: window.innerWidth - rect.right,
        });

        if (openDropdownId === entrepriseId) {
            setOpenDropdownId(null);
        } else {
            setOpenDropdownId(entrepriseId);
        }
    };

    const closeDropdown = () => {
        setOpenDropdownId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entreprises" />

            <div className="min-h-screen bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Section Import */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-white">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    <Upload className="h-5 w-5 text-indigo-500 dark:text-white" />
                                    Importer des données
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-white">Formats acceptés: CSV, XLSX, XLS</span>
                            </div>

                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-indigo-300">
                                <div className="flex flex-col items-center gap-4 sm:flex-row">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                    <button
                                        onClick={handleImport}
                                        disabled={!selectedFile || processing}
                                        className="inline-flex items-center rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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

                        {/* Section Recherche et Filtres */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70">
                            <div className="space-y-4">
                                {/* Barre de recherche et boutons */}
                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom, tribunal ou RC..."
                                            className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        value={tribunalFilter}
                                        onChange={(e) => setTribunalFilter(e.target.value)}
                                        className="min-w-48 rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                    >
                                        <option value="">Tous les tribunaux</option>
                                        {tribunals.map((tribunal) => (
                                            <option key={tribunal} value={tribunal}>
                                                {tribunal}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtres standards */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {(search || tribunalFilter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section Résultats */}
                        <div className="rounded-xl border bg-white shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-neutral-50">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">
                                        Résultats
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            ({filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''})
                                        </span>
                                    </h3>

                                    {filteredEntreprises.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {filteredEntreprises.length} sur {entreprises.data.length} entreprise
                                            {entreprises.data.length > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {filteredEntreprises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-neutral-50">Aucune entreprise trouvée</h3>
                                    <p className="max-w-md text-center text-gray-500">
                                        Aucune entreprise ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre
                                        recherche.
                                    </p>
                                    {(search || tribunalFilter) && (
                                        <button onClick={clearFilters} className="mt-4 font-medium text-indigo-600 hover:text-indigo-700">
                                            Effacer tous les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Entreprise
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Tribunal
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">RC</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:border-neutral-700/60 dark:bg-neutral-900/70">
                                            {filteredEntreprises.map((entreprise) => (
                                                <tr key={entreprise.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-neutral-50">
                                                                    {entreprise.denomination}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Briefcase className="mr-2 h-4 w-4 text-gray-400 dark:text-neutral-50" />
                                                            <span className="text-sm text-gray-900 dark:text-neutral-50">{entreprise.tribunal}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FileText className="mr-2 h-4 w-4 text-gray-400" />
                                                            <span className="font-mono text-sm text-gray-900 dark:text-neutral-50">
                                                                {entreprise.rc}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="relative px-6 py-4 text-right whitespace-nowrap">
                                                        <button
                                                            data-dropdown-trigger
                                                            onClick={(e) => handleDropdownClick(e, entreprise.id)}
                                                            className="inline-flex items-center rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-700 dark:hover:text-gray-200"
                                                        >
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>

                                                        <DropdownMenu
                                                            entrepriseId={entreprise.id}
                                                            isOpen={openDropdownId === entreprise.id}
                                                            onClose={closeDropdown}
                                                            position={dropdownPosition}
                                                        />
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

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-700/60 dark:bg-neutral-900/70">
                <div className="flex items-center space-x-2">
                    {entreprises.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                link.active
                                    ? 'bg-indigo-600 text-white'
                                    : link.url
                                      ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                      : 'cursor-not-allowed text-gray-400'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

                <div className="text-sm text-gray-500">
                    Affichage de {entreprises.from} à {entreprises.to} sur {entreprises.total} résultats
                </div>
            </div>

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message="Fichier Importé Avec Succès !"
                buttonText="Continuer"
                onContinue={() => router.visit('/entreprise')}
            />
        </AppLayout>
    );
}
