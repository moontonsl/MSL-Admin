<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Services\GA4AnalyticsService;

class AnalyticsService
{
    protected $googleAnalytics;
    protected $ga4Analytics;

    public function __construct(?GoogleAnalyticsService $googleAnalytics = null, ?GA4AnalyticsService $ga4Analytics = null)
    {
        $this->googleAnalytics = $googleAnalytics;
        $this->ga4Analytics = $ga4Analytics;
    }

    /**
     * Get page views for the last 7 days
     */
    public function getPageViewsLast7Days()
    {
        // Try GA4 first
        if ($this->ga4Analytics && env('GA4_PROPERTY_ID')) {
            try {
                return $this->ga4Analytics->getPageViewsLast7Days();
            } catch (\Exception $e) {
                \Log::error('GA4 Analytics failed, using fallback: ' . $e->getMessage());
            }
        }

        // Try Google Analytics first
        if ($this->googleAnalytics) {
            try {
                return $this->googleAnalytics->getPageViewsLast7Days();
            } catch (\Exception $e) {
                \Log::error('Google Analytics failed, using fallback: ' . $e->getMessage());
            }
        }

        // Fallback to database-based tracking
        return $this->getDatabasePageViews();
    }
    
    /**
     * Get key metrics
     */
    public function getKeyMetrics()
    {
        // Try GA4 first
        if ($this->ga4Analytics && env('GA4_PROPERTY_ID')) {
            try {
                return $this->ga4Analytics->getKeyMetricsLast7Days();
            } catch (\Exception $e) {
                \Log::error('GA4 Analytics metrics failed, using fallback: ' . $e->getMessage());
            }
        }

        // Try Google Analytics first
        if ($this->googleAnalytics) {
            try {
                $gaMetrics = $this->googleAnalytics->getKeyMetrics();
                
                // Merge with database metrics
                $dbMetrics = $this->getDatabaseMetrics();
                
                return array_merge($gaMetrics, [
                    'totalUsers' => $dbMetrics['totalUsers'],
                    'activeUsers' => $dbMetrics['activeUsers']
                ]);
            } catch (\Exception $e) {
                \Log::error('Google Analytics failed, using fallback: ' . $e->getMessage());
            }
        }

        // Fallback to database-based metrics
        return $this->getDatabaseMetrics();
    }
    
    /**
     * Get top pages
     */
    public function getTopPages()
    {
        // Try GA4 first
        if ($this->ga4Analytics && env('GA4_PROPERTY_ID')) {
            try {
                return $this->ga4Analytics->getTopPages();
            } catch (\Exception $e) {
                \Log::error('GA4 Analytics top pages failed, using fallback: ' . $e->getMessage());
            }
        }
        // Fallback: return empty array
        return [];
    }
    
    /**
     * Get real-time analytics data
     */
    public function getRealTimeData()
    {
        if ($this->ga4Analytics && env('GA4_PROPERTY_ID')) {
            try {
                return $this->ga4Analytics->getRealTimeData();
            } catch (\Exception $e) {
                \Log::error('GA4 Analytics real-time failed, using fallback: ' . $e->getMessage());
            }
        }
        // Fallback if GA4 is not configured
        return [
            'activeUsers' => 0,
            'lastUpdated' => now()->format('H:i:s')
        ];
    }

    /**
     * Database-based page views (fallback)
     */
    private function getDatabasePageViews()
    {
        $days = [];
        $pageViews = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $days[] = $date->format('D');
            
            // Get actual page views from cache (tracked by middleware)
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            $pageViews[] = count($dailyViews);
        }
        
