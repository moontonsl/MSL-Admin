import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Header, Footer, MSLModal } from "@/Components";
import { ChevronRight, ChevronLeft, MapPin, Globe, School as SchoolIcon, Plus, Check, ChevronsUpDown, Pencil, Trash2, Search, X } from "lucide-react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import axios from "axios";

export default function Create({ islands, regions, mapLocations = [], communities = { data: [] }, filters = {} }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        island_id: "",
        school_id: "",
        location: "", // Read-only for display, derived from school
        map_code: "",
        school_link: "",
        // New School fields
        is_new_school: false,
        new_school_name: "",
        region_id: "",
        province_id: "",
        municipality_id: "",
    });

    const [availableSchools, setAvailableSchools] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [showNewSchoolForm, setShowNewSchoolForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [query, setQuery] = useState('');
    const [schoolQuery, setSchoolQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [communityToDelete, setCommunityToDelete] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('community.create'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('community.create'), {}, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    const filteredSchools =
        schoolQuery === ''
            ? availableSchools.slice(0, 15)
            : availableSchools
                .filter((school) => school.name.toLowerCase().includes(schoolQuery.toLowerCase()))
                .slice(0, 15)

    const filteredLocations =
        query === ''
            ? mapLocations.slice(0, 15)
            : mapLocations
                .filter((loc) => {
                    return (loc.name.toLowerCase().includes(query.toLowerCase()) || loc.code.toLowerCase().includes(query.toLowerCase()))
                })
                .slice(0, 15)

    // Fetch schools when island changes
    useEffect(() => {
        if (data.island_id) {
            setLoadingSchools(true);
            axios.get(route('community.getSchools', { island_id: data.island_id }))
                .then(res => {
                    setAvailableSchools(res.data);
                    // Reset school selection if not in new list
                    if (!res.data.find(s => s.id == data.school_id)) {
                        setData(d => ({ ...d, school_id: "", location: "" }));
                    }
                })
                .finally(() => setLoadingSchools(false));
        } else {
            setAvailableSchools([]);
        }
    }, [data.island_id]);

    // Handle school selection
    const handleSchoolChange = (value) => {
        if (value === "new") {
            setShowNewSchoolForm(true);
            setData(d => ({
                ...d,
                school_id: "",
                location: "",
                is_new_school: true
            }));
        } else {
            setShowNewSchoolForm(false);
            const school = availableSchools.find(s => s.id == value);
            setData(d => ({
                ...d,
                school_id: value,
                location: school ? school.location : "",
                is_new_school: false
            }));
        }
    };

    // Fetch Provinces when Region changes (New School)
    useEffect(() => {
        if (data.region_id) {
            axios.get(route('community.getProvinces', { region_id: data.region_id }))
                .then(res => setProvinces(res.data));
            setData(d => ({ ...d, province_id: "", municipality_id: "" }));
        }
    }, [data.region_id]);

    // Fetch Municipalities when Province changes (New School)
    useEffect(() => {
        if (data.province_id) {
            axios.get(route('community.getMunicipalities', { province_id: data.province_id }))
                .then(res => setMunicipalities(res.data));
            setData(d => ({ ...d, municipality_id: "" }));
        }
    }, [data.province_id]);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('community.update', data.id), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route('community.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (community) => {
        setIsEditing(true);
        const islandId = community.school?.region?.island_id || "";

        // Fetch schools for the island first to ensure the dropdown is populated
        setLoadingSchools(true);
        axios.get(route('community.getSchools', { island_id: islandId }))
            .then(res => {
                setAvailableSchools(res.data);
                setData({
                    id: community.id,
                    island_id: islandId,
                    school_id: community.school_id,
                    location: community.location,
                    map_code: community.map_code,
                    school_link: community.school_link,
                    is_new_school: false,
                    new_school_name: "",
                    region_id: community.school?.region_id || "",
                    province_id: "",
                    municipality_id: community.school?.municipality_id || "",
                });
            })
            .finally(() => {
                setLoadingSchools(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    };

    const handleDelete = (community) => {
        setCommunityToDelete(community);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (communityToDelete) {
            destroy(route('community.destroy', communityToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCommunityToDelete(null);
                }
            });
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset();
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            <Head title="Add Community School" />
            <div className="relative z-20">
                <Header />
            </div>

            <main className="flex-grow relative z-10 py-12 px-6 flex flex-col items-center justify-start gap-12"
                style={{
                    backgroundImage: "url('/images/MCC/MCC2_BG.png')", // Reusing bg
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                <div className="w-full max-w-[1600px] grid grid-cols-1 xl:grid-cols-12 gap-10 relative z-10 items-start">
                    {/* Add/Edit Form */}
                    <div className="xl:col-span-4 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 p-8 shadow-2xl sticky top-24">
                        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            {isEditing ? 'Edit Community' : 'Add Community'}
                        </h1>
                        <p className="text-gray-400 mb-8 sm:text-sm">
                            {isEditing ? 'Update the details for this community record.' : 'Contribute to the school directory.'}
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            {/* 1. Select Island */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">1. Select Island</label>
                                <select
                                    value={data.island_id}
                                    onChange={e => setData("island_id", e.target.value)}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white"
                                    required={!showNewSchoolForm}
                                >
                                    <option value="">Select an Island...</option>
                                    {islands.map(island => (
                                        <option key={island.id} value={island.id}>{island.name}</option>
                                    ))}
                                </select>
                                {errors.island_id && <p className="text-red-400 text-sm mt-1">{errors.island_id}</p>}
                            </div>

                            {/* 2. Select School (or Add New) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">2. Select School</label>
                                <div className="relative">
                                    <Combobox
                                        value={showNewSchoolForm ? "new" : data.school_id}
                                        onChange={handleSchoolChange}
                                        disabled={!data.island_id && !showNewSchoolForm}
                                        onClose={() => setSchoolQuery('')}
                                    >
                                        <div className="relative">
                                            <SchoolIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500 z-10" />
                                            <ComboboxInput
                                                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white py-2 pr-10"
                                                placeholder={data.island_id ? (loadingSchools ? "Loading schools..." : "Select a School...") : "Please select an island first"}
                                                displayValue={(val) => {
                                                    if (val === "new") return "+ Add New School";
                                                    const school = availableSchools.find(s => s.id == val);
                                                    return school ? school.name : "";
                                                }}
                                                onChange={(event) => setSchoolQuery(event.target.value)}
                                                required={!showNewSchoolForm}
                                            />
                                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronsUpDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                            </ComboboxButton>
                                        </div>
                                        <ComboboxOptions anchor="bottom" className="w-[var(--input-width)] bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto z-50 shadow-xl empty:invisible">
                                            {filteredSchools.length === 0 && schoolQuery !== '' ? (
                                                <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                                                    Nothing found.
                                                </div>
                                            ) : (
                                                <>
                                                    {filteredSchools.map((school) => (
                                                        <ComboboxOption
                                                            key={school.id}
                                                            value={school.id}
                                                            className={({ focus }) =>
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${focus ? 'bg-blue-600 text-white' : 'text-gray-300'}`
                                                            }
                                                        >
                                                            {({ selected, focus }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                        {school.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-blue-400'}`}>
                                                                            <Check className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </ComboboxOption>
                                                    ))}
                                                    <ComboboxOption
                                                        value="new"
                                                        className={({ focus }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 border-t border-gray-700 ${focus ? 'bg-blue-600 text-white' : 'font-bold text-blue-300'}`
                                                        }
                                                    >
                                                        {({ selected, focus }) => (
                                                            <>
                                                                <span className="block truncate">+ Add New School</span>
                                                                {selected ? (
                                                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-blue-400'}`}>
                                                                        <Check className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </ComboboxOption>
                                                </>
                                            )}
                                        </ComboboxOptions>
                                    </Combobox>
                                </div>
                                {errors.school_id && <p className="text-red-400 text-sm mt-1">{errors.school_id}</p>}
                            </div>

                            {/* NEW SCHOOL FORM */}
                            {showNewSchoolForm && (
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                                        <Plus className="w-5 h-5" /> New School Details
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">School Name</label>
                                        <input
                                            type="text"
                                            value={data.new_school_name}
                                            onChange={e => setData("new_school_name", e.target.value)}
                                            className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                            placeholder="Enter full school name"
                                            required
                                        />
                                        {errors.new_school_name && <p className="text-red-400 text-sm mt-1">{errors.new_school_name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
                                            <select
                                                value={data.region_id}
                                                onChange={e => setData("region_id", e.target.value)}
                                                className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                                required
                                            >
                                                <option value="">Select Region...</option>
                                                {regions.map(r => (
                                                    <option key={r.id} value={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                            {errors.region_id && <p className="text-red-400 text-sm mt-1">{errors.region_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Province</label>
                                            <select
                                                value={data.province_id}
                                                onChange={e => setData("province_id", e.target.value)}
                                                className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                                disabled={!data.region_id}
                                                required
                                            >
                                                <option value="">Select Province...</option>
                                                {provinces.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Municipality (Location)</label>
                                            <select
                                                value={data.municipality_id}
                                                onChange={e => setData("municipality_id", e.target.value)}
                                                className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                                disabled={!data.province_id}
                                                required
                                            >
                                                <option value="">Select Municipality...</option>
                                                {municipalities.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                            {errors.municipality_id && <p className="text-red-400 text-sm mt-1">{errors.municipality_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Location (Auto-filled or hidden if new school) */}
                            {!showNewSchoolForm && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">3. Location (Municipality)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={data.location}
                                            readOnly
                                            className="w-full pl-10 bg-gray-800/50 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                                            placeholder="Auto-filled from school selection"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 4. Map Code (Searchable) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">4. Map Code (Select Location)</label>
                                <Combobox
                                    value={data.map_code}
                                    onChange={(val) => setData("map_code", val)}
                                    onClose={() => setQuery('')}
                                >
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500 z-10" />
                                        <ComboboxInput
                                            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white py-2 pl-10 pr-10"
                                            placeholder="Search location..."
                                            displayValue={(code) => {
                                                const loc = mapLocations.find(l => l.code === code);
                                                return loc ? `${loc.name} - ${loc.code}` : code;
                                            }}
                                            onChange={(event) => setQuery(event.target.value)}
                                            required
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronsUpDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                        </ComboboxButton>
                                    </div>
                                    <ComboboxOptions anchor="bottom" className="w-[var(--input-width)] bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto z-50 shadow-xl empty:invisible">
                                        {filteredLocations.length === 0 && query !== '' ? (
                                            <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                                                Nothing found.
                                            </div>
                                        ) : (
                                            filteredLocations.map((loc) => (
                                                <ComboboxOption
                                                    key={loc.code}
                                                    value={loc.code}
                                                    className={({ focus }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${focus ? 'bg-blue-600 text-white' : 'text-gray-300'
                                                        }`
                                                    }
                                                >
                                                    {({ selected, focus }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                            >
                                                                {loc.name} - {loc.code}
                                                            </span>
                                                            {selected ? (
                                                                <span
                                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-blue-400'
                                                                        }`}
                                                                >
                                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </ComboboxOption>
                                            ))
                                        )}
                                    </ComboboxOptions>
                                </Combobox>
                                {errors.map_code && <p className="text-red-400 text-sm mt-1">{errors.map_code}</p>}
                            </div>

                            {/* 5. School Link */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">5. School Link (Website/Page)</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        type="url"
                                        value={data.school_link}
                                        onChange={e => setData("school_link", e.target.value)}
                                        className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                {errors.school_link && <p className="text-red-400 text-sm mt-1">{errors.school_link}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        {isEditing ? 'Update Community Record' : 'Submit Community Record'} <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Communities Table */}
                    <div className="xl:col-span-8 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 p-8 shadow-2xl overflow-hidden self-start">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <SchoolIcon className="w-6 h-6 text-blue-400" /> Existing Communities
                            </h2>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-72 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search communities..."
                                    className="w-full pl-10 pr-10 py-2 bg-gray-800 border-gray-700 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-4 px-4 text-gray-400 font-medium">School</th>
                                        <th className="py-4 px-4 text-gray-400 font-medium">Island</th>
                                        <th className="py-4 px-4 text-gray-400 font-medium">Location</th>
                                        <th className="py-4 px-4 text-gray-400 font-medium">Map Code</th>
                                        <th className="py-4 px-4 text-gray-400 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {communities.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500">No community records found.</td>
                                        </tr>
                                    ) : (
                                        communities.data.map((community) => (
                                            <tr key={community.id} className="hover:bg-gray-800/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-white">{community.school?.name || 'Unknown School'}</div>
                                                    <a href={community.school_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                                                        <Globe className="w-3 h-3" /> Website
                                                    </a>
                                                </td>
                                                <td className="py-4 px-4 text-gray-300">{community.island}</td>
                                                <td className="py-4 px-4 text-gray-300">{community.location}</td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-purple-400">
                                                        {community.map_code}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(community)}
                                                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(community)}
                                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {communities.links && communities.total > communities.per_page && (
                            <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm font-medium text-gray-400">
                                    Showing {communities.from || 0}-{communities.to || 0} of {communities.total} records
                                </div>

                                <div className="flex items-center gap-2">
                                    {communities.links.map((link, index) => {
                                        let content = null;
                                        let isArrow = false;

                                        if (link.label.includes('Previous')) {
                                            content = <ChevronLeft className="w-5 h-5" />;
                                            isArrow = true;
                                        } else if (link.label.includes('Next')) {
                                            content = <ChevronRight className="w-5 h-5" />;
                                            isArrow = true;
                                        } else {
                                            content = <span className="font-semibold">{link.label}</span>;
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url)}
                                                disabled={!link.url || link.active}
                                                className={`
                                                flex items-center justify-center rounded-lg transition-all duration-300
                                                ${isArrow ? 'p-2' : 'w-10 h-10'}
                                                ${link.active
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                        : !link.url
                                                            ? "text-gray-600 cursor-not-allowed"
                                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                                                    }
                                            `}
                                            >
                                                {content}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <MSLModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the community record for "${communityToDelete?.school?.name || 'this school'}"? This action cannot be undone.`}
                    type="error"
                    onConfirm={confirmDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </main>

            <Footer />
        </div>
    );
}
