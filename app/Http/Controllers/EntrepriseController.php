<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    public function index()
    {
        return Inertia::render('Assistante/Index',[
                        'entreprises' => Entreprise::all()
        ]);
    }
        public function indexSimple(Entreprise $entreprise)
    {
        return Inertia::render('Assistante/IndexSimple',[
                        'entreprise' => $entreprise 
        ]);
    }
}
