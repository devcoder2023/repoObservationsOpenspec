<?php

use App\Http\Controllers\AnalystController;
use Illuminate\Support\Facades\Route;

Route::get('/trends', [AnalystController::class, 'trends'])->name('trends');
Route::get('/current-month', [AnalystController::class, 'currentMonth'])->name('current-month');
Route::get('/observations', [AnalystController::class, 'index'])->name('observations');
