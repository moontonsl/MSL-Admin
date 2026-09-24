import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function EventPhotosIndex({ eventPhotos }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        event_name: '',
        school_name: '',
        picture: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingPhoto) {
            put(route('admin.event-photos.update', editingPhoto.id), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setEditingPhoto(null);
                    setImagePreview(null);
                    router.reload();
                }
            });
        } else {
            post(route('admin.event-photos.store'), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setShowAddForm(false);
                    setImagePreview(null);
                    router.reload();
                }
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('picture', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (photo) => {
        setEditingPhoto(photo);
        setData({
            event_name: photo.event_name || '',
            school_name: photo.school_name || '',
            picture: null,
        });
        setImagePreview(photo.picture || null);
    };

    const handleCancel = () => {
        reset();
        setEditingPhoto(null);
        setShowAddForm(false);
        setImagePreview(null);
    };

    const handleDelete = (photo) => {
        if (confirm('Are you sure you want to delete this event photo?')) {
            router.delete(route('admin.event-photos.delete', photo.id), {
                onSuccess: () => router.reload()
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Event Photos Management" />

            <div className="min-h-screen py-4">
                <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Event Photos Management</h1>
                        <p className="mt-2 text-sm text-gray-600">Manage event photos displayed in the carousel on the Buffs and Support page.</p>
                    </div>

                    {/* Add New Button */}
                    {!showAddForm && !editingPhoto && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaPlus className="mr-2" />
                                Add New Event Photo
                            </button>
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    {(showAddForm || editingPhoto) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingPhoto ? 'Edit Event Photo' : 'Add New Event Photo'}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Event Name Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">
                                            Event Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="event_name"
                                            value={data.event_name}
                                            onChange={(e) => setData('event_name', e.target.value)}
                                            placeholder="e.g., NDMU CEAC WEEK"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        {errors.event_name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.event_name}</p>
                                        )}
                                    </div>

                                    {/* School Name Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="school_name" className="block text-sm font-medium text-gray-700">
                                            School Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="school_name"
                                            value={data.school_name}
                                            onChange={(e) => setData('school_name', e.target.value)}
                                            placeholder="e.g., Notre Dame of Marbel University"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        {errors.school_name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.school_name}</p>
                                        )}
                                    </div>

                                    {/* Image Upload Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
                                            Event Photo {!editingPhoto && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="picture" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF (MAX. 5MB)</p>
                                                    </div>
                                                    <input 
                                                        id="picture" 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageChange}
                                                        className="hidden" 
                                                    />
                                                </label>
                                            </div>
                                            
                                            {imagePreview && (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="h-40 w-auto rounded-lg border border-gray-200 shadow-sm"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {errors.picture && (
                                            <p className="text-sm text-red-600 mt-1">{errors.picture}</p>
                                        )}
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {processing ? 'Saving...' : (editingPhoto ? 'Update Photo' : 'Add Photo')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Event Photos List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Event Photos</h3>
                            
                            {eventPhotos.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No event photos found. Add your first photo above.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {eventPhotos.map((photo) => (
                                        <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="relative">
                                                <img
                                                    src={photo.picture || "/images/MCC/News/News - Holder.jpg"}
                                                    alt={photo.event_name || 'Event photo'}
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                    {photo.event_name || 'Untitled Event'}
                                                </h4>
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                                    {photo.school_name || 'No school name'}
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(photo)}
                                                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FaEdit className="mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(photo)}
                                                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash className="mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

