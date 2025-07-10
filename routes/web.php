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

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth', 'verified','role:assistant'])->group(function () {
    Route::get('/dashboardA', [assistantController::class,'assistantDashboard'])->name('assistant.dashboard');
    Route::get('/entreprises', [EntrepriseController::class, 'index'])->name('entreprises.index');
    Route::get('/entreprises/{entreprise}', [EntrepriseController::class, 'indexSimple'])->name('entreprises.indexSimple');

});
Route::middleware(['auth', 'verified','role:commerçant'])->group(function () {
    Route::get('/dashboardC', [commercantController::class,'commercantDashboard'])->name('commercant.dashboard');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
