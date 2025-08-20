import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: number;
    text?: string;
}

export const LoadingSpinner = ({ size = 16, text = 'Chargement...' }: LoadingSpinnerProps) => (
    <div className="flex items-center space-x-2">
        <Loader2 size={size} className="animate-spin" />
        <span className="text-sm">{text}</span>
    </div>
);