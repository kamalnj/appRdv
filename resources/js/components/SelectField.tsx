interface SelectFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    error?: string;
    options: { id: string | number; name: string }[];
    placeholder?: string;
    icon?: React.ElementType;
    required?: boolean;
}

export default function SelectField({
    label,
    value,
    onChange,
    error,
    options,
    placeholder = '-- Sélectionner --',
    icon: Icon,
    required = false,
}: SelectFieldProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
                {Icon && <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    className={`w-full appearance-none rounded-xl border-2 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all duration-200 dark:bg-neutral-800/60 dark:text-white ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-neutral-600 dark:focus:border-blue-400'
                    } cursor-pointer hover:border-gray-300 dark:hover:border-neutral-500 focus:ring-4 focus:outline-none`}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-4 w-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
