import FormField from '@/components/FormField';
import FormSection from '@/components/FormSection';
import { TrendingUp } from 'lucide-react';

interface FinancialInfoSectionProps {
    formData: {
        capital_social: string;
        chiffre_affaire: string;
        bilan_date: string;
    };
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
}

export const FinancialInfoSection = ({ formData, errors, onChange }: FinancialInfoSectionProps) => {
    return (
        <FormSection
            title="Informations Financières"
            subtitle="Capital et chiffre d'affaires"
            icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900"
            headerBgColor="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    label="Capital Social"
                    name="capital_social"
                    type="text"
                    required
                    placeholder="Ex: 100000 DH"
                    value={formData.capital_social}
                    onChange={(value: string) => onChange('capital_social', value)}
                    error={errors.capital_social}
                />
                <FormField
                    label="Chiffre d'Affaires"
                    name="chiffre_affaire"
                    type="text"
                    required
                    placeholder="Ex: 500000 DH"
                    value={formData.chiffre_affaire}
                    onChange={(value: string) => onChange('chiffre_affaire', value)}
                    error={errors.chiffre_affaire}
                />
            </div>
            <FormField
                label="Année du Bilan"
                name="bilan_date"
                type="number"
                min="1900"
                max="2100"
                required
                placeholder="Ex: 2024"
                value={formData.bilan_date}
                onChange={(value: string) => onChange('bilan_date', value)}
                error={errors.bilan_date}
            />
        </FormSection>
    );
};
