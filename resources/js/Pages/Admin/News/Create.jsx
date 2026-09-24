import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';

export default function CreateNews() {
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        news_title: '',
        news_subtitle: '',
        news_canonical: '',
        news_author: '',
        news_state: 'published',
        news_img1: null,
        news_img2: null,
        news_img3: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation
        if (!data.news_title || !data.news_canonical || !data.news_author) {
            alert('Please fill in all required fields (Title, Author, and Content)');
            return;
        }

        post(route('admin.news.store'), {
            forceFormData: true
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 3) {
            alert('You can only upload up to 3 images.');
            return;
        }

        // Reset images first
        setData(data => ({
            ...data,
            news_img1: null,
            news_img2: null,
            news_img3: null
        }));

        // Update form data with new files
        const newData = { ...data };
        files.forEach((file, index) => {
            if (index < 3) {
                newData[`news_img${index + 1}`] = file;
            }
        });
        setData(newData);

        // Create previews
        const newPreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                if (newPreviews.length === files.length) {
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });

        if (files.length === 0) {
            setImagePreviews([]);
        }
    };

    const removeImage = (indexToRemove) => {
        // Filter out the removed preview
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        setImagePreviews(newPreviews);

        // Re-organize the files in data
        // We need to collect current files, remove one, and re-assign to img1, img2, img3
        const currentFiles = [];
        if (data.news_img1) currentFiles.push(data.news_img1);
        if (data.news_img2) currentFiles.push(data.news_img2);
        if (data.news_img3) currentFiles.push(data.news_img3);

        // Remove the file at the specified index
        currentFiles.splice(indexToRemove, 1);

        // Update form data
        setData(data => ({
            ...data,
            news_img1: currentFiles[0] || null,
            news_img2: currentFiles[1] || null,
            news_img3: currentFiles[2] || null
        }));
    };

    return (
        <AdminLayout>
            <Head title="Create News" />

            <div className="min-h-screen py-4">
                <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Create News Article</h1>
                        <p className="mt-2 text-sm text-gray-600">Fill in the details below to create a new news article</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_title" className="block text-sm font-medium text-gray-700">
                                    Article Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="news_title"
                                    value={data.news_title}
                                    onChange={(e) => setData('news_title', e.target.value)}
                                    placeholder="Enter the main headline..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.news_title && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_title}</p>
                                )}
                            </div>

                            {/* Subtitle Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_subtitle" className="block text-sm font-medium text-gray-700">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    id="news_subtitle"
                                    value={data.news_subtitle}
                                    onChange={(e) => setData('news_subtitle', e.target.value)}
                                    placeholder="Enter a brief subtitle or summary..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.news_subtitle && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_subtitle}</p>
                                )}
                            </div>

                            {/* Author Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_author" className="block text-sm font-medium text-gray-700">
                                    Author Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="news_author"
                                    value={data.news_author}
                                    onChange={(e) => setData('news_author', e.target.value)}
                                    placeholder="Enter the author's name..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.news_author && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_author}</p>
                                )}
                            </div>

                            {/* Content Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_canonical" className="block text-sm font-medium text-gray-700">
                                    Article Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="news_canonical"
                                    value={data.news_canonical}
                                    onChange={(e) => setData('news_canonical', e.target.value)}
                                    rows={8}
                                    placeholder="Write your article content here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                />
                                {errors.news_canonical && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_canonical}</p>
                                )}
                            </div>

                            {/* State Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_state" className="block text-sm font-medium text-gray-700">
                                    Publication Status
                                </label>
                                <select
                                    id="news_state"
                                    value={data.news_state}
                                    onChange={(e) => setData('news_state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                {errors.news_state && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_state}</p>
                                )}
                            </div>

                            {/* Image Upload Field */}
                            <div className="space-y-2">
                                <label htmlFor="news_images" className="block text-sm font-medium text-gray-700">
                                    Featured Images (Max 3)
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="news_images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 2MB each)</p>
                                            </div>
                                            <input
                                                id="news_images"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative inline-block">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-40 w-auto rounded-lg border border-gray-200 shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.news_img1 && (
                                    <p className="text-sm text-red-600 mt-1">{errors.news_img1}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#212121] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Creating...' : 'Create News Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}