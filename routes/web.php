<?php

use App\Http\Controllers\EntrepriseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login'); 
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
Route::get('/entreprises', [EntrepriseController::class, 'index'])->name('entreprises.index');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
