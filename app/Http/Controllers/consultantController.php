<?php

namespace App\Http\Controllers;

use App\Exports\ActionsExport;
use App\Exports\EntreprisesExport;
use App\Exports\RdvsExport;
use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class consultantController extends Controller
{

    public function index()
    {
        $entreprises = Entreprise::paginate(200);
        return Inertia::render('Consultant/Index', [
            'entreprises' => $entreprises,
        ]);
    }
public function details(Entreprise $entreprise)
{
    $entreprise->load(['rdvs', 'actions']);

    return Inertia::render('Consultant/Details', [
        'entreprise' => $entreprise,
        'rdvs' => $entreprise->rdvs,
        'actions' => $entreprise->actions,
    ]);
}
public function exportEntrepriseData(Entreprise $entreprise, $type)
{
    if ($type === 'rdvs') {
        return Excel::download(new RdvsExport($entreprise->id), "rdvs_entreprise_{$entreprise->denomination}.xlsx");
    }

    if ($type === 'actions') {
        return Excel::download(new ActionsExport($entreprise->id), "actions_entreprise_{$entreprise->denomination}.xlsx");
    }

    abort(404, 'Type non valide');
}
// Controller
public function exportListeEntreprise()
{
    return Excel::download(new EntreprisesExport, 'liste_entreprises.xlsx');
}

}
