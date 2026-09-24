import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { FaLink, FaCopy, FaTrash, FaEdit, FaPlus, FaSpinner, FaSearch, FaExternalLinkAlt, FaCheck, FaExclamationCircle } from 'react-icons/fa';

export default function Index({ shortLinks }) {
    const { flash, errors: pageErrors } = usePage().props;
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [editingLink, setEditingLink] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        original_url: '',
        code: '',
    });

    // Calculate stats
    const totalLinks = shortLinks.length;
    const totalClicks = shortLinks.reduce((acc, curr) => acc + curr.clicks, 0);

    const handleCopy = (id, url) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingLink) {
            put(route('admin.share-links.update', editingLink.id), {
                onSuccess: () => {
                    reset();
                    setEditingLink(null);
                    clearErrors();
                }
            });
        } else {
            post(route('admin.share-links.store'), {
                onSuccess: () => {
                    reset();
                    clearErrors();
                }
            });
        }
    };

    const handleEdit = (link) => {
        setEditingLink(link);
        setData({
            original_url: link.original_url,
            code: link.code,
        });
        clearErrors();
    };

    const handleCancelEdit = () => {
        setEditingLink(null);
        reset();
        clearErrors();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this share link?')) {
            router.delete(route('admin.share-links.destroy', id));
        }
    };

    // Filter short links by code or destination URL
    const filteredLinks = shortLinks.filter(link =>
        link.code.toLowerCase().includes(search.toLowerCase()) ||
        link.original_url.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="Share Link Management" />

            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Share Link' }
            ]} />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center space-x-2 shadow-sm">
                        <FaCheck className="w-5 h-5 text-green-500" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {pageErrors?.error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center space-x-2 shadow-sm">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                        <span>{pageErrors.error}</span>
                    </div>
                )}

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Share Links</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalLinks}</h3>
                        </div>
                        <div className="h-14 w-14 bg-amber-50 rounded-xl flex items-center justify-center text-[#fdb73e]">
                            <FaLink className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Redirects</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalClicks}</h3>
                        </div>
                        <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <FaExternalLinkAlt className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Link Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <FaPlus className="w-4 h-4 text-[#fdb73e]" />
                            <span>{editingLink ? 'Edit Share Link' : 'Create New Share Link'}</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/long-page-path"
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdb73e] ${
                                        errors.original_url ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                    value={data.original_url}
                                    onChange={e => setData('original_url', e.target.value)}
                                />
                                {errors.original_url && (
                                    <div className="text-red-500 text-xs mt-1">{errors.original_url}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Code / Alias
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                                        /s/
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="custom-name"
                                        className={`flex-1 block w-full rounded-r-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdb73e] ${
                                            errors.code ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                        }`}
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Optional. Alphanumeric, dash, and underscore only. Leave blank to auto-generate.
                                </p>
                                {errors.code && (
                                    <div className="text-red-500 text-xs mt-1">{errors.code}</div>
                                )}
                            </div>

                            <div className="flex space-x-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-[#fdb73e] hover:bg-[#e09e2b] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <span>{editingLink ? 'Save Changes' : 'Create Link'}</span>
                                    )}
                                </button>
                                {editingLink && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Links Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Share Links Directory
                            </h3>
                            {/* Search bar */}
                            <div className="relative max-w-xs">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdb73e] focus:border-transparent"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {filteredLinks.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                                <FaLink className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h4 className="text-base font-semibold text-gray-700 mb-1">
                                    {search ? 'No results found' : 'No share links created yet'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {search ? 'Try adjusting your search terms.' : 'Create a short link using the form on the left.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-3 px-4">Short Link</th>
                                            <th className="py-3 px-4">Destination</th>
                                            <th className="py-3 px-4 text-center">Clicks</th>
                                            <th className="py-3 px-4">Created At</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                        {filteredLinks.map((link) => {
                                            const shortUrl = link.short_url;
                                            return (
                                                <tr key={link.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold text-gray-900">
                                                                /s/{link.code}
                                                            </span>
                                                            <button
                                                                onClick={() => handleCopy(link.id, shortUrl)}
                                                                className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                                                                    copiedId === link.id ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                                                                }`}
                                                                title="Copy Short Link"
                                                            >
                                                                {copiedId === link.id ? (
                                                                    <FaCheck className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <FaCopy className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                            <a
                                                                href={shortUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                                                                title="Test Link Redirection"
                                                            >
                                                                <FaExternalLinkAlt className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <a
                                                            href={link.original_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:text-blue-700 font-medium max-w-xs truncate block"
                                                            title={link.original_url}
                                                        >
                                                            {link.original_url}
                                                        </a>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
                                                            {link.clicks}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-xs">
                                                        {new Date(link.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end space-x-1">
                                                            <button
                                                                onClick={() => handleEdit(link)}
                                                                className="p-1.5 rounded text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                                title="Edit Link"
                                                            >
                                                                <FaEdit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(link.id)}
                                                                className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                                title="Delete Link"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
