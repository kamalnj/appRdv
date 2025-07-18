<?php

namespace App\Http\Controllers;

use App\Imports\UsersImport;
use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;


class assistantController extends Controller
{
    public function assistantDashboard()
    {
        return Inertia::render('Assistante/dashboardA');
    }

    public function index()
    {       
        $entreprise = Entreprise::paginate(200);
        return Inertia::render('Assistante/Index', [
            'entreprises' => $entreprise
        ]);
    }
        public function import(Request $request) 
    {
        // Validate incoming request data
        $request->validate([
            'file' => 'required|max:2048|mimes:xlsx,csv,xls',
        ]);
  
        Excel::import(new UsersImport, $request->file('file'));
                 
        return back()->with('success', 'Users imported successfully.');
    }

    public function indexSimple(Entreprise $entreprise)
    {
            $hasRdv = $entreprise->rdvs()->exists();
            $hasAction = $entreprise->actions()->exists(); 

        return Inertia::render('Assistante/IndexSimple', [
        'entreprise' => array_merge(
            $entreprise->toArray(),
            ['hasRdv' => $hasRdv],
            ['hasAction' => $hasAction]
        )        ]);
    }
public function indexActions(Entreprise $entreprise)
{
    return Inertia::render('Assistante/ListeAction', [
        'entreprise' => $entreprise->only(['id', 'denomination']),
        'actions' => $entreprise->actions()->with('rdv.commercant')->get(),
        'rdvs' => $entreprise->rdvs()->get(),
    ]);
}
public function edit($entrepriseId, Action $action)
{
    $entreprise = Entreprise::findOrFail($entrepriseId);
    $rdv = $action->rdv; 
    $commercants = User::where('role', 'commerçant')->get(['id', 'name']);

    return Inertia::render('Assistante/EditAction', [
        'entreprise' => $entreprise->only(['id', 'denomination']),
        'action' => $action->only(['id', 'feedback', 'next_step', 'besoin_client', 'commentaire']),
        'rdv' => $rdv ? $rdv->only(['date_rdv', 'representant', 'email', 'localisation', 'commercant_id']) : [],
        'commercants' => $commercants,
    ]);
}


public function create($entrepriseId)
{
    $entreprise = Entreprise::findOrFail($entrepriseId);

    // Récupérer tous les RDV pris avec leurs commerçants 
    $rdvsPris = rdv::whereHas('commercant', function($query) {
            $query->where('role', 'commerçant');
        })
        ->select('commercant_id', 'date_rdv')
        ->get()
        ->groupBy('commercant_id')
        ->map(function ($rdvs) {
            return $rdvs->pluck('date_rdv');
        });

    return Inertia::render('Assistante/Action', [
        'entreprise' => $entreprise->only(['id', 'denomination']),
        'assistants' => User::where('role', 'assistant')->select('id', 'name')->get(),
        'commercants' => User::where('role', 'commerçant')->select('id', 'name')->get(),
        'rdvsPris' => $rdvsPris, 
    ]);
}

