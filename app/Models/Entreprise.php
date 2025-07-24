<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
/**
 * @property int $id
 * @property int $id
 * @property string $denomination
 * @property string $tel
 * @property string $date_rdv

 */

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
        public function attcom()
    {
        return $this->hasMany(Attcom::class);
    }
}
