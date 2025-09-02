<?php

namespace App\Http\Controllers;

use App\Imports\UsersImport;
use App\Models\Action;
use App\Models\Attcom;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class assistantController extends Controller
{

    // Dashboard
    public function assistantDashboard()
    {
        $stats = $this->getStats();
        $commercants = $this->getCommercantsWithCpmpletedRdvs();
        $latestNotif = DB::table('activity_log')->get(['description'])->take(3);
        $leastUpcomingRdvs = $this->getCommercantsWithLeastUpcomingRdvs();
        $chartData = $this->getDatachart();


        return Inertia::render('Assistante/dashboardA', [
            'stats' => $stats,
            'commercants' => $commercants,
            'latestNotif' => $latestNotif,
            'leastUpcomingRdvs' => $leastUpcomingRdvs,
            'chartData' => $chartData,

        ]);
    }


    public function getDatachart()
    {
        return [
            'totalCompletedRdvs' => $this->getCompletedrdvsCount(),
            'totalScheduledRdvs' => $this->getScheduledrdvsCount(),
            'totalanceledRdvs' => $this->getCanceledrdvsCount(),
            'performanceData' => $this->getPerfomData(),
            'historicalData' => $this->getHistoricalData(),
        ];
    }

    public function getCompletedrdvsCount()
    {
        return Rdv::where('status', 'completed')->whereMonth('created_at', now()->month)->count();
    }
    public function getScheduledrdvsCount()
    {
        return Rdv::where('status', 'scheduled')->where('date_rdv', '>=', now()->month)->count();
    }
    public function getCanceledrdvsCount()
    {
        return Rdv::where('status', 'cancelled')->whereMonth('created_at', now()->month)->count();
    }

    public function getPerfomData()
    {
        $current_month = Rdv::where('status', 'completed')->whereMonth('created_at', now()->month)->count();
        $last_month = Rdv::where('status', 'completed')->whereMonth('created_at', now()->subMonth()->month)->count();

        $grouthMonth = $last_month > 0 ? round((($current_month - $last_month) / $last_month) * 100) : 0;

        $totalRdvs = Rdv::whereMonth('created_at', now()->month)->count();
        $successRate = $totalRdvs > 0
            ? round(($current_month / $totalRdvs) * 100)
            : 0;

        return [
            'growthPercentage' => $grouthMonth,
            'successRate' => $successRate,
        ];
    }
    private function getHistoricalData()
    {
        $data = [];

        // Récupérer les données des 30 derniers jours
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);

            $data[] = [
                'date' => $date->format('Y-m-d'),
                'completed' => Rdv::where('status', 'completed')
                    ->whereDate('updated_at', $date)
                    ->count(),
                'scheduled' => Rdv::where('status', 'scheduled')
                    ->whereDate('created_at', $date)
                    ->count(),
                'cancelled' => Rdv::where('status', 'cancelled')
                    ->whereDate('updated_at', $date)
                    ->count(),
            ];
        }

        return $data;
    }


    // Fonction pour dashboard
    private function getCommercantsWithLeastUpcomingRdvs()
    {
        return User::where('role', 'commerçant')
            ->withCount('upcomingRdvs')
            ->orderBy('upcoming_rdvs_count', 'asc')
            ->take(1)
            ->get()
            ->map(function ($commercant) {
                return [
                    'id' => $commercant->id,
                    'name' => $commercant->name,
                    'email' => $commercant->email,
                    'upcomingRdvs' => $commercant->upcoming_rdvs_count,
                ];
            });
    }
    // Fonction pour dashboard
    public function getStats()
    {
        $totalEnterprises = Entreprise::count();

        // RDV planifiés cette semaine
        $rdvsThisWeek = Rdv::whereBetween('date_rdv', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();

        $totalCommercants = User::where('role', 'commerçant')->count();


        return [
            [
                'totalEnterprises' => $totalEnterprises,
                'rdvsThisWeek' => $rdvsThisWeek,
                'totalCommercants' => $totalCommercants,

            ],
        ];
    }
    // Fonction pour dashboard
    private function getCommercantsWithCpmpletedRdvs()
    {
        return User::where('role', 'commerçant')
            ->orderBy('rdvs_count', 'asc')
            ->take(4)
            ->get()
            ->map(function ($commercant) {
                return [
                    'id' => $commercant->id,
                    'name' => $commercant->name,
                    'email' => $commercant->email,
                    'completedRdvs' => $commercant->rdvs_count,
                ];
            });
    }

    // View pour tous les entreprises
    public function index(Request $request)
    {   
        $user = Auth::user(); 
        $filters = array_filter($request->input('filters', []));
        $query = Entreprise::with('attcom');

        if ($user->role === 'assistant') {
        $query->where('assistante_id', $user->id);
        }

        if (!empty($filters)) {
            $query->whereHas('attcom', function ($q) use ($filters) {
                foreach ($filters as $column => $value) {
                    if ($value) {
                        $q->where($column, true);
                    }
                }
            });
        }

        $entreprises = $query->paginate(200)->withQueryString();

        return Inertia::render('Assistante/Index', [
            'entreprises' => $entreprises,
            'filters' => $filters,
        ]);
    }



    // View pour details de chaque entreprise
    public function indexSimple(Entreprise $entreprise)
    {   
            $user = Auth::user();

        if ($user->role === 'assistant' && $entreprise->assistante_id !== $user->id) {
        abort(403, 'Unauthorized access.');
         }
        $hasRdv = $entreprise->rdvs()->exists();
        $hasAction = $entreprise->actions()->exists();

        return Inertia::render('Assistante/IndexSimple', [
            'entreprise' => array_merge(
                $entreprise->toArray(),
                ['hasRdv' => $hasRdv],
                ['hasAction' => $hasAction]
            )
        ]);
    }
    // View pour les listes des actions et rdvs de chaque entreprise
    public function indexActions(Entreprise $entreprise)
    {
            $user = Auth::user();

    // 🔒 Security check
    if ($user->role === 'assistant' && $entreprise->assistante_id !== $user->id) {
        abort(403, 'Unauthorized access.');
    }
        return Inertia::render('Assistante/ListeAction', [
            'entreprise' => $entreprise->only(['id', 'denomination']),
            'actions' => $entreprise->actions()->with('rdv.commercant')->get(),
            'rdvs' => $entreprise->rdvs()->get(),
        ]);
    }

    // View pour updater Rdv et Action
    public function edit($entrepriseId, Action $action)
    {
            $user = Auth::user();

        $entreprise = Entreprise::findOrFail($entrepriseId);
          if ($user->role === 'assistant' && $entreprise->assistante_id !== $user->id) {
        abort(403, 'Unauthorized access.');
    }

        $rdv = $action->rdv;
        $commercants = User::where('role', 'commerçant')->get(['id', 'name']);

        return Inertia::render('Assistante/EditAction', [
            'entreprise' => $entreprise->only(['id', 'denomination']),
            'action' => $action->only(['id', 'feedback', 'next_step', 'besoin_client', 'commentaire']),
            'rdv' => $rdv ? $rdv->only(['date_rdv', 'representant','fonction', 'email','details','telephone', 'localisation', 'commercant_id']) : [],
            'commercants' => $commercants,
        ]);
    }

    //View pour creation de Rdv et Action
    public function create($entrepriseId)
    {
            $user = Auth::user();

        $entreprise = Entreprise::findOrFail($entrepriseId);
            if ($user->role === 'assistant' && $entreprise->assistante_id !== $user->id) {
        abort(403, 'Unauthorized access.');
    }


        $rdvsPris = Rdv::whereHas('commercant', function ($query) {
            $query->where('role', 'commerçant');
        })
            ->select('commercant_id', 'date_rdv')->where('status', 'scheduled')
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

    //Logic pour inserer Action et Rdv 
  public function store(Request $request, $entrepriseId) 
{
    $entreprise = Entreprise::findOrFail($entrepriseId);

    $validated = $request->validate([
        'commercant_id' => 'required|exists:users,id',
        'date_rdv' => 'required|date|after:now',
        'representant' => 'required|string|max:1000',
        'email' => 'required|email|max:255',
        'fonction' => 'nullable|string|max:100',
        'details'=>'nullable|string|max:1000',
        'telephone' => 'nullable|string|max:20',
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

    $dateDebut = Carbon::parse($request->input('date_rdv'));
    $dateFin = $dateDebut->copy()->addHours(4);

    $existe = Rdv::where('commercant_id', $request->input('commercant_id'))
        ->whereIn('status', ['scheduled'])
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
        // Créer l’action
        $action = Action::create([
            'assistante_id' => $request->user()->id,
            'feedback' => $validated['feedback'],
            'next_step' => $validated['next_step'],
            'besoin_client' => $validated['besoin_client'],
            'commentaire' => $validated['commentaire_action'] ?? null,
            'entreprise_id' => $validated['entreprise_id'],
        ]);

        // Créer le RDV
        $rdv = Rdv::create([
            'assistante_id' => $request->user()->id,
            'commercant_id' => $validated['commercant_id'],
            'date_rdv' => $validated['date_rdv'],
            'representant' => $validated['representant'],
            'email' => $validated['email'],
            'fonction' => $validated['fonction'],
            'details'=>$validated['details'],
            'telephone' => $validated['telephone'],
            'localisation' => $validated['localisation'],
            'entreprise_id' => $validated['entreprise_id'],
            'action_id' => $action->id,
        ]);

        $docFields = ['loi', 'dossier_technique', 'leve_fond', 'iso', 'test', 'test_'];
        $attcom = $entreprise->attcom; 

        if ($attcom) {
            // Mettre à jour les documents
            foreach ($docFields as $f) {
                if ($request->has($f)) {
                    $attcom->{$f} = $request->boolean($f);
                }
            }
            $attcom->save();
        
        if ($rdv->status === 'scheduled') {
    $rdv->status = 'completed';
    $rdv->save();
}}

        DB::commit();
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Erreur dans la transaction', ['exception' => $e->getMessage()]);
        return back()->withErrors([
            'general' => 'Erreur lors de la création du RDV et de l\'Action.'
        ]);
    }

    // Logs d’activité
    activity('rdv')
        ->causedBy(Auth::user())
        ->performedOn($rdv)
        ->withProperties([
            'entreprise' => $entreprise->denomination,
            'assistante' => $assistant->name,
        ])
        ->log("RDV créé par {$assistant->name} pour l’entreprise {$entreprise->denomination}");

    if ($commercant) {
        activity('rdv')
            ->causedBy(Auth::user())
            ->performedOn($rdv)
            ->withProperties([
                'entreprise' => $entreprise->denomination,
                'commercant' => $commercant->name,
            ])
            ->log("RDV avec {$entreprise->denomination} assigné à {$commercant->name}");
    }

    return back()->with('success', true);
}


    // Update Action et Rdv
    public function update(Request $request, $entrepriseId, Action $action)
    {
        $entreprise = Entreprise::findOrFail($entrepriseId);

        $validated = $request->validate([
            'commercant_id' => 'required|exists:users,id',
            'date_rdv' => 'required|date|after:now',
            'representant' => 'required|string|max:1000',
            'email' => 'required|email|max:255',
                   'fonction' => 'nullable|string|max:100',
                'details'=>'nullable|string|max:1000',
        'telephone' => 'nullable|string|max:20',
            
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

        $dateDebut = Carbon::parse($request->input('date_rdv'));
        $dateFin = $dateDebut->copy()->addHours(4);

        $rdv = $action->rdv; // Récupère le RDV actuel lié à l'action


        $existe = rdv::where('commercant_id', $request->input('commercant_id'))
            ->where('id', '!=', optional($rdv)->id) // exclure le RDV actuel
            ->where('status', '!=', 'cancelled') // ignorer les RDVs annulés
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
                 'fonction' => $validated['fonction'],
            'details'=>$validated['details'],
            'telephone' => $validated['telephone'],
            'localisation' => $validated['localisation'],
            'entreprise_id' => $entreprise->id,
            'action_id' => $action->id,
        ]);

        return redirect()->route('entreprises.indexActions', $entrepriseId)
            ->with('success', 'Action et RDV mis à jour avec succès !');
    }
    // Delete Action et Rdv
    public function destroy($entrepriseId, Action $action)
    {

        if ($action->rdv) {
            $action->rdv->delete();
        }
        $action->delete();

        return redirect()->route('entreprises.indexSimple', $entrepriseId)
            ->with('success', 'Action et RDV supprimés avec succès !');
    }
}
