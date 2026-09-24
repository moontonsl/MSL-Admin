import React, { useState, useEffect, Fragment } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FaPlus, FaTrash, FaSearch, FaCheck, FaChevronDown, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import { Combobox, Transition, Dialog } from '@headlessui/react';
import { toast, Toaster } from 'react-hot-toast';

export default function Index({ auth, selectedSchools, selectedDates, flash }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selected, setSelected] = useState(null);

    // Date Form State
    const { data: dateData, setData: setDateData, post: postDate, processing: processingDate, reset: resetDate } = useForm({
        event_date: '',
    });

    // Confirmation Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [removeType, setRemoveType] = useState('school'); // 'school' or 'date'

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid rgba(242, 194, 26, 0.3)',
                },
                iconTheme: {
                    primary: '#F2C21A',
                    secondary: '#000',
                },
            });
        }
    }, [flash]);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchSchools();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchSchools = async () => {
        setIsSearching(true);
        try {
            const response = await fetch(`/schools/search?query=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching schools:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddSchool = (school) => {
        if (!school) return;

        router.post(route('admin.oppo-settings.store'), {
            school_id: school.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSearchTerm('');
                setSearchResults([]);
                setSelected(null);
            }
        });
    };

    const handleAddDate = (e) => {
        e.preventDefault();
        postDate(route('admin.oppo-settings.dates.store'), {
            preserveScroll: true,
            onSuccess: () => resetDate(),
        });
    };

    const handleRemoveClick = (item, type = 'school') => {
        setItemToRemove(item);
        setRemoveType(type);
        setIsConfirmOpen(true);
    };

    const confirmRemove = () => {
        if (!itemToRemove) return;

        const deleteRoute = removeType === 'school'
            ? route('admin.oppo-settings.destroy', itemToRemove.id)
            : route('admin.oppo-settings.dates.destroy', itemToRemove.id);

        router.delete(deleteRoute, {
            preserveScroll: true,
            onFinish: () => {
                setIsConfirmOpen(false);
                setItemToRemove(null);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Oppo Roadshow Settings" />
            <Toaster position="top-center" />

            {/* Responsive Fixes & Theme */}
            <style>{`
                .webBG {
                    pointer-events: none !important;
                }
                .glass-card {
                    background: rgba(10, 10, 10, 0.9);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
                }
                input:focus {
                    border-color: #F2C21A !important;
                    box-shadow: 0 0 0 2px rgba(242, 194, 26, 0.1) !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar-x::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar, .custom-scrollbar-x {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(242, 194, 26, 0.2) transparent;
                }
            `}</style>

            <div className="py-6 sm:py-16 md:py-24 relative z-50 px-2 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="glass-card overflow-hidden rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-14 animate-in fade-in duration-500">

                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-14 border-b border-white/5 pb-6 md:pb-10 gap-4">
                            <div className="w-full">
                                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 leading-tight">
                                    Oppo Roadshow <span className="text-[#F2C21A]">Management</span>
                                </h1>
                                <p className="text-gray-500 text-sm sm:text-lg font-medium max-w-lg">Manage schools and dates for the attendance registration.</p>
                            </div>
                            <div className="inline-block px-3 py-1.5 md:px-5 md:py-2 bg-[#F2C21A]/10 border border-[#F2C21A]/20 rounded-lg md:rounded-2xl">
                                <span className="text-[#F2C21A] text-[10px] md:text-xs font-bold uppercase tracking-widest">Super Admin panel</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

                            {/* LEFT COLUMN: SCHOOL MANAGEMENT */}
                            <div className="space-y-10 md:space-y-16">
                                {/* Search Section */}
                                <div className="w-full">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">
                                        Add Participating School (Venue)
                                    </label>

                                    <Combobox value={selected} onChange={handleAddSchool}>
                                        <div className="relative">
                                            <div className="relative w-full cursor-default overflow-hidden rounded-xl md:rounded-2xl bg-white/[0.03] text-left border border-white/10 focus-within:ring-1 focus-within:ring-[#F2C21A] text-sm md:text-lg transition-all duration-300">
                                                <Combobox.Input
                                                    className="w-full border-none py-3.5 md:py-5 pl-10 md:pl-14 pr-10 md:pr-12 text-sm md:text-lg leading-5 text-white bg-transparent focus:ring-0 outline-none placeholder:text-gray-700 font-medium"
                                                    displayValue={(school) => school?.name || ''}
                                                    onChange={(event) => setSearchTerm(event.target.value)}
                                                    placeholder="Search school name..."
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 md:pl-5">
                                                    <FaSearch className="h-4 w-4 text-[#F2C21A]/80" aria-hidden="true" />
                                                </div>
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3.5 md:pr-5">
                                                    <FaChevronDown
                                                        className="h-4 w-4 text-gray-600 hover:text-[#F2C21A]"
                                                        aria-hidden="true"
                                                    />
                                                </Combobox.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-2"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setSearchTerm('')}
                                            >
                                                <Combobox.Options className="absolute mt-2 max-h-80 w-full overflow-auto rounded-xl md:rounded-2xl bg-[#0d0d0d] border border-white/10 py-1 shadow-2xl z-[100] custom-scrollbar">
                                                    {searchResults.length === 0 && searchTerm.length > 1 ? (
                                                        <div className="py-4 px-6 text-gray-600 text-sm italic text-center">
                                                            No schools found.
                                                        </div>
                                                    ) : searchTerm.length < 2 ? (
                                                        <div className="py-4 px-6 text-gray-700 text-sm text-center">
                                                            Type to search...
                                                        </div>
                                                    ) : (
                                                        searchResults.map((school) => (
                                                            <Combobox.Option
                                                                key={school.id}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-3 md:py-4 px-6 md:px-14 border-b border-white/5 last:border-0 ${active ? 'bg-[#F2C21A]/10 text-white' : 'text-gray-400'
                                                                    }`
                                                                }
                                                                value={school}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <div className={`truncate ${selected ? 'font-bold text-[#F2C21A]' : ''}`}>
                                                                            <div className="text-sm md:text-base font-semibold">{school.name}</div>
                                                                            <div className="text-[10px] mt-0.5 text-gray-600 uppercase tracking-tighter">
                                                                                {school.region} • {school.island}
                                                                            </div>
                                                                        </div>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 text-[#F2C21A]">
                                                                                <FaCheck className="h-4 w-4" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))
                                                    )}
                                                </Combobox.Options>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                    {isSearching && (
                                        <div className="mt-3 flex items-center text-[10px] text-[#F2C21A]/40 font-bold uppercase tracking-widest px-1">
                                            <div className="w-3 h-3 border border-[#F2C21A] border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Searching...
                                        </div>
                                    )}
                                </div>

                                {/* Schools List */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <h3 className="text-lg font-bold text-white tracking-tight">Active Venues</h3>
                                        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                                            {selectedSchools.length} Schools
                                        </span>
                                    </div>
                                    <div className="overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.01]">
                                        <div className="overflow-x-auto custom-scrollbar-x">
                                            <table className="w-full divide-y divide-white/5">
                                                <thead className="bg-white/5">
                                                    <tr className="whitespace-nowrap">
                                                        <th className="px-5 md:px-8 py-3.5 md:py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">School</th>
                                                        <th className="px-5 md:px-8 py-3.5 md:py-5 text-center text-[9px] font-black text-gray-500 uppercase tracking-widest">Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {selectedSchools.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="2" className="px-6 py-10 text-center text-gray-600 text-sm font-medium italic">
                                                                No venues added yet.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        selectedSchools.map((item) => (
                                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                                                <td className="px-5 md:px-8 py-4 md:py-5 text-sm font-bold text-white border-r border-white/5">
                                                                    <div className="truncate max-w-[200px] md:max-w-xs">{item.school?.name}</div>
                                                                    <div className="text-[10px] text-gray-600 font-medium group-hover:text-gray-500">{item.school?.region?.name}</div>
                                                                </td>
                                                                <td className="px-5 md:px-8 py-4 md:py-5 text-center">
                                                                    <button
                                                                        onClick={() => handleRemoveClick(item, 'school')}
                                                                        className="text-red-500/20 hover:text-red-500 transition-all p-2 rounded-lg"
                                                                    >
                                                                        <FaTrash size={14} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: DATE MANAGEMENT */}
                            <div className="space-y-10 md:space-y-16">
                                {/* Date Add Section */}
                                <div className="w-full">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">
                                        Add Event Date
                                    </label>
                                    <form onSubmit={handleAddDate} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={dateData.event_date}
                                                onChange={e => setDateData('event_date', e.target.value)}
                                                placeholder="Ex: November 25, 2025"
                                                className="w-full py-3.5 md:py-5 pl-10 md:pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white text-sm md:text-base focus:ring-1 focus:ring-[#F2C21A] outline-none"
                                                required
                                            />
                                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2C21A]/60" />
                                        </div>
                                        <button
                                            disabled={processingDate}
                                            className="px-6 md:px-8 bg-[#F2C21A] text-black font-black uppercase text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-white transition-all disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </form>
                                </div>

                                {/* Dates List */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <h3 className="text-lg font-bold text-white tracking-tight">Active Dates</h3>
                                        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                                            {selectedDates.length} Dates
                                        </span>
                                    </div>
                                    <div className="overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.01]">
                                        <div className="overflow-x-auto custom-scrollbar-x">
                                            <table className="w-full divide-y divide-white/5">
                                                <thead className="bg-white/5">
                                                    <tr className="whitespace-nowrap">
                                                        <th className="px-5 md:px-8 py-3.5 md:py-5 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">Scheduled Date</th>
                                                        <th className="px-5 md:px-8 py-3.5 md:py-5 text-center text-[9px] font-black text-gray-500 uppercase tracking-widest">Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {selectedDates.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="2" className="px-6 py-10 text-center text-gray-600 text-sm font-medium italic">
                                                                No dates scheduled.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        selectedDates.map((item) => (
                                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                                <td className="px-5 md:px-8 py-4 md:py-5 text-sm font-bold text-white border-r border-white/5 leading-relaxed">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#F2C21A]"></div>
                                                                        {item.event_date}
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 md:px-8 py-4 md:py-5 text-center">
                                                                    <button
                                                                        onClick={() => handleRemoveClick(item, 'date')}
                                                                        className="text-red-500/20 hover:text-red-500 transition-all p-2 rounded-lg"
                                                                    >
                                                                        <FaTrash size={14} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            <Transition show={isConfirmOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[10000]" onClose={() => setIsConfirmOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto px-4">
                        <div className="flex min-h-full items-center justify-center py-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl md:rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 text-center shadow-2xl transition-all">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500/10 rounded-xl md:rounded-2xl mb-6 mx-auto flex items-center justify-center border border-red-500/20">
                                        <FaExclamationTriangle className="text-red-500 text-xl md:text-2xl" />
                                    </div>

                                    <Dialog.Title as="h3" className="text-xl font-black text-white mb-2 tracking-tight">
                                        Delete Entry?
                                    </Dialog.Title>

                                    <p className="text-gray-500 text-sm md:text-base mb-8 px-2 leading-relaxed">
                                        Remove <span className="text-white font-bold">{removeType === 'school' ? itemToRemove?.school?.name : itemToRemove?.event_date}</span> from the active list?
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={confirmRemove}
                                            className="w-full bg-red-600 text-white py-3 md:py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                                        >
                                            Confirm Delete
                                        </button>
                                        <button
                                            onClick={() => setIsConfirmOpen(false)}
                                            className="w-full bg-white/5 text-gray-400 py-3 md:py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AuthenticatedLayout>
    );
}
