// components/FormSection.tsx
import React from 'react';

interface FormSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  headerBgColor: string;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  subtitle,
  icon,
  iconBgColor,
  headerBgColor,
  children
}: FormSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-xl dark:shadow-neutral-900/50 ring-1 ring-gray-900/5 dark:ring-neutral-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-neutral-900/70">
      <div className={`border-b border-gray-100 dark:border-neutral-700 ${headerBgColor} px-8 py-6`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {children}
        </div>
      </div>
    </div>
  );
}