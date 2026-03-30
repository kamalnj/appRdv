<?php

namespace App\Http\Controllers;

use App\Exports\ActionsExport;
use App\Exports\EntreprisesExport;
use App\Exports\EntreprisesSansActionsExport;
use App\Exports\RdvsExport;
use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Carbon\Carbon;
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
public function feedbackPage(Request $request)
{
    $request->validate([
        'assistante_id' => 'nullable|exists:users,id',
        'date_from' => 'nullable|date',
        'date_to' => 'nullable|date|after_or_equal:date_from',
    ]);

    // 1️⃣ Charger TOUTES les actions filtrées (UNE SEULE REQUÊTE)
    $actions = Action::with('entreprise:id,denomination,rc,tribunal')
        ->whereNotNull('feedback')
        ->where('feedback', '!=', '')
        ->when($request->assistante_id, fn ($q) =>
            $q->where('assistante_id', $request->assistante_id)
        )
        ->when($request->date_from, fn ($q) =>
            $q->whereDate('created_at', '>=', $request->date_from)
        )
        ->when($request->date_to, fn ($q) =>
            $q->whereDate('created_at', '<=', $request->date_to)
        )
        ->get();

    // 2️⃣ Regrouper en PHP (clair et lisible)
    $feedbackData = $actions
        ->groupBy('feedback')
        ->map(function ($group) {

            return [
                'feedback' => $group->first()->feedback,
                'count' => $group->count(),
                'entreprises' => $group
                    ->pluck('entreprise')
                    ->filter()               // enlève les null
                    ->unique('id')           // entreprises uniques
                    ->values(),
            ];
        })
        ->sortByDesc('count')
        ->values();

    $assistantes = User::select('id', 'name')
        ->where('role', 'assistant')
        ->get();

    return Inertia::render('Consultant/Feedbacks', [
        'feedbackData' => $feedbackData,
        'assistantes' => $assistantes,
        'filters' => [
            'assistante_id' => $request->assistante_id ? (int) $request->assistante_id : null,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ],
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
     public function exportEntreprisesSansActions()
    {
        return Excel::download(new EntreprisesSansActionsExport(), 'liste_entreprises_sans_actions.xlsx');
    }



    public function calendar()
    {

     
        $rdvs = Rdv::with(['entreprise.attcom', 'action'])
            ->get()
            ->map(function ($rdv) {
        $attcom = $rdv->entreprise?->attcom;

                return [
                    'title' => 'RDV avec ' . ($rdv->entreprise->denomination ?? ''),
                    'start' => $rdv->date_rdv,
                    'end' => Carbon::parse($rdv->date_rdv)->addHours(4),
                    'localisation' => $rdv->localisation,
                    'idRdv' => $rdv->id,
                    'isqualified' => $rdv->isqualified,
                    'idEntreprise' => $rdv->entreprise_id,
                    'representer_par' => $rdv->representant,
                    'email' => $rdv->email,
                    'fonction' => $rdv->fonction,
                    'telephoneR' => $rdv->telephone,
                    'details' => $rdv->details,
                    'telephone' => $rdv->entreprise->tel ?? null,
                    'commentaire' => $rdv->action->commentaire ?? null,
                    'besoin_client' => $rdv->action->besoin_client ?? null,
                    'feedback' => $rdv->action->feedback ?? null,
                    'next_step' => $rdv->action->next_step ?? null,
                        'hasAttcom' => $attcom !== null,
                     'idAttcom' => $attcom?->id,

                ];
            });


        return Inertia::render('Consultant/Calendrier', [
            'rdvs' => $rdvs,
        ]);
    }
}
