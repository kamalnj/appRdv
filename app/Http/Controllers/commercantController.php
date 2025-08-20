<?php

namespace App\Http\Controllers;

use App\Mail\QualifiedMail;
use App\Models\Attcom;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class commercantController extends Controller
{
    public function commercantDashboard()
    {
        $getStats = $this->getStats();
        $getRdvs = $this->getRdvs();
        return Inertia::render('Commercant/dashboardC', [
            'CommercantStats' => $getStats,
            'RdvAppointment' => $getRdvs,

        ]);
    }
    public function getStats()
    {
        $guard = Auth::guard('web');
        $user = $guard->user();

        $todayRdvs = Rdv::where('commercant_id', $user->id)
            ->whereDate('date_rdv', Carbon::today())
            ->count();
        // RDV planifiés cette semaine
        $rdvsThisWeek = Rdv::where('commercant_id', $user->id)->where('status', '=', 'scheduled')

            ->whereBetween('date_rdv', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->count();



        $completed = Rdv::where('commercant_id', $user->id)
            ->where('status', 'completed')
            ->whereBetween('date_rdv', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth()
            ])
            ->count();
        $Total = Rdv::where('commercant_id', $user->id)
            ->whereBetween('date_rdv', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth()
            ])
            ->count();
        $totalQualified = Rdv::where('commercant_id', $user->id)
            ->where('isqualified', true)
            ->whereBetween('date_rdv', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth()
            ])
            ->count();
        $totalrdvs = Rdv::where('commercant_id', $user->id)
            ->whereBetween('date_rdv', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth()    
            ])
            ->count();


        $completionRate = $Total > 0 ? round(($completed / $Total) * 100) : 0;

        return [
            [
                'todayRdvs' => $todayRdvs,
                'rdvsThisWeek' => $rdvsThisWeek,
                'completed' => $completed,
                'completionRate' => $completionRate,
                'totalQualified' => $totalQualified,
                'totalrdvs' => $totalrdvs,

            ],
        ];
    }
    public function getRdvs()
    {
        $guard = Auth::guard('web');
        $user = $guard->user();

        return Rdv::with(['entreprise.attcom', 'action'])
            ->where('commercant_id', $user->id)
            ->get()
            ->map(function ($rdv) {
                return [
                    'id' => $rdv->id,
                    'entreprise' => [
                        'denomination' => $rdv->entreprise->denomination ?? '',
                        'adresse' => $rdv->entreprise->adresse ?? '',
                    ],
                    'date_rdv' => $rdv->date_rdv,
                    'start' => $rdv->date_rdv,
                    'end' => Carbon::parse($rdv->date_rdv)->addHours(4),
                    'duration' => Carbon::parse($rdv->date_rdv)
                        ->diffInMinutes(Carbon::parse($rdv->date_rdv)->addHours(4)),
                    'localisation' => $rdv->localisation,
                    'idRdv' => $rdv->id,
                    'status' => $rdv->status,
                    'representer_par' => $rdv->representant,
                    'email' => $rdv->email,
                    'telephone' => $rdv->entreprise->tel ?? null,
                    'feedback' => $rdv->action->feedback ?? null,
                    'next_step' => $rdv->action->next_step ?? null,
                    'besoin_client' => $rdv->action->besoin_client ?? null,
                    'commentaire' => $rdv->action->commentaire ?? null,
                ];
            });
    }





    public function calendar()
    {

        $guard = Auth::guard('web');
        $user = $guard->user();


        $rdvs = Rdv::with(['entreprise.attcom', 'action'])
            ->where('commercant_id', $user->id)
            ->get()
            ->map(function ($rdv) {
                $attcom = $rdv->entreprise->attcom->first();

                return [
                    'title' => 'RDV avec ' . ($rdv->entreprise->denomination ?? ''),
                    'start' => $rdv->date_rdv,
                    'end' => Carbon::parse($rdv->date_rdv)->addHours(4),
                    'localisation' => $rdv->localisation,
                    'idRdv' => $rdv->id,
                    'isqualified'=> $rdv->isqualified,
                    'idEntreprise' => $rdv->entreprise_id,
                    'representer_par' => $rdv->representant,
                    'email' => $rdv->email,
                    'fonction' => $rdv->fonction,
                    'telephoneR'=> $rdv->telephone,
                    'telephone' => $rdv->entreprise->tel ?? null,
                    'commentaire' => $rdv->action->commentaire ?? null,
                    'besoin_client' => $rdv->action->besoin_client ?? null,
                    'feedback' => $rdv->action->feedback ?? null,
                    'next_step' => $rdv->action->next_step ?? null,
                    'hasAttcom' => $rdv->entreprise->attcom->isNotEmpty(),
                    'idAttcom' => $attcom?->id,

                ];
            });


        return Inertia::render('Commercant/Calendrier', [
            'rdvs' => $rdvs,
        ]);
    }


    public function qualified($rdvId)
    {
        $rdv = Rdv::findOrFail($rdvId);
        $rdv->where('id', $rdv->id)->update(['isqualified' => true]);
        $email = $rdv->email;
        $denomination = $rdv->entreprise->denomination;

        Mail::to($email)->send(new QualifiedMail($denomination));

        return redirect()->route('commercant.calendar')->with('success', 'Email envoyer.');
    }
    public function notqualified($rdvId)
    {
        $rdv = Rdv::findOrFail($rdvId);
        $rdv->where('id', $rdv->id)->update(['status' => 'cancelled']);
        $rdv->where('id', $rdv->id)->update(['isqualified' => false]);
    }

    public function indexfinaliser($rdvId)
    {
        $rdvs = Rdv::findOrFail($rdvId);
        $entreprise = $rdvs->entreprise;
        return Inertia::render('Commercant/Final', [
            'rdvs' => $rdvs,
            'entreprise' => $entreprise
        ]);
    }

    public function store($rdvid, $entrepriseid, Request $request)
    {


        $validated = $request->validate(
            [
                'loi' => 'required|boolean',
                'dossier_technique' => 'required|boolean',
                'leve_fond' => 'required|boolean',
                'iso' => 'required|boolean',
                'test' => 'required|boolean',
                'test_' => 'required|boolean',
            ]
        );
        Attcom::create([
            'rdv_id' => $rdvid,
            'loi' => $validated['loi'],
            'dossier_technique' => $validated['dossier_technique'],
            'leve_fond' => $validated['leve_fond'],
            'iso' => $validated['iso'],
            'test' => $validated['test'],
            'test_' => $validated['test_'],
            'entreprise_id' => $entrepriseid,
        ]);
        User::where('id', Auth::id())
            ->where('role', 'commercant')
            ->update(['rdvs_count' => DB::raw('rdvs_count + 1')]);

        $rdv = Rdv::findOrFail($rdvid);
        $rdv->where('id', $rdv->id)->update(['status' => 'completed']);



        return redirect()->route('commercant.calendar')->with('success', 'Finaliser avec succes!');
    }

    public function updatepage($attId)
    {
        $att = AttCom::findOrFail($attId);
        return Inertia::render('Commercant/EditAtt', [
            'attData' => $att,
        ]);
    }
    public function update(Request $request, $id)
    {
        // Valide les données
        $validated = $request->validate([
            'loi' => 'required|boolean',
            'dossier_technique' => 'required|boolean',
            'leve_fond' => 'required|boolean',
            'iso' => 'required|boolean',
            'test' => 'required|boolean',
            'test_' => 'required|boolean',
        ]);

        $attcom = Attcom::findOrFail($id);

        $attcom->update($validated);

         return back()->with('success', true);
    }
}
