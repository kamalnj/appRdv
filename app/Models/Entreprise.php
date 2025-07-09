<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
protected $fillable = [
        'nom', 'secteur', 'localisation', 'email',
        'telephone', 'active'
    ];

    public function rdvs()
    {
        return $this->hasMany(Rdv::class);
    }

    public function actions()
    {
        return $this->hasMany(Action::class);
    }
}
