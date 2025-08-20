import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 p-3 text-red-700">
        <div className="flex items-center space-x-2">
            <AlertCircle size={16} />
            <span className="text-sm">{message}</span>
        </div>
        {onDismiss && (
            <button
                onClick={onDismiss}
                className="text-red-500 hover:text-red-700"
                aria-label="Dismiss error"
            >
                <X size={16} />
            </button>
        )}
    </div>
);
