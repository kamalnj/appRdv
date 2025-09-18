<?php

namespace App\Exports;

use App\Models\Action;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ActionsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $entrepriseId;

    public function __construct($entrepriseId)
    {
        $this->entrepriseId = $entrepriseId;
    }

    public function collection()
    {
        return Action::where('entreprise_id', $this->entrepriseId)
            ->select(
                'id',
                'entreprise_id',
                'assistante_id',
                'feedback',
                'next_step',
                'besoin_client',
                'commentaire',
                'contact',
            )
            ->get();
    }

    public function map($action): array
    {
        return [
            $action->id,
            $action->entreprise_id,
            $action->assistante_id,
            $action->feedback,
            $action->next_step,
            $action->besoin_client,
            $action->commentaire,
            $action->contact,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Entreprise',
            'Assistante',
            'Feedback',
            'Next Step',
            'Besoin Client',
            'Commentaire',
            'Contact',
        ];
    }
}
