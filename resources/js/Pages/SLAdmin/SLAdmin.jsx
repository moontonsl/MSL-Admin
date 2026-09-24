import styles from "./SLAdmin.module.scss";
import {BadgeCheck, ArrowDownAZ, Funnel, Search, Users, UserCheck, UserX, UserMinus, RefreshCw, Crown, ShieldUser} from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TableComponent from "@/Pages/SLAdmin/components/TableComponent.jsx";
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

const SLAdmin = () => {
    const { user, verified, inactive, new: newUsers, renewed, blocked, studentLeaders, regionalAdmins } = usePage().props;
    const [selectedTab, setSelectedTab] = useState('New');
    const [searchQuery, setSearchQuery] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [dynCounts, setDynCounts] = useState(null);

    const refreshCounts = async (search = '') => {
        try {
            const url = search.trim()
                ? `/api/sladmin/counts?search=${encodeURIComponent(search.trim())}`
                : '/api/sladmin/counts';
            const res = await fetch(url);
            const data = await res.json();
            setDynCounts(data);
        } catch (e) {}
    };

    useEffect(() => {
        if (!searchQuery || !searchQuery.trim()) {
            refreshCounts();
            return;
        }
        const timer = setTimeout(() => refreshCounts(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const tabCounts = dynCounts ?? { verified, inactive, new: newUsers, renewed, blocked };

    const baseTabOptions = [
        { label: 'New Accounts', value: 'New', icon: Users, count: tabCounts.new },
        { label: 'Renewal Required', value: 'Renew', icon: RefreshCw, count: tabCounts.renewed },
        { label: 'Verified', value: 'Verified', icon: UserCheck, count: tabCounts.verified },
        { label: 'Inactive', value: 'Inactive', icon: UserMinus, count: tabCounts.inactive },
        { label: 'Blocked', value: 'Blocked', icon: UserX, count: tabCounts.blocked },
    ];
    
    // Add Student Leader tab for Regional Admin and Super Admin
    // Add Regional User tab only for Super Admin
    let tabOptions = baseTabOptions;
    if (user.role === 'Regional Admin') {
        tabOptions = [...baseTabOptions, { label: 'Student Leaders', value: 'StudentLeaders', icon: Crown, count: studentLeaders }];
    } else if (user.role === 'Super Admin') {
        tabOptions = [
            ...baseTabOptions, 
            { label: 'Student Leaders', value: 'StudentLeaders', icon: Crown, count: studentLeaders },
            { label: 'Regional User', value: 'RegionalAdmins', icon: ShieldUser, count: regionalAdmins }
        ];
    }

    const StatCard = ({ icon: Icon, label, value, color }) => {
        const displayValue = value && value.toString().replace(/,/g, '').length >= 8 ? '...' : (value?.toLocaleString() || '0');

        return (
            <div className="flex-1 min-w-[140px] bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-3 sm:p-4 hover:border-neutral-600/50 transition-all duration-300 group">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                        </div>
                        <span className="text-xs text-neutral-400 font-medium text-right">{label}</span>
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white group-hover:scale-105 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis" title={value?.toLocaleString()}>
                        {displayValue}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="SL Admin" />
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
                <div className="px-4 sm:px-6 lg:px-8 py-6 container mx-auto max-w-7xl">
                    
                    {/* Hero Profile Section */}
                    <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            
                            {/* Profile Picture */}
                            <div className="lg:col-span-3 flex justify-center lg:justify-start">
                                <div className="relative">
                                    <div className="bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-2 rounded-full shadow-2xl">
                                        <div className="bg-neutral-900 rounded-full p-1">
                                            <img
                                                src={profilePic}
                                                alt="Profile"
                                                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-neutral-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-neutral-900">
                                        <BadgeCheck className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="lg:col-span-6 text-center lg:text-left">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {user.name} {user.surname}
                                </h1>
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                                    <span className="text-lg sm:text-xl text-neutral-300 font-medium">@{user.username}</span>
                                </div>
                                
                                {/* User Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                    <div className="text-center sm:text-left">
                                        <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Role</div>
                                        <div className="text-sm sm:text-base font-semibold text-white">{user.role}</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Area</div>
                                        <div className="text-sm sm:text-base font-semibold text-white">{user.island}</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Year Level</div>
                                        <div className="text-sm sm:text-base font-semibold text-white">Masters</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Region</div>
                                        <div className="text-sm sm:text-base font-semibold text-white">{user.region}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Institution & Stats */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Institution</div>
                                    <div className="text-sm font-medium text-white leading-relaxed">{user.university}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards - Proportional Width */}
                    <div className="w-full flex flex-wrap gap-1 sm:gap-2 mb-8 items-center justify-between">
                        <StatCard
                            icon={UserCheck}
                            label="Verified"
                            value={tabCounts.verified}
                            color="text-green-400"
                        />
                        <StatCard
                            icon={Users}
                            label="New"
                            value={tabCounts.new}
                            color="text-blue-400"
                        />
                        <StatCard
                            icon={RefreshCw}
                            label="Renewal"
                            value={tabCounts.renewed}
                            color="text-yellow-400"
                        />
                        <StatCard
                            icon={UserMinus}
                            label="Inactive"
                            value={tabCounts.inactive}
                            color="text-gray-400"
                        />
                        <StatCard
                            icon={UserX}
                            label="Blocked"
                            value={tabCounts.blocked}
                            color="text-red-400"
                        />
                        {(user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                            <StatCard 
                                icon={Crown} 
                                label="Student Leaders" 
                                value={studentLeaders} 
                                color="text-purple-400" 
                            />
                        )}
                        {user.role === 'Super Admin' && (
                            <StatCard 
                                icon={ShieldUser} 
                                label="Regional Admins" 
                                value={regionalAdmins} 
                                color="text-blue-400" 
                            />
                        )}
                    </div>

                    {/* Table Controls */}
                    <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-4 sm:p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            
                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2 sm:gap-4 lg:border-r border-neutral-700/50">
                                {tabOptions.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.value}
                                            onClick={() => setSelectedTab(tab.value)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                selectedTab === tab.value
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                            {tab.count != null && (
                                                <span className="bg-neutral-600/50 text-xs px-2 py-1 rounded-full">
                                                    {tab.count.toLocaleString()}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                                
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-200">
                                    <span className="hidden sm:inline">Create Tournament</span>
                                    <span className="sm:hidden">Create</span>
                                </button>
                                
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-200">
                                    <span className="hidden sm:inline">Tournament Bracket</span>
                                    <span className="sm:hidden">Bracket</span>
                                </button>
                            </div>

                            {/* Search + Filters */}
                            <div className="flex flex-col gap-2 w-full lg:w-80">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                    <input
                                        className="w-full bg-neutral-700/50 border border-neutral-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Component */}
                    <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden">
                        <TableComponent stateFilter={selectedTab} searchQuery={searchQuery} schoolFilter={schoolFilter} courseFilter={courseFilter} user={user} onCountsRefresh={() => refreshCounts(searchQuery)} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SLAdmin;
