import React, { useMemo, useState } from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import RDVCalendar from './RDVCalendar';
import { CalendarIcon, UserIcon, EmailIcon, ClockIcon, LocationIcon, CheckCircleIcon } from './FormIcons';

interface RDVSectionProps {
  form: {
    data: {
      commercant_id: string;
      representant: string;
      email: string;
      date_rdv: string;
      localisation: string;
      fonction: string;
      details: string;
      telephone: string;
    };
    errors: {
      commercant_id?: string;
      representant?: string;
      email?: string;
      date_rdv?: string;
      localisation?: string;
      fonction?: string;
      details?: string;
      telephone?: string;
    };
    setData: (field: string, value: string) => void;
  };
  commercants: Array<{ id: number; name: string }>;
rdvsPris: Record<string, { date_rdv: string; details: string }[]>;
}

export default function RDVSection({ form, commercants, rdvsPris }: RDVSectionProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const commercantOptions = useMemo(() => 
    commercants.map(commercant => ({ 
      value: commercant.id.toString(), 
      label: commercant.name 
    })), [commercants]
  );

const rdvsIndisponibles = useMemo(() => {
  if (!form.data.commercant_id) return [];
  return rdvsPris[form.data.commercant_id] || [];
}, [form.data.commercant_id, rdvsPris]);

  // Get selected commercant name
  const selectedCommercantName = useMemo(() => {
    const commercant = commercants.find(c => c.id.toString() === form.data.commercant_id);
    return commercant ? commercant.name : '';
  }, [form.data.commercant_id, commercants]);

  // Normaliser la date choisie à la même granularité (ex: "YYYY-MM-DDTHH:mm")
  const normalizeDate = (dateStr: string) => dateStr.slice(0, 16);

  const handleDateChange = (value: string) => {
  if (rdvsIndisponibles.some(d => normalizeDate(d.date_rdv) === normalizeDate(value))) {
      // Show a more elegant error message
      setShowSuccessMessage(false);
      // You could implement a toast notification here instead of alert
      alert('Ce créneau est déjà réservé, veuillez en choisir un autre.');
      return;
    }
    form.setData('date_rdv', value);
    if (value && !showSuccessMessage) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleCommercantChange = (value: string) => {
    form.setData('commercant_id', value);
    // Clear the date when changing commercant to avoid conflicts
    if (form.data.date_rdv) {
      form.setData('date_rdv', '');
    }

  };



  return (
    <FormSection
      title="Planification de rendez-vous"
      subtitle="Détails du rendez-vous "
      icon={<CalendarIcon className="h-5 w-5 text-emerald-600" />}
      iconBgColor="bg-emerald-100 dark:bg-emerald-900"
      headerBgColor="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900"
    >
      {/* Commercant Selection */}
      <div className="space-y-6">
        <div className={`transition-all duration-300 ${form.data.commercant_id ? 'opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-emerald-600 font-semibold text-sm">1</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Sélection du commerçant
            </h4>
            {form.data.commercant_id && (
              <CheckCircleIcon className="h-5 w-5 text-emerald-500 ml-2" />
            )}
          </div>
          
          <FormField
            label="Commerçant"
            name="commercant_id"
            type="select"
            value={form.data.commercant_id}
            onChange={handleCommercantChange}
            error={form.errors.commercant_id}
            required
            placeholder="Choisissez un commerçant"
            options={commercantOptions}
          />

        </div>

        {/* Calendar Section */}
        {form.data.commercant_id && (
          <div className="transition-all duration-500 animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-teal-600 font-semibold text-sm">2</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Choisissez votre créneau
              </h4>
              {form.data.date_rdv && (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 ml-2" />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="mt-4 mb-6">
              <FormField
                label="Sélectionnez une date pour RDV"
                name="date_rdv"
                type="datetime-local"
                value={form.data.date_rdv}
                onChange={handleDateChange}
                error={form.errors.date_rdv}
                icon={<ClockIcon className="h-4 w-4 text-gray-400" />}
              />
            </div>
              <RDVCalendar
                rdvsIndisponibles={rdvsIndisponibles}
                commercantName={selectedCommercantName}
              />
            </div>

          </div>
        )}

        {/* Contact Details Section */}
        {form.data.date_rdv && (
          <div className="transition-all duration-500 animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Informations du représentant
              </h4>
              {form.data.representant && form.data.email && (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 ml-2" />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Représentant"
                  name="representant"
                  type="text"
                  value={form.data.representant}
                  onChange={(value) => form.setData('representant', value)}
                  error={form.errors.representant}
                  required
                  placeholder="Nom complet du représentant"
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
                  placeholder="Titre ou poste"
                  icon={<UserIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Téléphone"
                  name="telephone"
                  type="tel"
                  value={form.data.telephone}
                  onChange={(value) => form.setData('telephone', value)}
                  error={form.errors.telephone}
                  required
                  placeholder="+212 6 12 34 56 78"
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
                  placeholder="email@entreprise.com"
                  icon={<EmailIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>
            </div>
          </div>
        )}

        {/* Location and Details Section */}
        {form.data.representant && form.data.email && (
          <div className="transition-all duration-500 animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-semibold text-sm">4</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Lieu et détails
              </h4>
              {form.data.localisation && (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 ml-2" />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <FormField
                label="Lieu de rendez-vous"
                name="localisation"
                type="text"
                value={form.data.localisation}
                onChange={(value) => form.setData('localisation', value)}
                error={form.errors.localisation}
                required
                placeholder="Adresse complète du rendez-vous"
                icon={<LocationIcon className="h-4 w-4 text-gray-400" />}
              />

              <FormField
                label="Détails supplémentaires"
                name="details"
                type="textarea"
                value={form.data.details}
                onChange={(value) => form.setData('details', value)}
                error={form.errors.details}
                placeholder="Informations complémentaires, objectifs du RDV..."
                icon={<UserIcon className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </FormSection>
  );
}