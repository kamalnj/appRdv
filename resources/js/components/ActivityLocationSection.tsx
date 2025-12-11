import React from 'react';
import FormField from '@/components/FormField';
import FormSection from '@/components/FormSection';
import { MapPin } from 'lucide-react';

interface ActivityLocationSectionProps {
    formData: {
        object_social: string;
        adresse: string;
    };
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
}

export const ActivityLocationSection = ({ formData, errors, onChange }: ActivityLocationSectionProps) => {
    return (
        <FormSection
            title="Activité et Localisation"
            subtitle="Objet social et adresse"
            icon={<MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900"
            headerBgColor="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-900"
        >
            <FormField
                label="Objet Social"
                name="object_social"
                type="text"
                required
                placeholder="Ex: Import-Export de produits..."
                value={formData.object_social}
                onChange={(value: string) => onChange('object_social', value)}
                error={errors.object_social}
            />
            <FormField
                label="Adresse Complète"
                name="adresse"
                type="text"
                required
                placeholder="Numéro, Rue, Ville"
                value={formData.adresse}
                onChange={(value: string) => onChange('adresse', value)}
                error={errors.adresse}
            />
        </FormSection>
    );
};