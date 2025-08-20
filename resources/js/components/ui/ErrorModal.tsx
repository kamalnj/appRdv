import { XCircle } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    buttonText: string;
}

export default function ErrorModal({ isOpen, onClose, message, buttonText }: ErrorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
                <div className="flex items-center mb-4">
                    <XCircle className="h-6 w-6 text-red-500 mr-2" />
                    <h2 className="text-lg font-semibold text-red-600">Erreur</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}