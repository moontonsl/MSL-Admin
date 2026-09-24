<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Removed explicit binding for 'admin' guard to avoid potential conflicts.
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}