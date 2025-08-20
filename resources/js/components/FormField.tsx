// components/FormField.tsx - Updated version with Dark Mode
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'datetime-local' | 'select' | 'textarea'| 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  options?: Option[];
  min?: string;
  max?: string;
  disabled?: boolean;
  rows?: number; // for textarea
  step?: string; // for datetime-local
}

export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  icon,
  options = [],
  min,
  max,
  disabled = false,
  rows = 3,
  step
}: FormFieldProps) {
  const baseInputClasses = `
    block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
    focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 px-3 py-2
    sm:text-sm transition-colors duration-200
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    ${disabled 
      ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
      : 'bg-white dark:bg-gray-800'
    }
    ${error 
      ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-400 dark:focus:ring-red-400' 
      : ''
    }
    ${icon ? 'pl-10' : 'pl-3'}
  `;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={required}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={required}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={required}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            placeholder={placeholder}
          />
        );

      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        
        {renderInput()}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}