// components/SubmitButton.tsx
import React from 'react';
import { CheckIcon, SpinnerIcon } from './FormIcons';

interface SubmitButtonProps {
  isProcessing: boolean;
  processingText?: string;
  defaultText?: string;
  className?: string;
}

export default function SubmitButton({
  isProcessing,
  processingText = 'Création en cours...',
  defaultText = 'Enregistrer',
  className = ''
}: SubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isProcessing}
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {isProcessing ? (
            <>
              <SpinnerIcon />
              {processingText}
            </>
          ) : (
            <>
              <CheckIcon />
              {defaultText}
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>
    </div>
  );
}