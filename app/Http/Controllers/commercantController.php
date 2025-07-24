<?php

namespace App\Http\Controllers;

use App\Mail\QualifiedMail;
use App\Models\Attcom;
use App\Models\Entreprise;
use App\Models\Rdv;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class commercantController extends Controller
{
    public function commercantDashboard()
    {
        return Inertia::render('Commercant/dashboardC');
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
            'end' => \Carbon\Carbon::parse($rdv->date_rdv)->addHours(4),
            'localisation' => $rdv->localisation,
            'idRdv' => $rdv->id,
            'idEntreprise' => $rdv->entreprise_id,
            'representer_par' => $rdv->representant,
            'email' => $rdv->email,
            'telephone' => $rdv->entreprise->tel ?? null,
            'leve_fond' => $rdv->action->leve_fond ?? null,
            'commentaire' => $rdv->action->commentaire ?? null,
            'hasAttcom' => $rdv->entreprise->attcom->isNotEmpty(),
            'idAttcom' => $attcom?->id,

        ];
    });


        return Inertia::render('Commercant/Calendrier', [
            'rdvs' => $rdvs,
        ]);
    }

    public function qualifier()
    {
        return Inertia::render('Commercant/Qualifier');
    }
    public function qualified($rdvId)
    {
        $rdv = Rdv::findOrFail($rdvId);
        $id =    $rdv->id;
        // dd($id);

        $email = $rdv->email;
        // dd($email);

        // $rdv->update(['isqualified' => true]);
        $denomination = $rdv->entreprise->denomination;
        //  dd($denomination);

        Mail::to($email)->send(new QualifiedMail($denomination));

        return redirect()->route('commercant.calendar')->with('success', 'Email envoyer.');
    }
    public function notqualified()
    {
        return Inertia::render('Commercant/Qualified');
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
                'loi'=>'required|boolean' ,
                'dossier_technique'=>'required|boolean' ,
                'leve_fond'=>'required|boolean' ,
                'iso'=>'required|boolean' ,
                'test'=>'required|boolean' ,
                'test_'=>'required|boolean' ,
            ]
        );
             Attcom::create([
            'rdv_id' => $rdvid,
            'loi' => $validated['loi'],
            'dossier_technique' => $validated['dossier_technique'],
            'leve_fond' => $validated['leve_fond'],
            'iso' => $validated['iso'] ,
            'test' => $validated['test'] ,
            'test_' => $validated['test_'] ,
            'entreprise_id' => $entrepriseid,
        ]);
            return redirect()->route('commercant.calendar')->with('success', 'Finaliser avec succes!');

    }

    public function updatepage($attId){
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

    return redirect()->route('commercant.calendar')->with('success', 'Mis à jour avec succès !');
}

}
