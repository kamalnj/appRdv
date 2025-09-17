<?php

namespace App\Exports;

use App\Models\Entreprise;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EntreprisesExport implements FromCollection, WithHeadings
{
    /**
     * Get the collection of entreprises with selected columns
     */
    public function collection()
    {
        return Entreprise::select(
            'id',
            'denomination',
            'rc',
            'tribunal',
            'capital_social',
            'adresse',
            'object_social',
            'ice',
            'bilan_date',
            'chiffre_affaire',
            'tel',
            'diregeants',
            'assistante_id'
        )->get();
    }

    /**
     * Add headings to Excel
     */
    public function headings(): array
    {
        return [
            'ID',
            'Dénomination',
            'RC',
            'Tribunal',
            'Capital Social',
            'Adresse',
            'Objet Social',
            'ICE',
            'Date Bilan',
            'Chiffre d\'Affaire',
            'Téléphone',
            'Dirigeants',
            'Assistante ID',
        ];
    }
}
