<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class adminController extends Controller
{
   public function adminDashboard()
{
    // $totalusers = User::count();
    $rdvs = Rdv::count();
    $actions = Action::count();
    $assistants = User::where('role', 'assistant')->count();
    $commercants = User::where('role', 'commercant')->count();

    // Get last activity per user
    $lastActivities = DB::table('sessions')
        ->select('user_id', DB::raw('MAX(last_activity) as last_activity'))
        ->whereNotNull('user_id')
        ->groupBy('user_id')
        ->pluck('last_activity', 'user_id'); // returns [user_id => last_activity]

    // Now load all users and append last activity
    $users = User::where('role', '!=', 'admin')->get()->map(function ($user) use ($lastActivities) {
        $timestamp = $lastActivities[$user->id] ?? null;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'lastActive' => $timestamp
                ? [
                    'lastSeen' => Carbon::createFromTimestamp($timestamp)->diffForHumans(),
                    'lastActivity' => Carbon::createFromTimestamp($timestamp)->toDateTimeString(),
                ]
                : null,
        ];
    });

    return Inertia::render('dashboard', [
        'stats' => [
            // 'totalUsers' => $totalusers,
            'rdvs' => $rdvs,
            'actions' => $actions,
            'activeAssistants' => $assistants,
            'activeCommercants' => $commercants,
        ],
        'users' => $users,
    ]);
}

}
