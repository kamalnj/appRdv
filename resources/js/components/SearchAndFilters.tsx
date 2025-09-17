import { Search, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
    value: string;
    label: string;
}

export interface ActiveFilter {
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
}

interface SearchAndFiltersProps {
    // Search props
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    
    // Filter props
    filters?: {
        key: string;
        label: string;
        value: string;
        options: FilterOption[];
        onChange: (value: string) => void;
        placeholder?: string;
    }[];
    
    // Active filters for display
    activeFilters?: ActiveFilter[];
    
    // Clear all filters
    onClearAll?: () => void;
    
    // Styling
    className?: string;
}

export default function SearchAndFilters({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Rechercher...",
    filters = [],
    activeFilters = [],
    onClearAll,
    className = ""
}: SearchAndFiltersProps) {
    const hasActiveFilters = searchValue || activeFilters.length > 0;

    const handleClearSearch = () => {
        onSearchChange('');
    };

    return (
        <div className={`rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900/80 ${className}`}>
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full rounded-xl border-0 bg-gray-50 py-4 pr-4 pl-12 text-sm ring-1 ring-gray-200 transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:ring-neutral-700 dark:text-white dark:focus:bg-neutral-800 dark:focus:ring-indigo-400"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchValue && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                {filters.length > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            {filters.map((filter) => (
                                <div key={filter.key} className="relative">
                                    <select
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                    >
                                        <option value="">{filter.placeholder || `Tous les ${filter.label.toLowerCase()}`}</option>
                                        {filter.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                        <span className="text-sm text-gray-500">Filtres actifs:</span>
                        
                        {searchValue && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                                Recherche: "{searchValue}"
                                <button onClick={handleClearSearch} className="hover:text-indigo-600">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        
                        {activeFilters.map((filter, index) => (
                            <span key={`${filter.key}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                {filter.label}: {filter.value}
                                <button onClick={filter.onRemove} className="hover:text-green-600">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                        
                        {onClearAll && (activeFilters.length > 1 || (activeFilters.length > 0 && searchValue)) && (
                            <button
                                onClick={onClearAll}
                                className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Tout effacer
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}