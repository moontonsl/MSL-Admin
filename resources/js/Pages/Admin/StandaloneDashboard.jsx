import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FaUserGraduate,
    FaCheckCircle,
    FaUsers,
    FaSync,
    FaUserSlash,
    FaBan,
    FaSearch,
    FaCrown,
    FaShieldAlt,
} from 'react-icons/fa';

const tabs = [
    { label: 'New Accounts', count: 587, active: true },
    { label: 'Renewal Required', count: 214 },
    { label: 'Verified', count: 1284 },
    { label: 'Inactive', count: 96 },
    { label: 'Blocked', count: 42 },
    { label: 'Student Leaders', count: 328 },
    { label: 'Regional User', count: 16 },
];

const stats = [
    { label: 'Verified', value: '1,284', icon: FaCheckCircle, tone: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'New', value: '587', icon: FaUsers, tone: 'text-sky-400 bg-sky-500/10' },
    { label: 'Renewal', value: '214', icon: FaSync, tone: 'text-amber-400 bg-amber-500/10' },
    { label: 'Inactive', value: '96', icon: FaUserSlash, tone: 'text-slate-300 bg-slate-500/10' },
    { label: 'Blocked', value: '42', icon: FaBan, tone: 'text-rose-400 bg-rose-500/10' },
    { label: 'Student Leaders', value: '328', icon: FaCrown, tone: 'text-violet-400 bg-violet-500/10' },
];

const records = [
    { name: 'Amelia Stone', university: 'UP Diliman', course: 'BS Computer Science', region: 'NCR', status: 'Verified', lastLogin: 'Today, 9:42 AM' },
    { name: 'Noah Wright', university: 'Adamson University', course: 'BS Psychology', region: 'Metro Manila', status: 'Renewal', lastLogin: 'Yesterday, 6:18 PM' },
    { name: 'Sophia Kim', university: 'De La Salle University', course: 'BS Marketing', region: 'South Luzon', status: 'Verified', lastLogin: 'Today, 7:56 AM' },
    { name: 'Liam Perez', university: 'Mapua University', course: 'BS Information Technology', region: 'NCR', status: 'Review', lastLogin: 'Aug 09, 2026' },
    { name: 'Emma Santos', university: 'University of Santo Tomas', course: 'BS Nursing', region: 'Central Luzon', status: 'Inactive', lastLogin: 'Aug 04, 2026' },
    { name: 'James Ramos', university: 'Ateneo de Manila', course: 'BS Economics', region: 'Metro Manila', status: 'Blocked', lastLogin: 'Jul 31, 2026' },
];

const statusClasses = {
    Verified: 'bg-emerald-500/10 text-emerald-400',
    Renewal: 'bg-amber-500/10 text-amber-300',
    Review: 'bg-violet-500/10 text-violet-300',
    Inactive: 'bg-slate-500/10 text-slate-300',
    Blocked: 'bg-rose-500/10 text-rose-300',
};

export default function StandaloneDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user ?? {
        name: 'Jayson Allan',
        email: 'jaysonallan@msl.com',
    };

    return (
        <AdminLayout>
            <Head title="SL Admin" />

            <div className="space-y-6">
                <div className="rounded-[24px] border border-white/10 bg-gradient-to-r from-[#1c232d] via-[#111827] to-[#0b1220] p-6 shadow-2xl shadow-black/20">
                    <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)_220px] lg:items-center">
                        <div className="flex justify-center lg:justify-start">
                            <div className="relative">
                                <div className="h-[126px] w-[126px] rounded-full bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706] p-[4px] shadow-[0_18px_36px_rgba(251,191,36,0.25)]">
                                    <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#111827] bg-[#111827] text-4xl font-black text-[#f8d77d]">
                                        {user.name?.charAt(0)?.toUpperCase() || 'J'}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#0d1117] bg-emerald-500 text-[10px] font-bold text-white">
                                    ✓
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
                                {user.name || 'Jayson Allan'}
                            </h1>
                            <div className="mt-2 text-lg text-slate-400">@{(user.email || 'jaysonallan').split('@')[0]}</div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Role</div>
                                    <div className="text-sm font-semibold text-white">Regional Admin</div>
                                </div>
                                <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Area</div>
                                    <div className="text-sm font-semibold text-white">Luzon</div>
                                </div>
                                <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Year Level</div>
                                    <div className="text-sm font-semibold text-white">Masters</div>
                                </div>
                                <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Region</div>
                                    <div className="text-sm font-semibold text-white">NCR</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Institution</div>
                            <div className="text-sm font-semibold leading-relaxed text-white">University of the Philippines Diliman</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    {stats.map(({ label, value, icon: Icon, tone }) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-[#111827]/70 p-4 shadow-lg shadow-black/10">
                            <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                <span className={`grid h-8 w-8 place-items-center rounded-xl ${tone}`}>
                                    <Icon className="text-base" />
                                </span>
                                {label}
                            </div>
                            <div className="mt-5 text-3xl font-black tracking-[-0.05em] text-white">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map(({ label, count, active }) => (
                                <button
                                    key={label}
                                    type="button"
                                    className={[
                                        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                                        active
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10',
                                    ].join(' ')}
                                >
                                    <span>{label}</span>
                                    <span className={[
                                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                        active ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300',
                                    ].join(' ')}>{count}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300 min-w-[260px]">
                            <FaSearch className="text-sm" />
                            <input
                                type="text"
                                value="Search students..."
                                readOnly
                                className="w-full border-0 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/70">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Name</th>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">University</th>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Course</th>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Region</th>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((row) => (
                                    <tr key={row.name} className="border-t border-white/10 hover:bg-white/5">
                                        <td className="px-4 py-4 text-sm font-medium text-white">{row.name}</td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{row.university}</td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{row.course}</td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{row.region}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[row.status]}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{row.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
