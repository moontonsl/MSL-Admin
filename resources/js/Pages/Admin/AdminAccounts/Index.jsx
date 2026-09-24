import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { FaUserPlus, FaTrash, FaUser, FaEnvelope, FaShieldAlt, FaPlus, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminAccountsIndex({ adminUsers }) {
    const { flash, errors } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, reset, errors: formErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('admin.accounts.store'), {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
                toast.success('New admin account created successfully!');
            },
            onError: () => {
                toast.error('Failed to create admin account. Check input errors.');
            },
        });
    };

    const { delete: destroy } = useForm();

    const handleDelete = (id, email) => {
        if (confirm(`Are you sure you want to delete admin account (${email})?`)) {
            destroy(route('admin.accounts.destroy', id), {
                onSuccess: () => {
                    toast.success(`Admin account ${email} deleted successfully.`);
                },
                onError: () => {
                    toast.error('Failed to delete admin account.');
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Account Management" />

            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Admin Accounts' }
            ]} />

            <div className="space-y-6">
                {/* Header & Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <FaUserPlus className="text-blue-600" />
                            Admin Accounts Management
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Create and manage administrator accounts for the admin portal. Only accessible by Super Admin.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#212121] hover:bg-[#333333] text-white font-medium rounded-xl transition-all shadow hover:shadow-md gap-2 cursor-pointer"
                    >
                        <FaPlus />
                        Create New Admin Account
                    </button>
                </div>

                {/* Flash Alert Messages */}
                {flash?.success && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                        <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Admin Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-600 text-xs uppercase font-semibold">
                                    <th className="px-6 py-4">Admin Name</th>
                                    <th className="px-6 py-4">Email Address</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {adminUsers.map((user) => {
                                    const isSuperAdmin = user.email === 'admin@msl.com';
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                                {isSuperAdmin && (
                                                    <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-md font-medium">
                                                        Super Admin
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {!isSuperAdmin ? (
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.email)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Admin Account"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Protected</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Admin Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaUserPlus className="text-blue-600" />
                                Create New Admin Account
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Jane Doe"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g. jane@msl.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="At least 8 characters"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Description</label>
                                <div className="relative">
                                    <FaShieldAlt className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        placeholder="e.g. Admin, Content Manager, Event Manager"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                {formErrors.role && <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 rounded-xl bg-[#212121] hover:bg-[#333333] text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
                                >
                                    {processing && <FaSpinner className="animate-spin" />}
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
