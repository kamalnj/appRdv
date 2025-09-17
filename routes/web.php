<?php

use App\Http\Controllers\adminController;
use App\Http\Controllers\assistantController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\commercantController;
use App\Http\Controllers\consultantController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect('/login');
})->name('home');
//admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/dashboard', [adminController::class, 'adminDashboard'])->name('dashboard');
      Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::get('/entreprise', [adminController::class, 'index'])->name('entreprise.index');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::delete('/user/{userId}',[adminController::class , 'destroy'])->name('user.destroy');
    Route::post('/users-import', [adminController::class, 'import'])->name('users.import');
    Route::get('/entreprise/{entreprise}/edit', [adminController::class, 'updatepage'])->name('admin.edit');
    Route::put('/entreprise/{entreprise}', [adminController::class, 'update'])->name('admin.update');
    Route::delete('/entreprise/{entreprise}/delete', [adminController::class, 'delete'])->name('admin.destroy');
    Route::get('/entreprise/{entreprise}/show', [adminController::class, 'show'])->name('index');
;
});
//consulant routes
Route::middleware(['auth', 'verified', 'role:consultant'])->group(function () {
    Route::get('/listeEntreprises', [consultantController::class, 'index'])->name('Listesentreprises.index');
    Route::get('/details/{entreprise}', [consultantController::class, 'details'])->name('Listesentreprises.details');
Route::get('/export/entreprise/{entreprise}/{type}', [consultantController::class, 'exportEntrepriseData'])
    ->name('export.entreprise.data');
    Route::get('/export/listeEntreprise', [consultantController::class, 'exportListeEntreprise'])
    ->name('export.listeentreprise.data');
    


});
//assistant routes
Route::middleware(['auth', 'verified', 'role:assistant'])->group(function () {
    Route::get('/dashboardA', [assistantController::class, 'assistantDashboard'])->name('assistant.dashboard');
    Route::get('/entreprises', [assistantController::class, 'index'])->name('entreprises.index');
    Route::get('/recontact', [assistantController::class, 'entreprises_recontact'])->name('entreprises.recontact');
    Route::get('/entreprises/{entreprise}', [assistantController::class, 'indexSimple'])->name('entreprises.indexSimple');
    Route::get('/entreprises/{entreprise}/action', [assistantController::class, 'create'])
        ->name('entreprises.actions.create');
    Route::post('/entreprises/{entreprise}/action', [assistantController::class, 'store'])
        ->name('entreprises.actions.store');
            Route::post('/entreprises/{entreprise}/action-only', [assistantController::class, 'store_actiononly'])
        ->name('entreprises.actionsonly.store');
    Route::get('/entreprises/{entreprise}/liste-actions', [assistantController::class, 'indexActions'])->name('entreprises.indexActions');
    Route::get('/entreprises/{entreprise}/actions/{action}/edit', [assistantController::class, 'edit'])
        ->name('actions.edit');
    Route::put('/entreprises/{entreprise}/actions/{action}', [assistantController::class, 'update'])
        ->name('actions.update');
    Route::delete('/entreprises/{entreprise}/actions/{action}/delete', [assistantController::class, 'destroy'])
        ->name('actions.destroy');
    Route::get('/rdvs', [assistantController::class, 'getrdvs'])->name('rdvs.index');


});
//commercant routes
Route::middleware(['auth', 'verified', 'role:commerçant'])->group(function () {
    Route::get('/dashboardC', [commercantController::class, 'commercantDashboard'])->name('commercant.dashboard');
    Route::get('/calendrier', [commercantController::class, 'calendar'])->name('commercant.calendar');
    Route::get('/noqualifier/{rdvId}', [commercantController::class, 'notqualified'])->name('commercant.notqualified');
    Route::get('/qualifier1/{rdvId}', [commercantController::class, 'qualified'])->name('commercant.qualified');
    Route::get('/final/{rdvId}', [commercantController::class, 'indexfinaliser'])->name('commercant.final');
    Route::post('/final/{rdvId}/{entrepriseId}', [commercantController::class, 'store'])->name('commercant.final.store');
    Route::get('/attcom1/edit/{attId}', [commercantController::class, 'updatepage'])->name('commercant.final.updateindex');
    Route::put('/attcom/edit/{attId}', [commercantController::class, 'update'])->name('commercant.final.update');


    
});


    

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
