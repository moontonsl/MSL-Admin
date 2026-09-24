import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaGripVertical } from 'react-icons/fa';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Carousel Item Component
function SortableCarouselItem({ carousel, onEdit, onDelete, onToggleActive }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: carousel.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative">
                <img
                    src={`/storage/carousel/${carousel.image_path}`}
                    alt={carousel.title || 'Carousel image'}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                        onClick={() => onToggleActive(carousel)}
                        className={`p-2 rounded-full text-white ${
                            carousel.is_active 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                        title={carousel.is_active ? 'Hide from carousel' : 'Show in carousel'}
                    >
                        {carousel.is_active ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
                <div className="absolute top-2 left-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                    >
                        <FaGripVertical />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                    {carousel.title || 'Untitled'}
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                    Order: {carousel.order} • {carousel.is_active ? 'Active' : 'Inactive'}
                </p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(carousel)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FaEdit className="mr-1" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(carousel)}
                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                        <FaTrash className="mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CarouselIndex({ carousels }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCarousel, setEditingCarousel] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [localCarousels, setLocalCarousels] = useState(carousels);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        image: null,
        order: carousels.length
    });

    // Sync local carousels with props
    useEffect(() => {
        setLocalCarousels(carousels);
    }, [carousels]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingCarousel) {
            put(route('admin.carousel.update', editingCarousel.id), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setEditingCarousel(null);
                    setImagePreview(null);
                    router.reload();
                }
            });
        } else {
            post(route('admin.carousel.store'), {
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
            setData('image', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (carousel) => {
        setEditingCarousel(carousel);
        setData({
            title: carousel.title || '',
            image: null,
            order: carousel.order
        });
        setImagePreview(carousel.image_path ? `/storage/carousel/${carousel.image_path}` : null);
    };

    const handleCancel = () => {
        reset();
        setEditingCarousel(null);
        setShowAddForm(false);
        setImagePreview(null);
    };

    const handleDelete = (carousel) => {
        if (confirm('Are you sure you want to delete this carousel image?')) {
            router.delete(route('admin.carousel.delete', carousel.id), {
                onSuccess: () => router.reload()
            });
        }
    };

    const toggleActive = (carousel) => {
        put(route('admin.carousel.update', carousel.id), {
            is_active: !carousel.is_active,
            onSuccess: () => router.reload()
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = localCarousels.findIndex(item => item.id === active.id);
            const newIndex = localCarousels.findIndex(item => item.id === over.id);
            
            const newCarousels = arrayMove(localCarousels, oldIndex, newIndex);
            setLocalCarousels(newCarousels);

            // Update order in database using Inertia
            const updatedCarousels = newCarousels.map((carousel, index) => ({
                id: carousel.id,
                order: index
            }));

            router.post(route('admin.carousel.reorder'), {
                carousels: updatedCarousels
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Update local state with fresh data
                    router.reload({ only: ['carousels'] });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Carousel Management" />

            <div className="min-h-screen py-4">
                <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Carousel Management</h1>
                        <p className="mt-2 text-sm text-gray-600">Manage carousel images. All images must be exactly 1920x1080 pixels.</p>
                    </div>

                    {/* Add New Button */}
                    {!showAddForm && !editingCarousel && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaPlus className="mr-2" />
                                Add New Carousel Image
                            </button>
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    {(showAddForm || editingCarousel) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingCarousel ? 'Edit Carousel Image' : 'Add New Carousel Image'}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter a title for this carousel image..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Order Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            id="order"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value))}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        {errors.order && (
                                            <p className="text-sm text-red-600 mt-1">{errors.order}</p>
                                        )}
                                    </div>

                                    {/* Image Upload Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                            Carousel Image <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB) - Must be 1920x1080 pixels</p>
                                                    </div>
                                                    <input 
                                                        id="image" 
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
                                        {errors.image && (
                                            <p className="text-sm text-red-600 mt-1">{errors.image}</p>
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
                                            {processing ? 'Saving...' : (editingCarousel ? 'Update Image' : 'Add Image')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Carousel Images List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Current Carousel Images</h3>
                                <p className="text-sm text-gray-500">Drag the grip icon to reorder images</p>
                            </div>
                            
                            {localCarousels.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No carousel images found. Add your first image above.</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={localCarousels.map(carousel => carousel.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {localCarousels.map((carousel) => (
                                                <SortableCarouselItem
                                                    key={carousel.id}
                                                    carousel={carousel}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onToggleActive={toggleActive}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
