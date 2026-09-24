import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';
import Breadcrumb from '@/Components/Breadcrumb';

export default function EventsIndex({ events }) {
    return (
        <AdminLayout>
            <Head title="Event Management" />

            

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <Breadcrumb items={[
                            { label: 'Dashboard', href: route('admin.dashboard') },
                            { label: 'Event Calendar' }
                        ]} />
                        <Link
                            href={route('admin.events.create')}
                            className="bg-[#212121] hover:bg-[#4A4A60] text-[#f0f0f0] px-4 py-2 rounded-md"
                        >
                            Create Event
                        </Link>
                    </div>

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-gray-500">
                                                No events found
                                            </td>
                                        </tr>
                                    )}
                                    {events.data.map((event) => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                <div className="text-sm text-gray-500">{event.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(event.start_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(event.start_date).toLocaleTimeString()} -
                                                    {new Date(event.end_date).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{event.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{event.creator.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('admin.events.edit', event.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('admin.events.delete', event.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}