    /**
     * Store both RDV and Action from a single form submission
     */
public function store(Request $request, $entrepriseId)
{
    $entreprise = Entreprise::findOrFail($entrepriseId);

    $validated = $request->validate([
        'commercant_id' => 'required|exists:users,id',
        'date_rdv' => 'required|date|after:now',
        'representant' => 'required|string|max:1000',
        'email' => 'required|email|max:255',
        'localisation' => 'required|string|max:255',
        'feedback' => 'required|string|max:1000',
        'next_step' => 'required|string|max:255',
        'besoin_client' => 'required|string|max:1000',
        'commentaire_action' => 'nullable|string|max:1000',
    ]);

    $validated['entreprise_id'] = $entreprise->id;

    $assistant = User::where('id', $request->user()->id)->where('role', 'assistant')->first();
    $commercant = User::where('id', $validated['commercant_id'])->where('role', 'commerçant')->first();
    if (!$assistant) {
        return response()->json(['message' => 'L\'assistant sélectionné n\'est pas valide.'], 422);
    }
    if (!$commercant) {
        return response()->json(['message' => 'Le commerçant sélectionné n\'est pas valide.'], 422);
    }

    $dateDebut = Carbon::parse($request->date_rdv);
    $dateFin = $dateDebut->copy()->addHours(4);

    $existe = rdv::where('commercant_id', $request->commercant_id)
        ->where(function ($query) use ($dateDebut, $dateFin) {
            $query->whereRaw('date_rdv < ?', [$dateFin])
                  ->whereRaw('DATE_ADD(date_rdv, INTERVAL 4 HOUR) > ?', [$dateDebut]);
        })
        ->exists();

    if ($existe) {
        return back()->withErrors([
            'date_rdv' => 'Ce créneau chevauche un autre RDV (durée 4h). Veuillez choisir une autre date.',
        ]);
    }
    DB::beginTransaction();
    
    try {
        $action = Action::create([
            'assistante_id' => $request->user()->id,
            'feedback' => $validated['feedback'],
            'next_step' => $validated['next_step'],
            'besoin_client' => $validated['besoin_client'],
            'commentaire' => $validated['commentaire_action'] ?? null,
            'entreprise_id' => $validated['entreprise_id'],
        ]);

        $rdv = Rdv::create([
            'assistante_id' => $request->user()->id,
            'commercant_id' => $validated['commercant_id'],
            'date_rdv' => $validated['date_rdv'],
            'representant' => $validated['representant'],
            'email' => $validated['email'],
            'localisation' => $validated['localisation'],
            'entreprise_id' => $validated['entreprise_id'],
            'action_id' => $action->id, 
        ]);

        DB::commit();
        
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['message' => 'Erreur lors de la création du RDV et de l\'Action.'], 500);
    }

    return redirect()->route('entreprises.index')->with('success', 'RDV et Action créés avec succès!');
}
    public function update(Request $request, $entrepriseId, Action $action)
{
    $entreprise = Entreprise::findOrFail($entrepriseId);

    $validated = $request->validate([
        'commercant_id' => 'required|exists:users,id',
        'date_rdv' => 'required|date|after:now',
        'representant' => 'required|string|max:1000',
        'email' => 'required|email|max:255',
        'localisation' => 'required|string|max:255',

        'feedback' => 'required|string|max:1000',
        'next_step' => 'required|string|max:255',
        'besoin_client' => 'required|string|max:1000',
        'commentaire_action' => 'nullable|string|max:1000',
    ]);

    $assistant = User::where('id', $request->user()->id)->where('role', 'assistant')->first();
    $commercant = User::where('id', $validated['commercant_id'])->where('role', 'commerçant')->first();

    if (!$assistant) {
        return response()->json(['message' => 'L\'assistant sélectionné n\'est pas valide.'], 422);
    }
    if (!$commercant) {
        return response()->json(['message' => 'Le commerçant sélectionné n\'est pas valide.'], 422);
    }

 $dateDebut = Carbon::parse($request->date_rdv);
    $dateFin = $dateDebut->copy()->addHours(4);

    $existe = rdv::where('commercant_id', $request->commercant_id)
        ->where(function ($query) use ($dateDebut, $dateFin) {
            $query->whereRaw('date_rdv < ?', [$dateFin])
                  ->whereRaw('DATE_ADD(date_rdv, INTERVAL 4 HOUR) > ?', [$dateDebut]);
        })
        ->exists();

    if ($existe) {
        return back()->withErrors([
            'date_rdv' => 'Ce créneau chevauche un autre RDV (durée 4h). Veuillez choisir une autre date.',
        ]);
    }


    $action->update([
        'feedback' => $validated['feedback'],
        'next_step' => $validated['next_step'],
        'besoin_client' => $validated['besoin_client'],
        'commentaire' => $validated['commentaire_action'] ?? null,
    ]);

    $action->rdv()->updateOrCreate([], [
        'assistante_id' => $request->user()->id,
        'commercant_id' => $validated['commercant_id'],
        'date_rdv' => $validated['date_rdv'],
        'representant' => $validated['representant'],
        'email' => $validated['email'],
        'localisation' => $validated['localisation'],
        'entreprise_id' => $entreprise->id,
        'action_id' => $action->id,
    ]);

    return redirect()->route('entreprises.indexActions', $entrepriseId)
        ->with('success', 'Action et RDV mis à jour avec succès !');
}

public function destroy($entrepriseId, Action $action)
{
    $entreprise = Entreprise::findOrFail($entrepriseId);

    if ($action->rdv) {
        $action->rdv->delete();
    }
    $action->delete();

    return redirect()->route('entreprises.indexActions', $entrepriseId)
        ->with('success', 'Action et RDV supprimés avec succès !');

}  }
