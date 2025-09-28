<?php

namespace App\Http\Controllers;

use App\Exports\ActionsExport;
use App\Exports\EntreprisesExport;
use App\Exports\RdvsExport;
use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
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

        // Build optimized query with single DB call
        $query = Action::selectRaw('feedback, COUNT(*) as count')
                      ->whereNotNull('feedback')
                      ->where('feedback', '!=', '');

        if ($request->filled('assistante_id')) {
            $query->where('assistante_id', $request->assistante_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $feedbackData = $query->groupBy('feedback')
                             ->orderByDesc('count')
                             ->get()
                             ->map(function ($item) {
                                 return [
                                     'feedback' => $item->feedback,
                                     'count' => $item->count
                                 ];
                             });

        $assistantes = User::select('id', 'name')->where('role', 'assistant')->get();

        return Inertia::render('Consultant/Feedbacks', [
            'feedbackData' => $feedbackData,
            'assistantes' => $assistantes,
            'filters' => [
                'assistante_id' => $request->assistante_id ? (int) $request->assistante_id : null,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ]
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
