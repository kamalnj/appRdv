import React from 'react';
import FormField from '@/components/FormField';
import FormSection from '@/components/FormSection';
import { Users, Phone, Briefcase } from 'lucide-react';

interface ContactManagementSectionProps {
    formData: {
        tel: string;
        diregeants: string;
    };
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
}

export const ContactManagementSection = ({ formData, errors, onChange }: ContactManagementSectionProps) => {
    return (
        <FormSection
            title="Contact et Direction"
            subtitle="Coordonnées et dirigeants"
            icon={<Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
            iconBgColor="bg-orange-100 dark:bg-orange-900"
            headerBgColor="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-neutral-800 dark:to-neutral-900"
        >
            <FormField
                label="Téléphone(s)"
                name="tel"
                type="text"
                required
                placeholder="Ex: 06XXXXXXXX,06XXXXXXXX"
                value={formData.tel}
                onChange={(value: string) => onChange('tel', value)}
                error={errors.tel}
            />
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Séparez plusieurs numéros par des virgules
                        </p>
                    </div>
                </div>
            </div>

            <FormField
                label="Dirigeants"
                name="diregeants"
                type="text"
                required
                placeholder="Ex: Nom-Prénom-Fonction,Nom-Prénom-Fonction"
                value={formData.diregeants}
                onChange={(value: string) => onChange('diregeants', value)}
                error={errors.diregeants}
            />
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="flex">
                    <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div className="ml-3">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Format: Nom-Prénom-Fonction. Séparez plusieurs dirigeants par des virgules
                        </p>
                    </div>
                </div>
            </div>
        </FormSection>
    );
};