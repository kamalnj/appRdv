<?php

namespace App\Http\Controllers;

use App\Imports\UsersImport;
use App\Models\Action;
use App\Models\Entreprise;
use App\Models\Rdv;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;


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
            ->pluck('last_activity', 'user_id');

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
                'rdvs' => $rdvs,
                'actions' => $actions,
                'activeAssistants' => $assistants,
                'activeCommercants' => $commercants,
            ],
            'users' => $users,
        ]);
    }

    public function destroy($userId)
    {
        try {
            $user = User::findOrFail($userId);
            $user->delete();

            return redirect()->back()->with('success', 'User deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error deleting user: ' . $e->getMessage());
        }
    }
    public function index()
    {
        $entreprises = Entreprise::paginate(200);
        return Inertia::render('Entreprise', [
            'entreprises' => $entreprises,
        ]);
    }
    public function updatepage($id)
    {
        $entreprise = Entreprise::findOrFail($id);
        return Inertia::render('EntrepriseUpdate', [
            'entreprise' => $entreprise,
        ]);
    }
    public function update($id, Request $request){

        $entreprise = Entreprise::findOrFail($id);
        $data = $request->validate([
            'denomination' => 'required|string|max:255',
            'rc' => 'required|string|max:255',
            'tribunal' => 'nullable|string|max:255',
            'capital_social' => 'nullable|numeric',
            'object_social' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'ice' => 'nullable|string|max:255',
            'bilan_date' => 'nullable|numeric',
            'chiffre_affaire' => 'nullable|numeric',
            'tel' => 'nullable|array',
            'diregeants' => 'nullable|array',
        ]);
        
        $entreprise->update($data);
        return redirect()->back()->with('success', 'Entreprise updated successfully');

    }
    public function show($id){
        $entreprise = Entreprise::findOrFail($id);
        return Inertia::render('Details', [
            'entreprise' => $entreprise,
        ]);
    }

    public function delete($id){
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->delete();
        return redirect()->back()->with('success', 'Entreprise deleted successfully');
    }

    // Logic pour Import CSV
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,xls|max:2048',
        ]);

        try {
            Excel::import(new UsersImport, $request->file('file'));
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw ValidationException::withMessages([
                'file' => [$e->getMessage() ?: 'Erreur inconnue lors de l\'importation.']
            ]);
        }

        return back()->with('success', true);
    }
}
