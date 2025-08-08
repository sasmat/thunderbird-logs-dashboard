<?php

use App\Http\Controllers\ChannelPartnersSyncLogController;
use App\Http\Controllers\CollateralController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HubSpotWebHooksLogController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UserController;
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
    Route::resource('users', UserController::class);

    // HubSpot Webhook Logs Routes
    Route::resource('hubspot-logs', HubSpotWebHooksLogController::class)
        ->only(['index', 'show', 'destroy'])
        ->parameters(['hubspot-logs' => 'hubspotLog']);
    Route::get('hubspot-logs/export', [HubSpotWebHooksLogController::class, 'export'])
        ->name('hubspot-logs.export');

    // Channel Partners Sync Logs Routes
    Route::resource('channel-partners-sync-logs', ChannelPartnersSyncLogController::class)
        ->only(['index', 'show'])
        ->parameters(['channel-partners-sync-logs' => 'log']);

    // Contact Management Routes
    Route::resource('contacts', ContactController::class);

    // Submission Management Routes
    Route::resource('submissions', SubmissionController::class);

    // Collateral Management Routes
    Route::resource('collaterals', CollateralController::class);

    // Additional table routes can be added here as needed
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
