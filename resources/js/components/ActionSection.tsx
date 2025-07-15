// components/ActionSection.tsx
import React from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import { CheckCircleIcon } from './FormIcons';

interface ActionSectionProps {
  form: {
    data: {
      feedback: string;
      next_step: string;
      besoin_client: string;
      commentaire_action: string;
    };
    errors: {
      feedback?: string;
      next_step?: string;
      besoin_client?: string;
      commentaire_action?: string;
    };
    setData: (field: string, value: string) => void;
  };
}

export default function ActionSection({ form }: ActionSectionProps) {
  const feedbackOptions = [
    { value: 'Très satisfait', label: 'Très satisfait' },
    { value: 'Satisfait', label: 'Satisfait' }
  ];

  const nextStepOptions = [
    { value: 'Appel téléphonique de suivi', label: 'Appel téléphonique de suivi' },
    { value: 'Envoyer un email', label: 'Envoyer un email' }
  ];

  const besoinClientOptions = [
    { value: 'Appel téléphonique de suivi', label: 'Appel téléphonique de suivi' },
    { value: 'Envoyer un email', label: 'Envoyer un email' }
  ];

  return (
    <FormSection
      title="Informations Action"
      subtitle="Détails sur l'action à entreprendre"
      icon={<CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
      iconBgColor="bg-emerald-100"
      headerBgColor="bg-gradient-to-r from-emerald-50 to-teal-50"
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
      </div>
    </FormSection>
  );
}