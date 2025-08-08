<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes
    Route::resource('users', \App\Http\Controllers\UserController::class);

    // HubSpot Webhook Logs Routes
    Route::resource('hubspot-logs', \App\Http\Controllers\HubSpotWebHooksLogController::class)
        ->only(['index', 'show', 'destroy'])
        ->parameters(['hubspot-logs' => 'hubspotLog']);
    Route::get('hubspot-logs/export', [\App\Http\Controllers\HubSpotWebHooksLogController::class, 'export'])
        ->name('hubspot-logs.export');

    // Contact Management Routes
    Route::resource('contacts', \App\Http\Controllers\ContactController::class);

    // Submission Management Routes
    Route::resource('submissions', \App\Http\Controllers\SubmissionController::class);

    // Additional table routes can be added here as needed
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
