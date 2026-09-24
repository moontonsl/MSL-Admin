import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaUsers, FaNewspaper, FaCalendar, FaChartLine, FaTrophy } from 'react-icons/fa';

export default function Dashboard({ pendingUsers, totalNews, upcomingEvents, analytics, tournaments }) {
    const [realTimeData, setRealTimeData] = useState(analytics?.realTime || {});
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showAllPages, setShowAllPages] = useState(false);

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

        // Update every 30 seconds
        const interval = setInterval(updateRealTimeData, 30000);
        
        // Initial update
        updateRealTimeData();

        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            title: 'Active Users',
            value: pendingUsers,
            icon: FaUsers,
            color: 'from-[#212121] to-[#212121]',
            bgColor: 'bg-[#212121]',
            textColor: 'text-[#f0f0f0]'
        },
        {
            title: 'Total News',
            value: totalNews,
            icon: FaNewspaper,
            color: 'from-[#212121] to-[#212121]',
            bgColor: 'bg-[#212121]',
            textColor: 'text-[#f0f0f0]'
        },
        {
            title: 'Upcoming Events',
            value: upcomingEvents,
            icon: FaCalendar,
            color: 'from-[#212121] to-[#212121]',
            bgColor: 'bg-[#212121]',
            textColor: 'text-[#f0f0f0]'
        },
        {
            title: 'Tournaments',
            value: tournaments,
            icon: FaTrophy,
            color: 'from-[#212121] to-[#212121]',
            bgColor: 'bg-[#212121]',
            textColor: 'text-[#f0f0f0]'
        }
    ];

    // Format session duration from seconds to readable format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Real-time indicator */}
                <div className="flex items-center justify-end text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--berde-light)] rounded-full animate-pulse"></div>
                        <span>Live data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            <div className="relative bg-[var(--card-background)] rounded-2xl p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">

                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <stat.icon className="w-6 h-6 text-[var(--text-on-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">
                                                {stat.title}
                                            </h3>
                                            <p className="text-4xl font-bold text-[var(--text-primary)] mb-1">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                        <span className="text-[var(--asul-navy)] mr-1">↗</span>
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Website Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                            Website Analytics
                        </h3>
                        <div className="space-y-6">
                            {/* Page Views Chart */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-[var(--text-secondary)]">Page Views (Last 7 Days)</h4>
                                    <span className={`text-sm font-medium ${analytics?.pageViews?.growth >= 0 ? 'text-[var(--asul-navy)]' : 'text-[var(--red-malabo)]'}`}>
                                        {analytics?.pageViews?.growth >= 0 ? '+' : ''}{analytics?.pageViews?.growth || 0}%
                                    </span>
                                </div>
                                <div className="h-32 bg-gray-100 rounded-lg p-3">
                                    <div className="flex items-end justify-between h-full space-x-1">
                                        {analytics?.pageViews?.pageViews?.map((views, index) => {
                                            const maxViews = Math.max(...analytics.pageViews.pageViews);
                                            const height = maxViews > 0 ? (views / maxViews) * 100 : 0;
                                            return (
                                                <div 
                                                    key={index}
                                                    className="flex-1 bg-[var(--asul-navy)] rounded-t transition-all duration-300 hover:bg-[var(--berde-light)]" 
                                                    style={{height: `${height}%`}}
                                                    title={`${analytics.pageViews.days[index]}: ${views} views`}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
                                    {analytics?.pageViews?.days?.map((day, index) => (
                                        <span key={index}>{day}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                                        {analytics?.metrics?.totalViews?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">Total Views</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                                        {analytics?.metrics?.uniqueVisitors?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">Unique Visitors</div>
                                </div>
                            </div>

                            {/* Real-time Activity */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Real-time Activity</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-[var(--text-secondary)]">Active Users:</span>
                                        <span className="ml-2 font-medium text-[var(--text-primary)]">{realTimeData.activeUsers || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-secondary)]">New Today:</span>
                                        <span className="ml-2 font-medium text-[var(--text-primary)]">{realTimeData.recentRegistrations || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-[var(--card-background)] rounded-2xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                            User Engagement
                        </h3>
                        <div className="space-y-6">
                            {/* Bounce Rate mga umaalis agad pag ka visit ng page */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Bounce Rate</span>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {analytics?.metrics?.bounceRate || 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[var(--red-malabo)] h-2 rounded-full transition-all duration-300" 
                                        style={{width: `${analytics?.metrics?.bounceRate || 0}%`}}
                                    ></div>
                                </div>
                            </div>

                            {/* Average Session Duration */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Avg. Session Duration</span>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {formatDuration(analytics?.metrics?.avgSessionDuration || 0)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[var(--asul-navy)] h-2 rounded-full transition-all duration-300" 
                                        style={{width: `${Math.min((analytics?.metrics?.avgSessionDuration || 0) / 600 * 100, 100)}%`}}
                                    ></div>
                                </div>
                            </div>

                            {/* Pages per Session */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Pages per Session</span>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {analytics?.metrics?.pagesPerSession || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[var(--berde-light)] h-2 rounded-full transition-all duration-300" 
                                        style={{width: `${Math.min((analytics?.metrics?.pagesPerSession || 0) / 10 * 100, 100)}%`}}
                                    ></div>
                                </div>
                            </div>

                            {/* Top Pages */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-[var(--text-secondary)]">Top Pages</h4>
                                    <button 
                                        className="text-xs text-[var(--soft-green-400)] hover:underline"
                                        onClick={() => setShowAllPages(!showAllPages)}
                                    >
                                        {showAllPages ? 'Show Top 3' : 'View All'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {analytics?.topPages?.slice(0, showAllPages ? 10 : 3).map((page, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-[var(--text-primary)]">{page.page}</span>
                                            <span className="text-[var(--text-secondary)]">{page.views.toLocaleString()} views</span>
                                        </div>
                                    ))}
                                </div>
                                {analytics?.topPages?.length > 3 && !showAllPages && (
                                    <div className="text-xs text-[var(--text-secondary)] mt-2">
                                        +{analytics.topPages.length - 3} more pages tracked
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --card-background: #ffffff;
                    --text-primary: #333333;
                    --text-secondary: #666666;
                    --text-on-accent: #ffffff;

                    --red-malabo: #D55053;

                    --asul-navy: #10214b;
                    --berde-light: #4EA674;
                    --green-soft: #4dcc4d;


                }
            `}</style>
        </AdminLayout>
    );
}