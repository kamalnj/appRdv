<?php

namespace App\Imports;

use App\Models\Entreprise;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class UsersImport implements ToModel, WithStartRow
{
    private array $seenICE = [];

    public function startRow(): int
    {
        return 1; // skip header
    }

    /**
     * Decode Unicode escape sequences like \u00e9 to é
     */

    public function model(array $row)
    {
        // simple guard: expect at least denomination and rc
        if (count($row) < 2) {
            throw ValidationException::withMessages([
                'file' => "Import bloqué : ligne incomplète (au moins Dénomination et RC requis)."
            ]);
        }

        $denomination = isset($row[0]) ? (string)$row[0] : '';
        $rc = isset($row[1]) ? (string)$row[1] : '';
        $ice = isset($row[6]) ? (string)$row[6] : '';


        // required check
        if ($denomination === '' || $ice === '') {
            return null; // ignore la ligne
        }

        // duplicate in same file (ICE)
        if (in_array($ice, $this->seenICE, true)) {
            throw ValidationException::withMessages([
                'file' => "Import bloqué : ICE dupliqué dans le fichier — '{$ice}'."
            ]);
        }
        $this->seenICE[] = $ice;

        // exists in DB
        if (Entreprise::where('ice', $ice)->exists()) {
            throw ValidationException::withMessages([
                'file' => "Import bloqué : ICE '{$ice}' existe déjà dans la base."
            ]);
        }

        // parse tel -> array (separator ;)
        $telsRaw = isset($row[9]) ? (string)$row[9] : '';
        $tels = [];
        if ($telsRaw !== '') {
            $parts = array_map('trim', explode(';', $telsRaw));
            $parts = array_filter($parts, fn($p) => $p !== '');
            $tels = array_values($parts);
        }

        $dirRaw = $row[10] ?? '';
        $dirigeants = [];

        if ($dirRaw !== '') {
            $parts = array_map('trim', explode('|', $dirRaw));
            $parts = array_filter($parts, fn($p) => $p !== '');

            foreach ($parts as $part) {
                // Remove labels (nom:, prénom:, dénomination:, fonction:)
                $cleaned = preg_replace('/\b(nom:|prénom:|dénomination:|fonction:)\s*/i', '', $part);

                // Example: "ITURRI FRANCO JUAN FRANCISCO GRNT"
                // Split into words
                $words = preg_split('/\s+/', $cleaned);

                if (count($words) >= 2) {
                    $nom = array_shift($words);                // first word = surname
                    $fonction = array_pop($words);             // last word = fonction
                    $prenom = implode(' ', $words);            // middle words = firstname(s)

                    $dirigeants[] = [
                        'nom' => $nom,
                        'prenom' => $prenom,
                        'fonction' => $fonction,
                    ];
                } else {
                    // fallback if format is weird
                    $dirigeants[] = [
                        'nom' => $cleaned,
                        'prenom' => '',
                        'fonction' => '',
                    ];
                }
            }
        }
        $requiredFields = [
            2 => 'Tribunal',
            3 => 'Capital social',
            4 => 'Adresse',
            5 => 'Objet social',
            6 => 'ICE',
            7 => 'Date du bilan',
            8 => 'Chiffre d\'affaires',
        ];

        foreach ($requiredFields as $index => $label) {
            if (!isset($row[$index]) || trim((string)$row[$index]) === '') {
                throw ValidationException::withMessages([
                    'file' => "Import bloqué : la colonne '{$label}' est manquante pour RC '{$rc}'."
                ]);
            }
        }



        // return model (keep 'diregeants' key as requested)
        return new Entreprise([
            'denomination' => $denomination,
            'rc' => $rc,
            'tribunal' => isset($row[2]) ? (string)$row[2] : null,
            'capital_social' => isset($row[3]) ? (string)$row[3] : null,
            'adresse' => isset($row[4]) ? (string)$row[4] : null,
            'object_social' => isset($row[5]) ? (string)$row[5] : null,
            'ice' => isset($row[6]) ? (string)$row[6] : null,
            'bilan_date' => isset($row[7]) ? (string)$row[7] : null,
            'chiffre_affaire' => isset($row[8]) ? (string)$row[8] : null,
            'tel' => $tels,                // array
            'diregeants' => $dirigeants,   // array
            'assistante_id'   =>  isset($row[11]) ? (string)$row[11] : null,
            'lot'   =>  isset($row[12]) ? (string)$row[12] : null,


        ]);
    }
}
