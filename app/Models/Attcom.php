<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attcom extends Model
{
    protected $table = 'att_com';
    public $timestamps = false;
     protected $fillable = [
        'rdv_id', 'loi', 'dossier_technique', 'leve_fond', 'iso','test','test_','entreprise_id'
    ];

public function rdv(){
    $this->belongsTo(Rdv::class,'rdv_id');
}
public function entreprise(){
    $this->belongsTo(Entreprise::class,'entreprise_id');
}


}
