<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ObservationCategoryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SiteController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('users', UserController::class);

Route::resource('projects', ProjectController::class);
Route::patch('projects/{project}/restore', [ProjectController::class, 'restore'])->name('projects.restore');

Route::resource('sites', SiteController::class);
Route::patch('sites/{site}/restore', [SiteController::class, 'restore'])->name('sites.restore');

Route::resource('categories', ObservationCategoryController::class);
Route::patch('categories/{category}/restore', [ObservationCategoryController::class, 'restore'])->name('categories.restore');
