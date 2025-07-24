<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id
 * @property string $date_rdv
 * @property string $localisation
 * @property int $entreprise_id
 * @property string $representant
 * @property string $email
 * @property \App\Models\Entreprise $entreprise
 * @property \App\Models\Action $action
 */

class Rdv extends Model
{
    protected $table = 'rdvs';

    protected $fillable = [
        'entreprise_id', 'assistante_id', 'commercant_id',
        'date_rdv', 'representant', 'email', 'localisation','action_id'
    ];

    // Relations
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

public function action()
{
    return $this->belongsTo(Action::class, 'action_id');
}

    public function assistante()
    {
        return $this->belongsTo(User::class, 'assistante_id');
    }

    public function commercant()
    {
        return $this->belongsTo(User::class, 'commercant_id');
    }
}
