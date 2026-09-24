<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class TrackPageViews
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only track page views for web requests (not API calls)
        if ($request->isMethod('GET') && !$request->is('api/*')) {
            $this->trackPageView($request);
        }

        return $response;
    }

    /**
     * Track page view
     */
    private function trackPageView(Request $request)
    {
        try {
            $pageView = [
                'url' => $request->fullUrl(),
                'path' => $request->path(),
                'method' => $request->method(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
                'user_id' => auth()->id(),
                'session_id' => $request->session()->getId(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];

            // Store in cache for batch processing
            $cacheKey = 'page_views_' . date('Y-m-d');
            $pageViews = Cache::get($cacheKey, []);
            $pageViews[] = $pageView;
            
            // Keep only last 1000 page views per day to prevent memory issues
            if (count($pageViews) > 1000) {
                $pageViews = array_slice($pageViews, -1000);
            }
            
            Cache::put($cacheKey, $pageViews, Carbon::now()->endOfDay());

            // Update user's last seen timestamp if authenticated
            if (auth()->check()) {
                DB::table('users')
                    ->where('id', auth()->id())
                    ->update(['last_seen_at' => Carbon::now()]);
            }

        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::error('Page view tracking failed: ' . $e->getMessage());
        }
    }
} 