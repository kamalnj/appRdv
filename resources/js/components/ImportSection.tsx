import { useForm } from '@inertiajs/react';
import { FileText, Upload } from 'lucide-react';
import { useState } from 'react';

interface ImportSectionProps {
    /**
     * The endpoint URL to post the file to
     */
    importUrl: string;
    /**
     * Accepted file types (default: .csv,.xlsx,.xls)
     */
    acceptedTypes?: string;
    /**
     * Title for the import section
     */
    title?: string;
    /**
     * Subtitle/description for accepted formats
     */
    subtitle?: string;
    /**
     * Callback function called on successful import
     */
    onSuccess?: () => void;
    /**
     * Callback function called on import error
     */
    onError?: (error: string) => void;
    /**
     * Custom CSS classes for the container
     */
    className?: string;
    /**
     * Whether to use forceFormData (default: true)
     */
    forceFormData?: boolean;
}

const ImportSection = ({
    importUrl,
    acceptedTypes = '.csv,.xlsx,.xls',
    title = 'Importer des données',
    subtitle = 'Formats acceptés: CSV, XLSX, XLS',
    onSuccess,
    onError,
    className = '',
    forceFormData = true,
}: ImportSectionProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { post, reset, setData, processing } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
        setData('file', file || null);
    };

    const handleImport = () => {
        if (!selectedFile) {
            const errorMessage = 'Veuillez sélectionner un fichier.';
            if (onError) {
                onError(errorMessage);
            } else {
                alert(errorMessage);
            }
            return;
        }

        post(importUrl, {
            forceFormData,
            onSuccess: () => {
                reset();
                setSelectedFile(null);
                if (onSuccess) {
                    onSuccess();
                }
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

                if (onError) {
                    onError(msg);
                } else {
                    alert(msg);
                }
            },
        });
    };

    const clearFile = () => {
        setSelectedFile(null);
        setData('file', null);
    };

    return (
        <div className={`rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-white ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Upload className="h-5 w-5 text-indigo-500 dark:text-white" />
                    {title}
                </h2>
                <span className="text-sm text-gray-500 dark:text-white">{subtitle}</span>
            </div>

            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-indigo-300">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex-1">
                        <input
                            type="file"
                            accept={acceptedTypes}
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100"
                        />
                    </div>
                    <div className="flex gap-2">
                        {selectedFile && (
                            <button
                                onClick={clearFile}
                                className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                            >
                                Annuler
                            </button>
                        )}
                        <button
                            onClick={handleImport}
                            disabled={!selectedFile || processing}
                            className="inline-flex items-center rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Importation...' : 'Importer'}
                        </button>
                    </div>
                </div>

                {selectedFile && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>Fichier sélectionné: {selectedFile.name}</span>
                        <span className="text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportSection;