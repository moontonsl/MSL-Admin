import React, { useEffect, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaUserShield, FaUser, FaEnvelope, FaCalendar, FaSpinner, FaArrowUp, FaArrowDown, FaUniversity, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Breadcrumb from '@/Components/Breadcrumb';

export default function RegionalAdminManagement({ regionalAdmins, students }) {
    const { post, processing, errors } = useForm();
    const { flash } = usePage().props;
    const [activeView, setActiveView] = useState('regionalAdmin'); // 'regionalAdmin' or 'students'

    useEffect(() => {
        if (flash?.success) {
            // Reload the page after a short delay to show the message
            setTimeout(() => {
                router.reload({ only: ['regionalAdmins', 'students'] });
            }, 1500);
        }
    }, [flash]);

    const handlePromote = (userId) => {
        if (confirm('Are you sure you want to promote this student to Regional Admin?')) {
            post(route('admin.users.promote-regional-admin', userId), {
                onSuccess: () => {
                    router.reload({ only: ['regionalAdmins', 'students'] });
                }
            });
        }
    };

    const handleDemote = (userId) => {
        if (confirm('Are you sure you want to demote this Regional Admin to Student?')) {
            post(route('admin.users.demote-regional-admin', userId), {
                onSuccess: () => {
                    router.reload({ only: ['regionalAdmins', 'students'] });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Regional Admin Management" />

            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Regional Admin Management' }
            ]} />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center space-x-2">
                        <FaCheckCircle className="w-5 h-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {errors?.error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center space-x-2">
                        <FaExclamationCircle className="w-5 h-5" />
                        <span>{errors.error}</span>
                    </div>
                )}

                {/* View Toggle Switch */}
                <div className="relative bg-[var(--background-glass-effect)] backdrop-blur-[20px] pt-4 border-[var(--border-glass-effect)]">
                    <div className="flex items-center justify-center">
                        <div className="inline-flex bg-gray-200 rounded-lg p-1 shadow-inner">
                            <button
                                onClick={() => setActiveView('regionalAdmin')}
                                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    activeView === 'regionalAdmin'
                                        ? 'text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={activeView === 'regionalAdmin' ? { backgroundColor: '#8b5cf6' } : {}}
                            >
                                <FaUserShield className="w-5 h-5" />
                                <span>Regional Admins ({regionalAdmins.total || regionalAdmins.data.length})</span>
                            </button>
                            <button
                                onClick={() => setActiveView('students')}
                                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    activeView === 'students'
                                        ? 'bg-green-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <FaUser className="w-5 h-5" />
                                <span>Verified Students ({students.total || students.data.length})</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Regional Admins Section */}
                {activeView === 'regionalAdmin' && (
                <div className="relative bg-[var(--background-glass-effect)] backdrop-blur-[20px] p-6 border-[var(--border-glass-effect)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
                                <FaUserShield className="w-10 h-10" style={{ color: '#8b5cf6' }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#212121] mt-6">
                                    Regional Admins
                                </h3>
                                <p className="text-[#212121]">
                                    {regionalAdmins.total || regionalAdmins.data.length} Regional Admin{(regionalAdmins.total || regionalAdmins.data.length) !== 1 ? 's' : ''}
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
                                            <FaUniversity className="w-4 h-4" />
                                            <span>University</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaMapMarkerAlt className="w-4 h-4" />
                                            <span>Region</span>
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
                                {regionalAdmins.data.map((user) => (
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
                                                {user.university || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#212121]">
                                                {user.region || 'N/A'}
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
                                                onClick={() => handleDemote(user.id)}
                                                disabled={processing}
                                                className="inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <FaArrowDown className="w-4 h-4" />
                                                        <span>Demote</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {regionalAdmins.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to top right, #8b5cf6, #8b5cf6)' }}>
                                <FaUserShield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#212121] mb-2">
                                No Regional Admins
                            </h3>
                            <p className="text-[#212121]">
                                No Regional Admins found at the moment.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {regionalAdmins.links && regionalAdmins.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {regionalAdmins.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url || processing}
                                        className={`px-4 py-2 rounded-md ${
                                            link.active
                                                ? 'text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        style={link.active ? { backgroundColor: '#8b5cf6' } : {}}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                )}

                {/* Students Section */}
                {activeView === 'students' && (
                <div className="relative bg-[var(--background-glass-effect)] backdrop-blur-[20px] p-6 border-[var(--border-glass-effect)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center h-20 w-20 bg-green-500/20 rounded-2xl">
                                <FaUser className="w-10 h-10 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#212121] mt-6">
                                    Verified Students
                                </h3>
                                <p className="text-[#212121]">
                                    {students.total || students.data.length} verified student{(students.total || students.data.length) !== 1 ? 's' : ''} available for promotion
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
                                            <FaUniversity className="w-4 h-4" />
                                            <span>University</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#212121] uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaMapMarkerAlt className="w-4 h-4" />
                                            <span>Region</span>
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
                                {students.data.map((user) => (
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
                                                {user.university || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#212121]">
                                                {user.region || 'N/A'}
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
                                                onClick={() => handlePromote(user.id)}
                                                disabled={processing}
                                                className="inline-flex items-center space-x-2 bg-[var(--green-500)] text-white px-4 py-2 rounded-md font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <FaArrowUp className="w-4 h-4" />
                                                        <span>Promote</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {students.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUser className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#212121] mb-2">
                                No Verified Students
                            </h3>
                            <p className="text-[#212121]">
                                No verified students available for promotion at the moment.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {students.links && students.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {students.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url || processing}
                                        className={`px-4 py-2 rounded-md ${
                                            link.active
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                )}
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
                    --green-500: #4dcc4d;
                }
            `}</style>
        </AdminLayout>
    );
}

