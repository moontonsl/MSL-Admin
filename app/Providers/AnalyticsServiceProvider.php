<?php

namespace App\Providers;

use App\Services\AnalyticsService;
use App\Services\GoogleAnalyticsService;
use App\Services\GA4AnalyticsService;
use Illuminate\Support\ServiceProvider;

class AnalyticsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(GoogleAnalyticsService::class, function ($app) {
            return new GoogleAnalyticsService();
        });

        $this->app->singleton(GA4AnalyticsService::class, function ($app) {
            return new GA4AnalyticsService();
        });

        $this->app->singleton(AnalyticsService::class, function ($app) {
            $googleAnalytics = $app->make(GoogleAnalyticsService::class);
            $ga4Analytics = $app->make(GA4AnalyticsService::class);
            return new AnalyticsService($googleAnalytics, $ga4Analytics);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
