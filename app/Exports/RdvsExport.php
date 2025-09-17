<?php

namespace App\Exports;

use App\Models\Rdv;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RdvsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $entrepriseId;

    public function __construct($entrepriseId)
    {
        $this->entrepriseId = $entrepriseId;
    }

    public function collection()
    {
        return Rdv::where('entreprise_id', $this->entrepriseId)
            ->select(
                'id',
                'entreprise_id',
                'assistante_id',
                'commercant_id',
                'representant',
                'email',
                'fonction',
                'details',
                'telephone',
                'date_rdv',
                'localisation',
                'status',
                'isqualified',
                'action_id'
            )
            ->get();
    }

    public function map($rdv): array
    {
        return [
            $rdv->id,
            $rdv->entreprise_id,
            $rdv->assistante_id,
            $rdv->commercant_id,
            $rdv->representant,
            $rdv->email,
            $rdv->fonction,
            $rdv->details,
            $rdv->telephone,
            optional($rdv->date_rdv)->format('Y-m-d H:i'),
            $rdv->localisation,
            $rdv->status,
            $rdv->isqualified ? 'Oui' : 'Non',
            $rdv->action_id,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Entreprise',
            'Assistante',
            'Commerçant',
            'Représentant',
            'Email',
            'Fonction',
            'Détails',
            'Téléphone',
            'Date RDV',
            'Localisation',
            'Statut',
            'Qualifié',
            'Action liée',
        ];
    }
}
