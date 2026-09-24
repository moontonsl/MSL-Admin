import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaCheck, FaUser, FaEnvelope, FaCalendar, FaSpinner } from 'react-icons/fa';
import Breadcrumb from '@/Components/Breadcrumb';

export default function PendingUsers({ users }) {
    const { post, processing } = useForm();

    const handleVerify = (userId) => {
        post(route('admin.users.verify', userId));
    };

    return (
        <AdminLayout>
            <Head title="Account Management" />

            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Account Management' }
            ]} />

            <div className="space-y-6">

                {/* Stats Card */}
                <div className="relative bg-[var(--background-glass-effect)] backdrop-blur-[20px] p-6 border-[var(--border-glass-effect)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center h-20 w-20 bg-gray-500/20 rounded-2xl">
                                <img src="/MSL_LOGO.png" alt="MSL Logo" className="h-20 w-20"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#212121] mt-6">
                                    Pending Users
                                </h3>
                                <p className="text-[#212121]">
                                    {users.data.length} users awaiting verification
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0f0f0]">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaUser className="w-4 h-4" />
                                            <span>Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaEnvelope className="w-4 h-4" />
                                            <span>Email</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaCalendar className="w-4 h-4" />
                                            <span>Registered</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f0f0]">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="text-sm font-medium text-[#212121]">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-[#212121]">
                                                        ML-ID: {user.ml_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#212121]">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#212121]">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => handleVerify(user.id)}
                                                disabled={processing}
                                                className="inline-flex items-center space-y-2 bg-[var(--green-500)] text-[#f0f0f0] px-6 py-1 rounded-md font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    ""
                                                )}
                                                <span>Verify</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-tr from-[var(--green-400)] to-[var(--green-500)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheck className="w-8 h-8 text-[var(--gray-1000)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#212121] mb-2">
                                All Users Verified!
                            </h3>
                            <p className="text-[var(--white-400)]">
                                No pending users to verify at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                :root {
                    --background-glass-effect: linear-gradient(
                        270deg,
                        rgba(255, 255, 255, 0.12) 0%,
                        rgba(255, 255, 255, 0.03) 100%
                    );
                    --border-glass-effect: linear-gradient(
                        270deg,
                        rgba(0, 0, 0, 0.4) 0%,
                        rgba(128, 128, 128, 0) 25%,
                        rgba(191, 191, 191, 0) 50%,
                        rgba(255, 255, 255, 0.4) 100%
                    );
                }
            `}</style>
        </AdminLayout>
    );
}