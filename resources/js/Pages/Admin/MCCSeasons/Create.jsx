import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function Create({ nextSeasonNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        season_number: nextSeasonNumber,
        season_name: '',
        start_date: '',
        end_date: '',
        route_slug: `S${nextSeasonNumber}`,
        description: '',
        is_active: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.mcc-seasons.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create MCC Season" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('admin.mcc-seasons.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <FaArrowLeft className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New MCC Season</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Add a new season to the MCC system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Season Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Season Number *
                                </label>
                                <input
                                    type="number"
                                    value={data.season_number}
                                    onChange={(e) => {
                                        setData('season_number', parseInt(e.target.value));
                                        setData('route_slug', `S${e.target.value}`);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.season_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.season_number}</p>
                                )}
                            </div>

                            {/* Route Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Route Slug *
                                </label>
                                <input
                                    type="text"
                                    value={data.route_slug}
                                    onChange={(e) => setData('route_slug', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="S1, S2, etc."
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    URL: /MCC/{data.route_slug}
                                </p>
                                {errors.route_slug && (
                                    <p className="mt-1 text-sm text-red-600">{errors.route_slug}</p>
                                )}
                            </div>
                        </div>

                        {/* Season Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Season Name *
                            </label>
                            <input
                                type="text"
                                value={data.season_name}
                                onChange={(e) => setData('season_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Pamantasang Lakas, Season 3"
                                required
                            />
                            {errors.season_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.season_name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of this season"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Set as active season
                            </label>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> After creating the season, you'll be redirected to the edit page where you can add images, content, teams, and other details.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Link
                            href={route('admin.mcc-seasons.index')}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                        >
                            <FaSave className="mr-2" />
                            {processing ? 'Creating...' : 'Create Season'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
