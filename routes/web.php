<?php

use App\Http\Controllers\assistantController;
use App\Http\Controllers\commercantController;
use App\Http\Controllers\EntrepriseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\RoleMiddleware;


Route::get('/', function () {
    return redirect('/login');
})->name('home');
//admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
//assistant routes
Route::middleware(['auth', 'verified', 'role:assistant'])->group(function () {
    Route::get('/dashboardA', [assistantController::class, 'assistantDashboard'])->name('assistant.dashboard');
    Route::get('/entreprises', [assistantController::class, 'index'])->name('entreprises.index');
    Route::post('/users-import', [assistantController::class, 'import'])->name('users.import');
    Route::get('/entreprises/{entreprise}', [assistantController::class, 'indexSimple'])->name('entreprises.indexSimple');
    Route::get('/entreprises/{entreprise}/action', [assistantController::class, 'create'])
        ->name('entreprises.actions.create');
    Route::post('/entreprises/{entreprise}/action', [assistantController::class, 'store'])
        ->name('entreprises.actions.store');
    Route::get('/entreprises/{entreprise}/liste-actions', [assistantController::class, 'indexActions'])->name('entreprises.indexActions');
    Route::get('/entreprises/{entreprise}/actions/{action}/edit', [assistantController::class, 'edit'])
        ->name('actions.edit');

    Route::put('/entreprises/{entreprise}/actions/{action}', [assistantController::class, 'update'])
        ->name('actions.update');
    Route::delete('/entreprises/{entreprise}/actions/{action}/delete', [assistantController::class, 'destroy'])
        ->name('actions.destroy');
});
//commercant routes
Route::middleware(['auth', 'verified', 'role:commerçant'])->group(function () {
    Route::get('/dashboardC', [commercantController::class, 'commercantDashboard'])->name('commercant.dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
