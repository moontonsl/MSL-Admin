<?php

namespace App\Services;

use Google\Client;
use Google\Service\AnalyticsData;
use Google\Service\AnalyticsData\RunReportRequest;
use Google\Service\AnalyticsData\DateRange;
use Google\Service\AnalyticsData\Dimension;
use Google\Service\AnalyticsData\Metric;

class GA4AnalyticsService
{
    protected $propertyId;

    public function __construct()
    {
        $this->propertyId = env('GA4_PROPERTY_ID');
    }

    protected function getAnalyticsDataClient()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/google/analytics-credentials.json'));
        $client->addScope('https://www.googleapis.com/auth/analytics.readonly');
        return new AnalyticsData($client);
    }

    public function getPageViewsLast7Days()
    {
        $analyticsData = $this->getAnalyticsDataClient();

        $request = new RunReportRequest([
            'dateRanges' => [new DateRange(['start_date' => '7daysAgo', 'end_date' => 'today'])],
            'metrics' => [new Metric(['name' => 'screenPageViews'])],
            'dimensions' => [new Dimension(['name' => 'date'])]
        ]);

        $response = $analyticsData->properties->runReport('properties/' . $this->propertyId, $request);

        $days = [];
        $pageViews = [];
        foreach ($response->getRows() as $row) {
            $days[] = $row->getDimensionValues()[0]->getValue();
            $pageViews[] = (int) $row->getMetricValues()[0]->getValue();
        }

        return [
            'days' => $days,
            'pageViews' => $pageViews,
            'total' => array_sum($pageViews),
        ];
    }

    public function getKeyMetricsLast7Days()
    {
        $analyticsData = $this->getAnalyticsDataClient();

        $request = new RunReportRequest([
            'dateRanges' => [new DateRange(['start_date' => '7daysAgo', 'end_date' => 'today'])],
            'metrics' => [
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'activeUsers']),
                new Metric(['name' => 'bounceRate']),
                new Metric(['name' => 'averageSessionDuration']),
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'engagedSessions'])
            ]
        ]);

        $response = $analyticsData->properties->runReport('properties/' . $this->propertyId, $request);

        $metrics = [
            'totalViews' => 0,
            'uniqueVisitors' => 0,
            'bounceRate' => 0,
            'avgSessionDuration' => 0,
            'pagesPerSession' => 0
        ];

        if ($response->getRows()) {
            $row = $response->getRows()[0];
            $metrics['totalViews'] = (int) $row->getMetricValues()[0]->getValue();
            $metrics['uniqueVisitors'] = (int) $row->getMetricValues()[1]->getValue();
            $metrics['bounceRate'] = round((float) $row->getMetricValues()[2]->getValue(), 1);
            $metrics['avgSessionDuration'] = round((float) $row->getMetricValues()[3]->getValue());
            $sessions = (float) $row->getMetricValues()[4]->getValue();
            $engagedSessions = (float) $row->getMetricValues()[5]->getValue();
            $metrics['pagesPerSession'] = $sessions > 0 ? round($engagedSessions / $sessions, 1) : 0;
        }

        return $metrics;
    }

    public function getTopPages()
    {
        // No data, return empty array
        return [];
    }

    public function getActiveUsersToday()
    {
        $analyticsData = $this->getAnalyticsDataClient();

        $request = new RunReportRequest([
            'dateRanges' => [new DateRange(['start_date' => 'today', 'end_date' => 'today'])],
            'metrics' => [new Metric(['name' => 'activeUsers'])]
        ]);

        $response = $analyticsData->properties->runReport('properties/' . $this->propertyId, $request);

        $activeUsers = 0;
        if ($response->getRows()) {
            $row = $response->getRows()[0];
            $activeUsers = (int) $row->getMetricValues()[0]->getValue();
        }
        return $activeUsers;
    }

    public function getRealTimeData()
    {
        // Use today's active users as a proxy for real-time
        $activeUsers = $this->getActiveUsersToday();
        return [
            'activeUsers' => $activeUsers,
            'lastUpdated' => now()->format('H:i:s')
        ];
    }
} 