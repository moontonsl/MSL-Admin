import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';
import Breadcrumb from '@/Components/Breadcrumb';

export default function MslEventEdit({ event }) {
    const [imagePreview, setImagePreview] = useState(
        event.event_logo ? `/images/MCC/Events/${event.event_logo}` : null
    );

    const { data, setData, put, processing, errors } = useForm({
        event_name: event.event_name || '',
        event_title: event.event_title || '',
        event_subtitle: event.event_subtitle || '',
        event_canonical: event.event_canonical || '',
        event_logo: null,
        event_state: event.event_state || 'Active',
        is_featured: event.is_featured || false,
        event_content01: event.event_content01 || '',
        event_content02: event.event_content02 || '',
        event_img01: null,
        event_img02: null,
        event_img03: null,
        event_img04: null,
        event_img05: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.msl-events.update', event.id), {
            forceFormData: true,
        });
    };

    const handleImageChange = (field, file) => {
        if (file) {
            setData(field, file);
            
            // Create preview for main logo
            if (field === 'event_logo') {
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target.result);
                reader.readAsDataURL(file);
            }
        }
    };

    const removeImage = (field) => {
        setData(field, null);
        if (field === 'event_logo') {
            setImagePreview(null);
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit MSL Event" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Breadcrumb items={[
                            { label: 'Dashboard', href: route('admin.dashboard') },
                            { label: 'MSL Event Management', href: route('admin.msl-events.index') },
                            { label: 'Edit Event' }
                        ]} />
                    </div>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit MSL Event Card</h2>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Event Card Management</h3>
                        <p className="text-blue-700 text-sm">
                            This form manages event cards for the Events page. You only need to provide:
                        </p>
                        <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc">
                            <li>Event image (logo)</li>
                            <li>Event title and description</li>
                            <li>Future event page link</li>
                        </ul>
                        <p className="text-blue-700 text-sm mt-2 font-medium">
                            The actual event page will be created by a programmer later.
                        </p>
                    </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.event_name}
                                            onChange={(e) => setData('event_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Mobile Legends Championship"
                                            required
                                        />
                                        {errors.event_name && <p className="text-red-500 text-sm mt-1">{errors.event_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Future Event Page Link *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.event_canonical}
                                            onChange={(e) => setData('event_canonical', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., /NewEvent or /SpecialTournament"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This is where users will be redirected when they click the event card
                                        </p>
                                        {errors.event_canonical && <p className="text-red-500 text-sm mt-1">{errors.event_canonical}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.event_title}
                                        onChange={(e) => setData('event_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Mobile Legends Championship 2024"
                                        required
                                    />
                                    {errors.event_title && <p className="text-red-500 text-sm mt-1">{errors.event_title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Subtitle *
                                    </label>
                                    <textarea
                                        value={data.event_subtitle}
                                        onChange={(e) => setData('event_subtitle', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief description of the event"
                                        rows="3"
                                        required
                                    />
                                    {errors.event_subtitle && <p className="text-red-500 text-sm mt-1">{errors.event_subtitle}</p>}
                                </div>

                                {/* Event Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Logo
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="mx-auto h-32 w-auto object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage('event_logo')}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleImageChange('event_logo', e.target.files[0])}
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="event_logo"
                                                />
                                                <label
                                                    htmlFor="event_logo"
                                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                >
                                                    <div className="text-4xl mb-2">📷</div>
                                                    <p>Click to upload event logo</p>
                                                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 2MB</p>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {errors.event_logo && <p className="text-red-500 text-sm mt-1">{errors.event_logo}</p>}
                                </div>

                                {/* Status and Featured */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Status *
                                        </label>
                                        <select
                                            value={data.event_state}
                                            onChange={(e) => setData('event_state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {errors.event_state && <p className="text-red-500 text-sm mt-1">{errors.event_state}</p>}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                                            Featured Event
                                        </label>
                                    </div>
                                </div>

                                {/* Additional Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Content 1
                                        </label>
                                        <textarea
                                            value={data.event_content01}
                                            onChange={(e) => setData('event_content01', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Additional event information"
                                            rows="4"
                                        />
                                        {errors.event_content01 && <p className="text-red-500 text-sm mt-1">{errors.event_content01}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Content 2
                                        </label>
                                        <textarea
                                            value={data.event_content02}
                                            onChange={(e) => setData('event_content02', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="More event information"
                                            rows="4"
                                        />
                                        {errors.event_content02 && <p className="text-red-500 text-sm mt-1">{errors.event_content02}</p>}
                                    </div>
                                </div>

                                {/* Additional Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Additional Event Images (Optional)
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={num} className="border border-gray-300 rounded-lg p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Image {num}
                                                    {event[`event_img0${num}`] && (
                                                        <span className="text-green-600 text-xs ml-2">(Current: {event[`event_img0${num}`]})</span>
                                                    )}
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => setData(`event_img0${num}`, e.target.files[0])}
                                                    accept="image/*"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors[`event_img0${num}`] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[`event_img0${num}`]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <a
                                        href={route('admin.msl-events.index')}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {processing ? 'Updating...' : 'Update Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
