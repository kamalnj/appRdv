<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class adminController extends Controller
{
    public function adminDashboard()
    {    $users=User::all();
        $totalusers = User::all()->count();
        $rdvs = Rdv::all()->count();
        $actions = Action::all()->count();
        $assistants = User::where('role', 'assistant')->count();
        $commercants = User::where('role', 'commercant')->count();
        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => $totalusers,
                'rdvs' => $rdvs,
                'actions' => $actions,
                'activeAssistants' => $assistants,
                'activeCommercants' => $commercants,
            ],
            'users' => $users,
          
        ]);

    }
}
