<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the ML Users IGN update command
// Run weekly on Sunday at 2:00 AM
Schedule::command('ml-users:update-ign')
    ->weekly()
    ->sundays()
    ->at('02:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->onFailure(function () {
        \Log::error('ML Users IGN update scheduled task failed');
    })
    ->onSuccess(function () {
        \Log::info('ML Users IGN update scheduled task completed successfully');
    });

Schedule::command('promotions:revert-expired')
    ->daily()
    ->at('00:00')
    ->withoutOverlapping()
    ->runInBackground();

Schedule::command('users:deactivate-expired-renewals')
    ->daily()
    ->at('01:00')
    ->withoutOverlapping()
    ->runInBackground();

Schedule::command('users:delete-expired-proofs')
    ->daily()
    ->at('03:00')
    ->withoutOverlapping()
    ->runInBackground();

// Automatically lock registration and fuse rosters for expired Campus Tournaments
// Run daily at midnight
Schedule::command('teams:lock-expired-tournaments')
    ->daily()
    ->at('00:00')
    ->withoutOverlapping()
    ->runInBackground();
