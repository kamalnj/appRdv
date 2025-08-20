import React, { useMemo } from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import { CalendarIcon, UserIcon, EmailIcon, ClockIcon, LocationIcon } from './FormIcons';

interface RDVSectionProps {
  form: {
    data: {
      commercant_id: string;
      representant: string;
      email: string;
      date_rdv: string;
      localisation: string;
      fonction: string;
      telephone: string;
    };
    errors: {
      commercant_id?: string;
      representant?: string;
      email?: string;
      date_rdv?: string;
      localisation?: string;
      fonction?: string;
    telephone?: string;
    };
    setData: (field: string, value: string) => void;
  };
  commercants: Array<{ id: number; name: string }>;
  rdvsPris: Record<string, string[]>;
}

export default function RDVSection({ form, commercants, rdvsPris }: RDVSectionProps) {
  const commercantOptions = useMemo(() => 
    commercants.map(commercant => ({
      value: commercant.id.toString(),
      label: commercant.name
    })), [commercants]
  );

  // Liste des dates réservées pour le commerçant sélectionné
  const rdvsIndisponibles = useMemo(() => {
    return form.data.commercant_id 
      ? rdvsPris[form.data.commercant_id] || []
      : [];
  }, [form.data.commercant_id, rdvsPris]);

  // Normaliser la date choisie à la même granularité (ex: "YYYY-MM-DDTHH:mm")
  const normalizeDate = (dateStr: string) => dateStr.slice(0, 16);

  const handleDateChange = (value: string) => {
    if (rdvsIndisponibles.some(d => normalizeDate(d) === normalizeDate(value))) {
      alert('Ce créneau est déjà réservé, veuillez en choisir un autre.');
      return;
    }
    form.setData('date_rdv', value);
  };

  const handleCommercantChange = (value: string) => {
    form.setData('commercant_id', value);
    // Clear the date when changing commercant to avoid conflicts
    if (form.data.date_rdv) {
      form.setData('date_rdv', '');
    }
  };

  // Generate minimum date-time (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour buffer
    return now.toISOString().slice(0, 16);
  };

  return (
    <FormSection
      title="Rendez-vous"
      subtitle="Planification du rendez-vous"
      icon={<CalendarIcon className="h-5 w-5 text-blue-600" />}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900"
            headerBgColor="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900"
    >
      <FormField
        label="Commerçant"
        name="commercant_id"
        type="select"
        value={form.data.commercant_id}
        onChange={handleCommercantChange}
        error={form.errors.commercant_id}
        required
        placeholder="Sélectionner un commerçant"
        options={commercantOptions}
      />

      <FormField
        label="Représentant"
        name="representant"
        type="text"
        value={form.data.representant}
        onChange={(value) => form.setData('representant', value)}
        error={form.errors.representant}
        required
        placeholder="Nom du représentant"
        icon={<UserIcon className="h-4 w-4 text-gray-400" />}
      />
            <FormField
        label="Fonction"
        name="fonction"
        type="text"
        value={form.data.fonction}
        onChange={(value) => form.setData('fonction', value)}
        error={form.errors.fonction}
        required
        placeholder="Fonction du représentant"
        icon={<UserIcon className="h-4 w-4 text-gray-400" />}
      />
            <FormField
        label="Télèphone"
        name="telephone"
        type="tel"
        value={form.data.telephone}
        onChange={(value) => form.setData('telephone', value)}
        error={form.errors.telephone}
        required
        placeholder="Télèphone du représentant"
        icon={<UserIcon className="h-4 w-4 text-gray-400" />}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={form.data.email}
        onChange={(value) => form.setData('email', value)}
        error={form.errors.email}
        required
        placeholder="Email du représentant"
        icon={<EmailIcon className="h-4 w-4 text-gray-400" />}
      />

      <FormField
        label="Date du RDV"
        name="date_rdv"
        type="datetime-local"
        value={form.data.date_rdv}
        onChange={handleDateChange}
        error={form.errors.date_rdv}
        required
        icon={<ClockIcon className="h-4 w-4 text-gray-400" />}
        min={getMinDateTime()}
        disabled={!form.data.commercant_id}
      />

      {!form.data.commercant_id && (
        <p className="text-sm text-gray-500 mt-1">
          Sélectionnez d'abord un commerçant pour choisir une date
        </p>
      )}

      {form.data.commercant_id && rdvsIndisponibles.length > 0 && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800 font-medium">
            Créneaux déjà réservés pour ce commerçant:
          </p>
          <ul className="mt-1 text-xs text-yellow-700 space-y-1">
            {rdvsIndisponibles.map((date, index) => (
              <li key={index}>
                {new Date(date).toLocaleString('fr-FR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormField
        label="Localisation"
        name="localisation"
        type="text"
        value={form.data.localisation}
        onChange={(value) => form.setData('localisation', value)}
        error={form.errors.localisation}
        required
        placeholder="Adresse ou lieu du RDV"
        icon={<LocationIcon className="h-4 w-4 text-gray-400" />}
      />
    </FormSection>
  );
}