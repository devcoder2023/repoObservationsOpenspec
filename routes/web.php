<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'user.status'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'user.status', 'role:System Administrator'])->prefix('admin')->name('admin.')->group(function () {
    require __DIR__.'/admin.php';
});

Route::middleware(['auth', 'verified', 'user.status', 'permission:observations.view'])->prefix('observations')->name('observations.')->group(function () {
    require __DIR__.'/observations.php';
});

Route::middleware(['auth', 'verified', 'user.status', 'permission:observations.view_all'])->prefix('analyst')->name('analyst.')->group(function () {
    require __DIR__.'/analyst.php';
});

require __DIR__.'/settings.php';
