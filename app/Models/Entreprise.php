<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'denomination',
        'rc',
        'tribunal',
        'capital_social',
        'object_social',
        'adresse',
        'ice',
        'bilan_date',
        'chiffre_affaire',
        'tel',
        'diregeants',

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
