<?php

namespace App\Imports;

use App\Models\Entreprise;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class UsersImport implements ToModel, WithStartRow
{
    /**
     * Specify the row number to start reading from.
     *
     * @return int
     */
    public function startRow(): int
    {
        return 2; // Skip the header row
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */


    
    public function model(array $row)
    {

        
        return new Entreprise([
            'denomination' => $row[0],
            'rc' => $row[1],
            'tribunal' => $row[2],
            'capital_social' => $row[3],
            'adresse' => $row[4],
            'object_social' => $row[5],
            'ice' => $row[6],
            'bilan_date' =>$row[7],
            'chiffre_affaire' => $row[8],
            'tel' => $row[9] ?? null,
            'diregeants' => $row[10] ?? null,
        ]);
    }
    

    public function rules(): array
    {
        return [
            '0' => 'required|string|max:255', // denomination
            '1' => 'required|string|max:255', // rc
            '2' => 'required|string|max:255', // tribunal
            '3' => 'required|string|max:255', // capital_social
            '4'=> 'required|string|max:255', // adresse
            '5' => 'required|string|max:255', // object_social
            '6' => 'required|string|max:255', // ice
            '7' => 'required|date', // bilan_date
            '8' => 'required|numeric', // chiffre_affaire
            '9' => 'nullable|string|max:20', // tel
            '10' => 'nullable|string|max:255', // dirigeants
        
        ];
    }
}
