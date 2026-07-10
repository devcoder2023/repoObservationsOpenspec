<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\ObservationCategoryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('users', UserController::class);

Route::resource('projects', ProjectController::class);
Route::patch('projects/{project}/restore', [ProjectController::class, 'restore'])->name('projects.restore');

Route::resource('locations', LocationController::class);
Route::patch('locations/{location}/restore', [LocationController::class, 'restore'])->name('locations.restore');

Route::resource('categories', ObservationCategoryController::class);
Route::patch('categories/{category}/restore', [ObservationCategoryController::class, 'restore'])->name('categories.restore');
