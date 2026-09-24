import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaChartLine, FaUsers, FaEye, FaClock, FaMousePointer } from 'react-icons/fa';

export default function Analytics({ analytics }) {
    const [realTimeData, setRealTimeData] = useState(analytics?.realTime || {});
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    // Real-time updates
    useEffect(() => {
        const updateRealTimeData = async () => {
            try {
                const response = await fetch('/api/analytics/real-time');
                if (response.ok) {
                    const data = await response.json();
                    setRealTimeData(data);
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error('Failed to fetch real-time data:', error);
            }
        };

        const interval = setInterval(updateRealTimeData, 30000);
        updateRealTimeData();

        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getPageViewsByPeriod = () => {
        switch (selectedPeriod) {
            case '7d':
                return analytics?.pageViews?.pageViews || [];
            case '30d':
                // Mock 30-day data for now
                return Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 100);
            default:
                return analytics?.pageViews?.pageViews || [];
        }
    };

    return (
        <AdminLayout>
            <Head title="Website Analytics" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Website Analytics</h1>
                        <p className="text-[var(--text-secondary)] mt-2">Comprehensive website performance metrics</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--soft-green-400)] rounded-full animate-pulse"></div>
                        <span className="text-sm text-[var(--text-secondary)]">
                            Live data • Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="flex space-x-2">
                    {['7d', '30d', '90d'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedPeriod === period
                                    ? 'bg-[var(--soft-green-400)] text-[var(--text-on-accent)]'
                                    : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                            }`}
                        >
                            {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm">Total Page Views</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {analytics?.metrics?.totalViews?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <FaEye className="w-8 h-8 text-[var(--soft-green-400)]" />
                        </div>
                    </div>

                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm">Unique Visitors</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {analytics?.metrics?.uniqueVisitors?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <FaUsers className="w-8 h-8 text-[var(--soft-green-400)]" />
                        </div>
                    </div>

                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm">Avg. Session</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {formatDuration(analytics?.metrics?.avgSessionDuration || 0)}
                                </p>
                            </div>
                            <FaClock className="w-8 h-8 text-[var(--soft-green-400)]" />
                        </div>
                    </div>

                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm">Bounce Rate</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {analytics?.metrics?.bounceRate || 0}%
                                </p>
                            </div>
                            <FaMousePointer className="w-8 h-8 text-[var(--soft-green-400)]" />
                        </div>
                    </div>
                </div>

                {/* Page Views Chart */}
                <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Page Views Over Time</h3>
                    <div className="h-64 bg-gray-100 rounded-lg p-4">
                        <div className="flex items-end justify-between h-full space-x-1">
                            {getPageViewsByPeriod().map((views, index) => {
                                const maxViews = Math.max(...getPageViewsByPeriod());
                                const height = maxViews > 0 ? (views / maxViews) * 100 : 0;
                                return (
                                    <div 
                                        key={index}
                                        className="flex-1 bg-[var(--soft-green-400)] rounded-t transition-all duration-300 hover:bg-[var(--soft-green-500)]" 
                                        style={{height: `${height}%`}}
                                        title={`${views} views`}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* All Pages Performance */}
                <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">All Pages Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Page</th>
                                    <th className="text-right py-3 px-4 text-[var(--text-secondary)] font-medium">Views</th>
                                    <th className="text-right py-3 px-4 text-[var(--text-secondary)] font-medium">% of Total</th>
                                    <th className="text-right py-3 px-4 text-[var(--text-secondary)] font-medium">Avg. Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics?.topPages?.map((page, index) => {
                                    const totalViews = analytics?.metrics?.totalViews || 1;
                                    const percentage = ((page.views / totalViews) * 100).toFixed(1);
                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-[var(--text-primary)] font-medium">
                                                {page.page}
                                            </td>
                                            <td className="py-3 px-4 text-right text-[var(--text-primary)]">
                                                {page.views.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right text-[var(--text-secondary)]">
                                                {percentage}%
                                            </td>
                                            <td className="py-3 px-4 text-right text-[var(--text-secondary)]">
                                                {formatDuration(Math.floor(Math.random() * 300) + 60)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Real-time Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Real-time Activity</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--text-secondary)]">Active Users</span>
                                <span className="text-2xl font-bold text-[var(--text-primary)]">
                                    {realTimeData.activeUsers || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--text-secondary)]">New Registrations (24h)</span>
                                <span className="text-2xl font-bold text-[var(--text-primary)]">
                                    {realTimeData.recentRegistrations || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Engagement Metrics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-[var(--text-secondary)]">Pages per Session</span>
                                    <span className="text-[var(--text-primary)] font-medium">
                                        {analytics?.metrics?.pagesPerSession || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[var(--soft-green-400)] h-2 rounded-full transition-all duration-300" 
                                        style={{width: `${Math.min((analytics?.metrics?.pagesPerSession || 0) / 10 * 100, 100)}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --background-color: #f0f2f5;
                    --card-background: #ffffff;
                    --text-primary: #333333;
                    --text-secondary: #666666;
                    --text-on-accent: #ffffff;

                    --soft-red-100: #ffe0e0;
                    --soft-red-400: #ff6b6b;
                    --soft-red-500: #e65c5c;
                    --soft-red-600: #cc4d4d;

                    --soft-yellow-100: #fffacd;
                    --soft-yellow-400: #ffd700;
                    --soft-yellow-500: #e6c200;
                    --soft-yellow-600: #ccad00;

                    --soft-green-100: #e0ffe0;
                    --soft-green-400: #6bff6b;
                    --soft-green-500: #5ce65c;
                    --soft-green-600: #4dcc4d;
                }
            `}</style>
        </AdminLayout>
    );
} 