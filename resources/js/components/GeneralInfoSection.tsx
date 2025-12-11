import React from 'react';
import FormField from '@/components/FormField';
import FormSection from '@/components/FormSection';
import { Building2 } from 'lucide-react';

interface GeneralInfoSectionProps {
    formData: {
        denomination: string;
        ice: string;
        rc: string;
        tribunal: string;
        lot: string;
    };
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
}

export const GeneralInfoSection = ({ formData, errors, onChange }: GeneralInfoSectionProps) => {
    return (
        <FormSection
            title="Informations Générales"
            subtitle="Détails d'identification de l'entreprise"
            icon={<Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900"
            headerBgColor="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    label="Dénomination"
                    name="denomination"
                    type="text"
                    required
                    value={formData.denomination}
                    onChange={(value: string) => onChange('denomination', value)}
                    error={errors.denomination}
                />
                <FormField
                    label="ICE"
                    name="ice"
                    type="text"
                    required
                    placeholder="15 chiffres"
                    value={formData.ice}
                    onChange={(value: string) => onChange('ice', value)}
                    error={errors.ice}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                    label="RC"
                    name="rc"
                    type="text"
                    required
                    value={formData.rc}
                    onChange={(value: string) => onChange('rc', value)}
                    error={errors.rc}
                />
                <FormField
                    label="Tribunal"
                    name="tribunal"
                    type="text"
                    required
                    value={formData.tribunal}
                    onChange={(value: string) => onChange('tribunal', value)}
                    error={errors.tribunal}
                />
                <FormField
                    label="Lot"
                    name="lot"
                    type="text"
                    required
                    value={formData.lot}
                    onChange={(value: string) => onChange('lot', value)}
                    error={errors.lot}
                />
            </div>
        </FormSection>
    );
};
