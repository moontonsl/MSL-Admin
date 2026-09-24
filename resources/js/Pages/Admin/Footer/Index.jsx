import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Plus, Trash2, Save } from 'lucide-react';

export default function FooterIndex({ footer, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        description: footer?.description || '',
        copyright: footer?.copyright || '',
        logo: footer?.logo || '/msl-logo.png',
        facebook_url: footer?.facebook_url || '',
        youtube_url: footer?.youtube_url || '',
        mlbb_logo: footer?.mlbb_logo || '/mlbb-logo.png',
        moonton_logo: footer?.moonton_logo || '/moonton-logo.png',
        nav_sections: footer?.nav_sections || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.footer.update'));
    };

    const addNavSection = () => {
        setData('nav_sections', [
            ...data.nav_sections,
            {
                title: '',
                links: [{ label: '', href: '' }]
            }
        ]);
    };

    const removeNavSection = (index) => {
        const newSections = data.nav_sections.filter((_, i) => i !== index);
        setData('nav_sections', newSections);
    };

    const updateNavSection = (sectionIndex, field, value) => {
        const newSections = [...data.nav_sections];
        newSections[sectionIndex][field] = value;
        setData('nav_sections', newSections);
    };

    const addNavLink = (sectionIndex) => {
        const newSections = [...data.nav_sections];
        newSections[sectionIndex].links.push({ label: '', href: '' });
        setData('nav_sections', newSections);
    };

    const removeNavLink = (sectionIndex, linkIndex) => {
        const newSections = [...data.nav_sections];
        newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
        setData('nav_sections', newSections);
    };

    const updateNavLink = (sectionIndex, linkIndex, field, value) => {
        const newSections = [...data.nav_sections];
        newSections[sectionIndex].links[linkIndex][field] = value;
        setData('nav_sections', newSections);
    };

    return (
        <AdminLayout>
            <Head title="Footer Management" />
            <Breadcrumb items={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Footer Management' }
            ]} />

            <div className="max-w-6xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium mb-2">Description</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows="4"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Footer description text..."
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Copyright Text</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={data.copyright}
                                    onChange={e => setData('copyright', e.target.value)}
                                    placeholder="© 2025 — Moonton Student Leaders Philippines"
                                />
                                {errors.copyright && <div className="text-red-500 text-sm mt-1">{errors.copyright}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-medium mb-2">Logo Path</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.logo}
                                        onChange={e => setData('logo', e.target.value)}
                                        placeholder="/msl-logo.png"
                                    />
                                    {errors.logo && <div className="text-red-500 text-sm mt-1">{errors.logo}</div>}
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">MLBB Logo Path</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.mlbb_logo}
                                        onChange={e => setData('mlbb_logo', e.target.value)}
                                        placeholder="/mlbb-logo.png"
                                    />
                                    {errors.mlbb_logo && <div className="text-red-500 text-sm mt-1">{errors.mlbb_logo}</div>}
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">Moonton Logo Path</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.moonton_logo}
                                        onChange={e => setData('moonton_logo', e.target.value)}
                                        placeholder="/moonton-logo.png"
                                    />
                                    {errors.moonton_logo && <div className="text-red-500 text-sm mt-1">{errors.moonton_logo}</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-2">Facebook URL</label>
                                <input
                                    type="url"
                                    className="w-full border rounded px-3 py-2"
                                    value={data.facebook_url}
                                    onChange={e => setData('facebook_url', e.target.value)}
                                    placeholder="https://www.facebook.com/MSLPhilippines"
                                />
                                {errors.facebook_url && <div className="text-red-500 text-sm mt-1">{errors.facebook_url}</div>}
                            </div>

                            <div>
                                <label className="block font-medium mb-2">YouTube URL</label>
                                <input
                                    type="url"
                                    className="w-full border rounded px-3 py-2"
                                    value={data.youtube_url}
                                    onChange={e => setData('youtube_url', e.target.value)}
                                    placeholder="https://www.youtube.com/@MSLPhilippines"
                                />
                                {errors.youtube_url && <div className="text-red-500 text-sm mt-1">{errors.youtube_url}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Navigation Sections</h2>
                            <button
                                type="button"
                                onClick={addNavSection}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Add Section
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.nav_sections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="text"
                                            className="flex-1 border rounded px-3 py-2 font-semibold"
                                            value={section.title}
                                            onChange={e => updateNavSection(sectionIndex, 'title', e.target.value)}
                                            placeholder="Section Title (e.g., Explore, Legal)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNavSection(sectionIndex)}
                                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {section.links.map((link, linkIndex) => (
                                            <div key={linkIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 border rounded px-3 py-2"
                                                    value={link.label}
                                                    onChange={e => updateNavLink(sectionIndex, linkIndex, 'label', e.target.value)}
                                                    placeholder="Link Label"
                                                />
                                                <input
                                                    type="text"
                                                    className="flex-1 border rounded px-3 py-2"
                                                    value={link.href}
                                                    onChange={e => updateNavLink(sectionIndex, linkIndex, 'href', e.target.value)}
                                                    placeholder="/path"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNavLink(sectionIndex, linkIndex)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addNavLink(sectionIndex)}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Plus size={14} />
                                            Add Link
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.nav_sections && <div className="text-red-500 text-sm mt-2">{errors.nav_sections}</div>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                            disabled={processing}
                        >
                            <Save size={18} />
                            {processing ? 'Saving...' : 'Save Footer Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

