<?php

use App\Http\Controllers\ObservationController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [ObservationController::class, 'dashboard'])->name('dashboard');
Route::get('/sites-by-project', [ObservationController::class, 'sitesByProject'])->name('sites-by-project');

Route::resource('/', ObservationController::class)->parameters([
    '' => 'observation',
])->names([
    'index' => 'index',
    'create' => 'create',
    'store' => 'store',
    'show' => 'show',
    'edit' => 'edit',
    'update' => 'update',
    'destroy' => 'destroy',
]);
