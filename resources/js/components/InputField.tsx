// components/InputField.tsx
interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    icon?: React.ElementType;
    multiline?: boolean;
    rows?: number;
}

export default function InputField({
    label,
    value,
    onChange,
    error,
    type = 'text',
    placeholder = '',
    icon: Icon,
    multiline = false,
    rows = 3,
}: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                {label}
            </label>
            <div className="relative">
                {multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={rows}
                        className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all duration-200 ${
                            error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        } resize-none hover:border-gray-300 focus:ring-4 focus:outline-none`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all duration-200 ${
                            error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        } hover:border-gray-300 focus:ring-4 focus:outline-none`}
                    />
                )}
            </div>
            {error && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                    <span className="h-1 w-1 rounded-full bg-red-500"></span>
                    {error}
                </p>
            )}
        </div>
    );
}