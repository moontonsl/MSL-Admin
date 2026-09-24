import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { FaLock, FaSearch, FaUser, FaSave, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaCheckSquare, FaSquare, FaChevronDown } from 'react-icons/fa';

function UserPermissionCard({ user, availableTabs }) {
    const isSuperAdmin = user.email === 'admin@msl.com';
    const initialPermissions = Array.isArray(user.permissions) ? user.permissions : [];

    const { data, setData, put, processing, isDirty } = useForm({
        permissions: initialPermissions,
    });

    const handleToggle = (tabId) => {
        if (isSuperAdmin) return;
        if (data.permissions.includes(tabId)) {
            setData('permissions', data.permissions.filter((id) => id !== tabId));
        } else {
            setData('permissions', [...data.permissions, tabId]);
        }
    };

    const handleSelectAll = () => {
        if (isSuperAdmin) return;
        setData('permissions', availableTabs.map((tab) => tab.id));
    };

    const handleDeselectAll = () => {
        if (isSuperAdmin) return;
        setData('permissions', []);
    };

    const handleSave = (e) => {
        e.preventDefault();
        put(route('admin.permissions.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Permissions for ${user.name} updated successfully!`);
            },
            onError: () => {
                toast.error('Failed to update permissions.');
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                            {user.name}
                            {isSuperAdmin ? (
                                <span className="px-2.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-md font-semibold">
                                    Super Admin (Full Access)
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md font-medium">
                                    {user.role}
                                </span>
                            )}
                        </h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>
                    </div>
                </div>

                {!isSuperAdmin && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-2 bg-blue-50 hover:bg-blue-100/70 rounded-xl transition-colors cursor-pointer"
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="text-xs font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 bg-gray-100 hover:bg-gray-200/70 rounded-xl transition-colors cursor-pointer"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={processing || !isDirty}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isDirty
                                    ? 'bg-[#212121] hover:bg-[#333333] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {processing ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Save Permissions
                        </button>
                    </div>
                )}
            </div>

            {/* Permission Checkboxes Grid */}
            {isSuperAdmin ? (
                <div className="p-4 bg-amber-50/70 border border-amber-200 text-amber-900 text-sm rounded-xl">
                    <p className="font-semibold">Super Admin Privileges</p>
                    <p className="text-xs text-amber-700 mt-1">
                        `admin@msl.com` automatically has full access to all tabs and system settings. Permissions cannot be modified.
                    </p>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Allowed Sidebar Tabs ({data.permissions.length} / {availableTabs.length} enabled)
                        </h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableTabs.map((tab) => {
                            const isChecked = data.permissions.includes(tab.id);
                            return (
                                <div
                                    key={tab.id}
                                    onClick={() => handleToggle(tab.id)}
                                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all select-none ${
                                        isChecked
                                            ? 'bg-blue-50/60 border-blue-300 text-blue-950 font-semibold shadow-xs'
                                            : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100/70'
                                    }`}
                                >
                                    <span className="text-sm">{tab.name}</span>
                                    {isChecked ? (
                                        <FaCheckSquare className="text-blue-600 w-4 h-4 flex-shrink-0" />
                                    ) : (
                                        <FaSquare className="text-gray-300 w-4 h-4 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PermissionsIndex({ adminUsers, availableTabs }) {
    const { flash } = usePage().props;
    const [selectedUserId, setSelectedUserId] = useState(adminUsers[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = adminUsers.filter((u) => {
        const term = searchTerm.toLowerCase();
        return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term);
    });

    const selectedUser = adminUsers.find((u) => u.id === Number(selectedUserId)) || adminUsers[0];

    return (
        <AdminLayout>
            <Head title="Tab Permissions Management" />

            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Permissions' }
            ]} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaLock className="text-blue-600" />
                        Tab Permissions Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Control which sidebar tabs each admin user is permitted to view and access. Select an account from the dropdown below to view or edit permissions.
                    </p>
                </div>

                {/* Account Selection Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Select Admin Account ({adminUsers.length} total accounts)
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                                <select
                                    value={selectedUser?.id || ''}
                                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50/80 hover:bg-gray-100/70 border border-gray-200 rounded-xl font-medium text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                                >
                                    {filteredUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email}) — {user.role}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-3.5 top-4 text-gray-400 text-xs pointer-events-none" />
                            </div>
                        </div>

                        {/* Quick Account Search Filter */}
                        <div className="w-full md:w-72">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Filter Account List
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, email or role..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
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

                {/* Selected Admin User Permission Card */}
                {selectedUser ? (
                    <UserPermissionCard key={selectedUser.id} user={selectedUser} availableTabs={availableTabs} />
                ) : (
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 text-center text-gray-500">
                        No admin accounts match your search filter.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
