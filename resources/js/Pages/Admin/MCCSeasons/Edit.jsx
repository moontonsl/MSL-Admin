import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaArrowLeft, FaSave, FaUpload, FaTrash, FaImage } from 'react-icons/fa';

export default function Edit({ season, formattedContent }) {
    const { data, setData, put, processing, errors } = useForm({
        season_number: season.season_number,
        season_name: season.season_name,
        start_date: season.start_date || '',
        end_date: season.end_date || '',
        route_slug: season.route_slug,
        description: season.description || '',
        is_active: season.is_active,
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.mcc-seasons.update', season.id));
    };

    const handleImageUpload = async (contentType, contentKey, file) => {
        const formData = new FormData();
        formData.append('season_id', season.id);
        formData.append('content_type', contentType);
        formData.append('content_key', contentKey);
        formData.append('image', file);

        setUploading(true);
        setUploadProgress({ ...uploadProgress, [contentKey]: 'Uploading...' });

        try {
            await axios.post(route('admin.mcc-seasons.upload-image'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadProgress({ ...uploadProgress, [contentKey]: 'Uploaded!' });

            // Reload the page to show the new image
            router.reload({ only: ['formattedContent'] });

            setTimeout(() => {
                setUploadProgress({ ...uploadProgress, [contentKey]: null });
            }, 2000);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadProgress({ ...uploadProgress, [contentKey]: 'Error!' });
        } finally {
            setUploading(false);
        }
    };

    const ImageUploader = ({ label, contentType, contentKey, currentImage }) => (
        <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {currentImage && currentImage.path && (
                <div className="mb-3">
                    <img
                        src={`/storage/${currentImage.path}`}
                        alt={label}
                        className="max-w-xs h-32 object-contain border border-gray-200 rounded"
                    />
                </div>
            )}

            <div className="flex items-center space-x-2">
                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <FaUpload className="mr-2" />
                    {currentImage ? 'Replace' : 'Upload'}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                handleImageUpload(contentType, contentKey, e.target.files[0]);
                            }
                        }}
                    />
                </label>
                {uploadProgress[contentKey] && (
                    <span className="text-sm text-gray-600">{uploadProgress[contentKey]}</span>
                )}
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title={`Edit Season ${season.season_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('admin.mcc-seasons.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Season {season.season_number}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Update season information and content
                            </p>
                        </div>
                    </div>
                    <a
                        href={route('MCC.season', season.route_slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Preview Season
                    </a>
                </div>

                {/* Basic Information Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Season Number *
                            </label>
                            <input
                                type="number"
                                value={data.season_number}
                                onChange={(e) => setData('season_number', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {errors.season_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.season_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Route Slug *
                            </label>
                            <input
                                type="text"
                                value={data.route_slug}
                                onChange={(e) => setData('route_slug', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {errors.route_slug && (
                                <p className="mt-1 text-sm text-red-600">{errors.route_slug}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Season Name *
                        </label>
                        <input
                            type="text"
                            value={data.season_name}
                            onChange={(e) => setData('season_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.season_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.season_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

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
                        </div>
                    </div>

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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Image Uploads */}
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Season Images
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUploader
                            label="Hero Image (Left)"
                            contentType="hero_images"
                            contentKey="hero_left"
                            currentImage={formattedContent?.hero_images?.hero_left}
                        />
                        <ImageUploader
                            label="Hero Image (Right)"
                            contentType="hero_images"
                            contentKey="hero_right"
                            currentImage={formattedContent?.hero_images?.hero_right}
                        />
                        <ImageUploader
                            label="MCC Logo"
                            contentType="logos"
                            contentKey="mcc_logo"
                            currentImage={formattedContent?.logos?.mcc_logo}
                        />
                        <ImageUploader
                            label="Main Background"
                            contentType="backgrounds"
                            contentKey="main_bg"
                            currentImage={formattedContent?.backgrounds?.main_bg}
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> For advanced content management (teams, standings, matches, etc.), you can use the API endpoints or extend this interface. Images are stored in <code>/public/images/MCC/S{season.season_number}/</code>
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