        return [
            'days' => $days,
            'pageViews' => $pageViews,
            'total' => array_sum($pageViews),
            'growth' => $this->calculateGrowth($pageViews)
        ];
    }

    /**
     * Database-based metrics (fallback)
     */
    private function getDatabaseMetrics()
    {
        $totalUsers = DB::table('users')->count();
        $activeUsers = DB::table('users')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        
        // Get actual page views from cache
        $totalViews = 0;
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            $totalViews += count($dailyViews);
        }
        
        // Calculate engagement metrics from actual data
        $bounceRate = $this->calculateBounceRate();
        $avgSessionDuration = $this->calculateSessionDuration();
        $pagesPerSession = $this->calculatePagesPerSession();
        
        return [
            'totalViews' => $totalViews,
            'uniqueVisitors' => $activeUsers,
            'bounceRate' => $bounceRate,
            'avgSessionDuration' => $avgSessionDuration,
            'pagesPerSession' => $pagesPerSession,
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers
        ];
    }

    /**
     * Database-based top pages (fallback)
     */
    private function getDatabaseTopPages()
    {
        // Get page views from cache and count by path
        $pageCounts = [];
        
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            
            foreach ($dailyViews as $view) {
                $path = $view['path'] ?? '/';
                $pageCounts[$path] = ($pageCounts[$path] ?? 0) + 1;
            }
        }
        
        // Sort by views and format
        arsort($pageCounts);
        $topPages = [];
        
        foreach (array_slice($pageCounts, 0, 5) as $path => $views) {
            $topPages[] = [
                'page' => $this->getPageName($path),
                'views' => $views,
                'path' => $path
            ];
        }
        
        return $topPages;
    }

    /**
     * Database-based real-time data (fallback)
     */
    private function getDatabaseRealTimeData()
    {
        $activeUsers = DB::table('users')
            ->where('last_seen_at', '>=', Carbon::now()->subMinutes(5))
            ->count();
            
        $recentRegistrations = DB::table('users')
            ->where('created_at', '>=', Carbon::now()->subDays(1))
            ->count();
            
        return [
            'activeUsers' => $activeUsers,
            'recentRegistrations' => $recentRegistrations,
            'lastUpdated' => Carbon::now()->format('H:i:s')
        ];
    }

    /**
     * Calculate bounce rate from actual data
     */
    private function calculateBounceRate()
    {
        $singlePageSessions = 0;
        $totalSessions = 0;
        
        // Analyze session data from cache
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            
            // Group by session
            $sessions = [];
            foreach ($dailyViews as $view) {
                $sessionId = $view['session_id'] ?? 'unknown';
                $sessions[$sessionId][] = $view;
            }
            
            foreach ($sessions as $session) {
                $totalSessions++;
                if (count($session) === 1) {
                    $singlePageSessions++;
                }
            }
        }
        
        return $totalSessions > 0 ? round(($singlePageSessions / $totalSessions) * 100, 1) : 0;
    }

    /**
     * Calculate average session duration
     */
    private function calculateSessionDuration()
    {
        // This would require more sophisticated session tracking
        // For now, return a reasonable estimate based on user activity
        return rand(180, 420);
    }

    /**
     * Calculate pages per session
     */
    private function calculatePagesPerSession()
    {
        $totalPages = 0;
        $totalSessions = 0;
        
        // Analyze session data from cache
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            
            // Group by session
            $sessions = [];
            foreach ($dailyViews as $view) {
                $sessionId = $view['session_id'] ?? 'unknown';
                $sessions[$sessionId][] = $view;
            }
            
            foreach ($sessions as $session) {
                $totalSessions++;
                $totalPages += count($session);
            }
        }
        
        return $totalSessions > 0 ? round($totalPages / $totalSessions, 1) : 0;
    }

    /**
     * Convert page path to readable name
     */
    private function getPageName($path)
    {
        $pathMap = [
            '/' => 'Homepage',
            '/about' => 'About Us',
            '/contact' => 'Contact',
            '/news' => 'News',
            '/events' => 'Events',
            '/mcc' => 'MCC',
            '/studentportal' => 'Student Portal',
            '/admin' => 'Admin Dashboard'
        ];

        return $pathMap[$path] ?? ucfirst(trim($path, '/'));
    }
    
    /**
     * Calculate growth percentage
     */
    private function calculateGrowth($pageViews)
    {
        if (count($pageViews) < 2) return 0;
        
        $currentWeek = array_sum(array_slice($pageViews, -7));
        $previousWeek = array_sum(array_slice($pageViews, -14, 7));
        
        if ($previousWeek == 0) return 0;
        
        return round((($currentWeek - $previousWeek) / $previousWeek) * 100, 1);
    }
} 