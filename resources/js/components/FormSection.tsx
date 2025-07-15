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
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-2xl">
      <div className={`border-b border-gray-100 ${headerBgColor} px-8 py-6`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
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