// components/PageHeader.tsx
import React from 'react';
import { CalendarIcon } from './FormIcons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  entrepriseName?: string;
  icon?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  entrepriseName,
  icon = <CalendarIcon className="h-6 w-6 text-white" />
}: PageHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-blue-100">
                {subtitle}
                {entrepriseName && (
                  <span className="font-semibold text-white"> {entrepriseName}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}