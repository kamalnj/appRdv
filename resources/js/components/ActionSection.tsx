// components/ActionSection.tsx
import FormField from './FormField';
import { CheckCircleIcon } from './FormIcons';
import FormSection from './FormSection';

interface ActionSectionProps {
    form: {
        data: {
            feedback: string;
            next_step: string;
            besoin_client: string;
            commentaire_action: string;
            contact: string;
        };
        errors: {
            feedback?: string;
            next_step?: string;
            besoin_client?: string;
            commentaire_action?: string;
            contact?: string;
        };
        setData: (field: string, value: string) => void;
    };
}

export default function ActionSection({ form }: ActionSectionProps) {
    const feedbackOptions = [
        { value: 'Pas encore contacté', label: 'Pas encore contacté' },
        { value: 'Contacté, non atteint — à réessayer', label: 'Contacté, non atteint — à réessayer' },
        { value: "Contacté, atteint, pas éligible / pas d'investissement", label: "Contacté, atteint, pas éligible / pas d'investissement" },
        { value: 'Contacté, atteint, éligible et intéressé pour un RDV', label: 'Contacté, atteint, éligible et intéressé pour un RDV' },
        {
            value: 'Contacté, atteint, intéressé, mais réponses floues / en cours de décision',
            label: 'Contacté, atteint, intéressé, mais réponses floues / en cours de décision',
        },
        { value: 'Contacté, atteint, intéressé, mais pour des projets futurs', label: 'Contacté, atteint, intéressé, mais pour des projets futurs' },
        { value: 'Contacté, atteint, non intéressé ou déjà accompagné', label: 'Contacté, atteint, non intéressé ou déjà accompagné' },
        { value: 'Contacté, souhaite être rappelé', label: 'Contacté, souhaite être rappelé' },
        { value: 'AUTRES - à développer en commentaire', label: 'AUTRES - à développer en commentaire' },
    ];

    const nextStepOptions = [
        { value: "Veuillez l'appeler", label: "Veuillez l'appeler" },
        { value: "Cherchez comment l'atteindre", label: "Cherchez comment l'atteindre" },
        {
            value: 'À recontacter plus tard, mais envoyez une présentation de nos prestations',
            label: 'À recontacter plus tard, mais envoyez une présentation de nos prestations',
        },
        {
            value: 'Avez-vous fixé un RDV ? Si oui, quand ? Si non , pourquoi ? Essayez de fixer un rdv ASAP',
            label: 'Avez-vous fixé un RDV ? Si oui, quand ? Si non , pourquoi ? Essayez de fixer un rdv ASAP',
        },
        { value: 'À rappeler dans 2–3 mois', label: 'À rappeler dans 2–3 mois' },
        { value: 'Recontacter à la période du lancement du projet', label: 'Recontacter à la période du lancement du projet' },
        { value: 'À rappeler dans une semaine', label: 'À rappeler dans une semaine' },
        { value: 'Développer votre commentaire', label: 'Développer votre commentaire' },
    ];

    const besoinClientOptions = [
        { value: 'Appel téléphonique de suivi', label: 'Appel téléphonique de suivi' },
        { value: 'Envoyer un email', label: 'Envoyer un email' },
    ];

    return (
        <FormSection
            title="Informations Action"
            subtitle="Détails sur l'action à entreprendre"
            icon={<CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900"
            headerBgColor="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900"
        >
            <FormField
                label="Feedback"
                name="feedback"
                type="select"
                value={form.data.feedback}
                onChange={(value) => form.setData('feedback', value)}
                error={form.errors.feedback}
                required
                placeholder="Choisissez un feedback"
                options={feedbackOptions}
            />

            <FormField
                label="Next step"
                name="next_step"
                type="select"
                value={form.data.next_step}
                onChange={(value) => form.setData('next_step', value)}
                error={form.errors.next_step}
                required
                placeholder="Choisissez une étape"
                options={nextStepOptions}
            />

            <FormField
                label="Besoin du client"
                name="besoin_client"
                type="select"
                value={form.data.besoin_client}
                onChange={(value) => form.setData('besoin_client', value)}
                error={form.errors.besoin_client}
                required
                placeholder="Choisissez le besoin"
                options={besoinClientOptions}
            />

            <div className="md:col-span-2">
                <FormField
                    label="Commentaire Action"
                    name="commentaire_action"
                    type="textarea"
                    value={form.data.commentaire_action}
                    onChange={(value) => form.setData('commentaire_action', value)}
                    error={form.errors.commentaire_action}
                    placeholder="Ajoutez vos commentaires sur l'action..."
                    rows={3}
                />
                <div className="mt-4">
                    <FormField
                        label="Contact"
                        name="contact"
                        type="textarea"
                        value={form.data.contact}
                        onChange={(value) => form.setData('contact', value)}
                        error={form.errors.contact}
                        rows={3}
                    />
                </div>
            </div>
        </FormSection>
    );
}
