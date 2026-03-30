<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Computer extends Model
{
     protected $fillable = [
        'glpi_id',
        'entity_id',
        'name',
        'serial',
        'contact',
        'last_inventory_update',
        'glpi_date_mod',
        'synced_at',
    ];
}
