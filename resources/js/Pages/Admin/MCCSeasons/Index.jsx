import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye } from 'react-icons/fa';

export default function Index({ seasons }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this season? This action cannot be undone.')) {
            setDeleting(id);
            router.delete(route('admin.mcc-seasons.destroy', id), {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleToggleActive = (id) => {
        router.post(route('admin.mcc-seasons.toggle-active', id));
    };

    return (
        <AdminLayout>
            <Head title="MCC Season Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">MCC Season Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage all MCC (MSL Collegiate Cup) seasons
                        </p>
                    </div>
                    <Link
                        href={route('admin.mcc-seasons.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <FaPlus className="mr-2" />
                        Create New Season
                    </Link>
                </div>

                {/* Seasons Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Season
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content Items
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {seasons.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <FaTrophy className="text-5xl text-gray-300 mb-4" />
                                            <p className="text-lg font-medium">No seasons found</p>
                                            <p className="text-sm mt-1">Create your first MCC season to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                seasons.map((season) => (
                                    <tr key={season.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Season {season.season_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{season.season_name}</div>
                                            <div className="text-sm text-gray-500">/{season.route_slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {season.is_active ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {season.start_date && new Date(season.start_date).toLocaleDateString()}
                                            {season.end_date && (
                                                <> - {new Date(season.end_date).toLocaleDateString()}</>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {season.content_count || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <a
                                                    href={route('MCC.season', season.route_slug)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Season"
                                                >
                                                    <FaEye />
                                                </a>
                                                <Link
                                                    href={route('admin.mcc-seasons.edit', season.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Edit Season"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleActive(season.id)}
                                                    className={`${season.is_active
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    disabled={season.is_active}
                                                    title={season.is_active ? 'Already Active' : 'Set as Active'}
                                                >
                                                    {season.is_active ? <FaToggleOn /> : <FaToggleOff />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(season.id)}
                                                    className={`${season.is_active
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    disabled={season.is_active || deleting === season.id}
                                                    title={season.is_active ? 'Cannot delete active season' : 'Delete Season'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Only one season can be active at a time</li>
                        <li>The active season is displayed on the Events page</li>
                        <li>Users can view all seasons through the dropdown selector</li>
                        <li>You cannot delete the active season</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
