import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';
import Breadcrumb from '@/Components/Breadcrumb';

export default function MslEventIndex({ events }) {
    const [imagePreview, setImagePreview] = useState(null);

    const handleDelete = (eventId) => {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(route('admin.msl-events.destroy', eventId));
        }
    };

    const handleToggleStatus = (eventId, currentState) => {
        const newState = currentState === 'Active' ? 'Inactive' : 'Active';
        router.put(route('admin.msl-events.update-status', eventId), {
            event_state: newState
        });
    };

    return (
        <AdminLayout>
            <Head title="MSL Event Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <Breadcrumb items={[
                            { label: 'Dashboard', href: route('admin.dashboard') },
                            { label: 'MSL Event Management' }
                        ]} />
                        <Link
                            href={route('admin.msl-events.create')}
                            className="bg-[#212121] hover:bg-[#4A4A60] text-[#f0f0f0] px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Create New Event
                        </Link>
                    </div>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">MSL Event Management</h2>
                            
                            {events.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-lg">No events found</p>
                                    <p className="text-sm mt-2">Create your first event to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {events.map((event) => (
                                        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                            {/* Event Image */}
                                            <div className="relative h-48 bg-gray-100">
                                                {event.event_logo ? (
                                                    <img
                                                        src={`/images/MCC/Events/${event.event_logo}`}
                                                        alt={event.event_title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/images/MCC/Events/BTLogo.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <span className="text-gray-400 text-sm">No Image</span>
                                                    </div>
                                                )}
                                                
                                                {/* Status Badge */}
                                                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${
                                                    event.event_state === 'Active' 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-gray-500 text-white'
                                                }`}>
                                                    {event.event_state}
                                                </div>
                                            </div>

                                            {/* Event Content */}
                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {event.event_title}
                                                </h3>
                                                
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                                    {event.event_subtitle}
                                                </p>

                                                <div className="text-xs text-gray-500 mb-4">
                                                    <p><strong>Canonical:</strong> {event.event_canonical || 'Not set'}</p>
                                                    <p><strong>Featured:</strong> {event.is_featured ? 'Yes' : 'No'}</p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        href={route('admin.msl-events.edit', event.id)}
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded text-center transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </Link>
                                                    
                                                    <button
                                                        onClick={() => handleToggleStatus(event.id, event.event_state)}
                                                        className={`flex-1 text-xs py-2 px-3 rounded text-center transition-colors duration-200 ${
                                                            event.event_state === 'Active'
                                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                                        }`}
                                                    >
                                                        {event.event_state === 'Active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
