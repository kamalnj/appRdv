<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
   protected $fillable = [
        'entreprise_id', 'assistante_id', 'feedback', 'next_step', 'besoin_client','commentaire'
    ];

        public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function assistante()
    {
        return $this->belongsTo(User::class, 'assistante_id');
    }
public function rdv()
{
    return $this->hasOne(Rdv::class, 'action_id');
}
    
}
				