import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';

export default function Settings({ settings }) {
    const logoInput = useRef();
    const faviconInput = useRef();
    const { data, setData, post, processing, errors, reset } = useForm({
        website_name: settings.website_name || '',
        website_title: settings.website_title || '',
        maintenance_mode: settings.maintenance_mode === '1' || settings.maintenance_mode === 1 || false,
        maintenance_message: settings.maintenance_message || '',
        logo: null,
        favicon: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Settings' }
            ]} />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium mb-1">Website Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            value={data.website_name}
                            onChange={e => setData('website_name', e.target.value)}
                        />
                        {errors.website_name && <div className="text-red-500 text-sm">{errors.website_name}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Website Title</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            value={data.website_title}
                            onChange={e => setData('website_title', e.target.value)}
                        />
                        {errors.website_title && <div className="text-red-500 text-sm">{errors.website_title}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Logo</label>
                        <input
                            type="file"
                            className="w-full border rounded px-3 py-2"
                            ref={logoInput}
                            onChange={e => setData('logo', e.target.files[0])}
                        />
                        {settings.logo && (
                            <img src={settings.logo.replace('public/', '/storage/')} alt="Current Logo" className="h-16 mt-2" />
                        )}
                        {errors.logo && <div className="text-red-500 text-sm">{errors.logo}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Favicon</label>
                        <input
                            type="file"
                            className="w-full border rounded px-3 py-2"
                            ref={faviconInput}
                            onChange={e => setData('favicon', e.target.files[0])}
                        />
                        {settings.favicon && (
                            <img src={settings.favicon.replace('public/', '/storage/')} alt="Current Favicon" className="h-8 mt-2" />
                        )}
                        {errors.favicon && <div className="text-red-500 text-sm">{errors.favicon}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Maintenance Mode</label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={!!data.maintenance_mode}
                                onChange={e => setData('maintenance_mode', e.target.checked)}
                            />
                            <span>Enable Maintenance Mode</span>
                        </label>
                        {errors.maintenance_mode && <div className="text-red-500 text-sm">{errors.maintenance_mode}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Maintenance Message</label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            value={data.maintenance_message}
                            onChange={e => setData('maintenance_message', e.target.value)}
                        />
                        {errors.maintenance_message && <div className="text-red-500 text-sm">{errors.maintenance_message}</div>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={processing}
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
} 