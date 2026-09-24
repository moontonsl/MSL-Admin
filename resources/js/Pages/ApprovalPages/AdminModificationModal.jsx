import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

function debounce(func, delay) {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

export default function AdminModificationModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [searchUsername, setSearchUsername] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form State
    const [modificationType, setModificationType] = useState('School');
    const [wrongFirstName, setWrongFirstName] = useState('');
    const [wrongLastName, setWrongLastName] = useState('');
    const [correctFirstName, setCorrectFirstName] = useState('');
    const [correctLastName, setCorrectLastName] = useState('');
    const [wrongValue, setWrongValue] = useState('');
    const [correctValue, setCorrectValue] = useState('');
    const [schoolResults, setSchoolResults] = useState([]);
    const [showSchoolResults, setShowSchoolResults] = useState(false);
    const schoolCache = useRef({});

    const debouncedSchoolSearch = useMemo(() => debounce(async (value) => {
        if (schoolCache.current[value]) {
            setSchoolResults(schoolCache.current[value]);
            return;
        }

        try {
            const response = await fetch(`/schools/search?query=${encodeURIComponent(value)}`);
            const schools = await response.json();
            schoolCache.current[value] = schools;
            setSchoolResults(schools);
        } catch (error) {
            setSchoolResults([]);
        }
    }, 300), []);

    useEffect(() => {
        if (isOpen && step === 1) {
            setSearchUsername('');
            setSearchedUser(null);
            setError(null);
            setSuccessMessage(null);
        }
    }, [isOpen, step]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;

        setLoading(true);
        setError(null);
        setSearchedUser(null);

        try {
            const response = await fetch(`/api/users/lookup?username=${encodeURIComponent(searchUsername)}`);
            const data = await response.json();

            if (response.ok) {
                setSearchedUser(data);
                setStep(2);
                // Pre-fill based on searched user
                setWrongFirstName(data.name || '');
                setWrongLastName(data.surname || '');
                setWrongValue(data.university || data.school || data.course || '');
                setModificationType('School'); // Default to School like the screenshot
            } else {
                setError(data.error || 'User not found');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchedUser) return;

        setLoading(true);
        setError(null);

        let finalWrongValue = wrongValue;
        let finalCorrectValue = correctValue;

        if (modificationType === 'Full Name') {
            finalWrongValue = `${wrongFirstName} ${wrongLastName}`.trim();
            finalCorrectValue = `${correctFirstName} ${correctLastName}`.trim();
        }

        try {
            const response = await fetch('/api/modification-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: searchedUser.id,
                    modification_type: modificationType,
                    wrong_value: finalWrongValue,
                    correct_value: finalCorrectValue,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Modification applied successfully!');
                setTimeout(() => {
                    handleClose();
                    if (onSuccess) onSuccess();
                }, 2000);
            } else {
                setError(data.error || 'Failed to apply modification');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setStep(1);
        setSearchUsername('');
        setSearchedUser(null);
        setError(null);
        setSuccessMessage(null);
        setModificationType('School');
        setCorrectValue('');
        setSchoolResults([]);
        setShowSchoolResults(false);
        setWrongValue('');
        setWrongFirstName('');
        setWrongLastName('');
        setCorrectFirstName('');
        setCorrectLastName('');
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetState, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

            <div className="relative z-20 w-full max-w-lg bg-[rgba(10,10,10,0.85)] border border-[#242424] rounded-2xl shadow-2xl backdrop-blur-[10px] overflow-visible font-montserrat">
                {/* Header */}
                <div className="flex items-center p-6 pb-2">
                    <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                        <AlertTriangle className="w-6 h-6 text-[#facc15]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                            MSL Account Modification Request Form
                        </h3>
                    </div>
                    <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 pt-0">
                    <p className="text-gray-300 mb-6 text-sm">
                        Make sure that the username is correct for you to receive an email after action is made on the modification request.
                    </p>

                    {successMessage ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-[#facc15]">
                            <CheckCircle className="w-16 h-16 mb-4 animate-bounce" />
                            <p className="text-xl font-semibold">{successMessage}</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm font-semibold">
                                            MSL Account Username
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchUsername}
                                                onChange={(e) => setSearchUsername(e.target.value)}
                                                className="w-full px-4 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                                placeholder="Enter MSL username"
                                                autoFocus
                                                required
                                            />
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !searchUsername.trim()}
                                            className="flex items-center gap-2 bg-[#facc15] text-black font-semibold rounded-md px-6 py-2 hover:bg-[#e0b90f] transition-all duration-200 border border-[#facc15]"
                                        >
                                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Next
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Modification Type */}
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm font-semibold">
                                            What modifications do you want to apply?
                                        </label>
                                        <select
                                            value={modificationType}
                                            onChange={(e) => {
                                                setModificationType(e.target.value);
                                                // Update wrong values
                                                if (e.target.value === 'Full Name') {
                                                    setWrongFirstName(searchedUser.name || '');
                                                    setWrongLastName(searchedUser.surname || '');
                                                } else if (e.target.value === 'School') {
                                                    setWrongValue(searchedUser.school || searchedUser.university || '');
                                                } else if (e.target.value === 'Student ID') {
                                                    setWrongValue(searchedUser.studentId || '');
                                                } else {
                                                    setWrongValue(searchedUser.course || '');
                                                }
                                                setCorrectValue('');
                                                setCorrectFirstName('');
                                                setCorrectLastName('');
                                            }}
                                            className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] text-sm"
                                        >
                                            <option value="School" className="text-black">School</option>
                                            <option value="Full Name" className="text-black">Full Name</option>
                                            <option value="Course" className="text-black">Course</option>
                                            <option value="Student ID" className="text-black">Student ID</option>
                                        </select>
                                    </div>

                                    {/* User Info Card */}
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm font-semibold">
                                            MSL Account Username
                                        </label>
                                        <div className="relative">
                                            <div className="w-full px-4 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-t-md text-white/50 text-sm flex items-center justify-between">
                                                {searchedUser.username}
                                                <Search className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="bg-[#1a1a1a] border-x border-b border-[#242424] rounded-b-md p-3 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#facc15]/20 flex items-center justify-center text-[#facc15] font-bold border border-[#facc15]/30">
                                                    {searchedUser.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-semibold text-sm">{searchedUser.name} {searchedUser.surname}</div>
                                                    <div className="text-gray-500 text-xs">@{searchedUser.username}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields based on type */}
                                    {modificationType === 'Full Name' ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-gray-300 mb-1 text-xs uppercase font-bold text-white/40">Wrong First Name</label>
                                                    <input type="text" value={wrongFirstName} readOnly className="w-full px-3 py-2 bg-black/20 border border-[#242424] rounded-md text-white/50 text-sm cursor-not-allowed" />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-300 mb-1 text-xs uppercase font-bold text-white/40">Wrong Last Name</label>
                                                    <input type="text" value={wrongLastName} readOnly className="w-full px-3 py-2 bg-black/20 border border-[#242424] rounded-md text-white/50 text-sm cursor-not-allowed" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-gray-300 mb-1 text-xs uppercase font-bold">Correct First Name</label>
                                                    <input
                                                        type="text"
                                                        value={correctFirstName}
                                                        onChange={(e) => setCorrectFirstName(e.target.value)}
                                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] text-sm"
                                                        placeholder="Enter correct first name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-300 mb-1 text-xs uppercase font-bold">Correct Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={correctLastName}
                                                        onChange={(e) => setCorrectLastName(e.target.value)}
                                                        className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] text-sm"
                                                        placeholder="Enter correct last name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-300 mb-1 text-xs uppercase font-bold text-white/40">Wrong {modificationType}</label>
                                                <input
                                                    type="text"
                                                    value={wrongValue}
                                                    readOnly
                                                    className="w-full px-3 py-2 bg-black/20 border border-[#242424] rounded-md text-white/50 text-sm cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-gray-300 mb-1 text-xs uppercase font-bold">Correct {modificationType}</label>
                                                <input
                                                    type="text"
                                                    value={correctValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setCorrectValue(value);
                                                        setShowSchoolResults(value.trim() !== '');
                                                        if (modificationType === 'School' && value.trim()) {
                                                            debouncedSchoolSearch(value);
                                                        } else {
                                                            setSchoolResults([]);
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        if (modificationType === 'School' && correctValue.trim()) {
                                                            setShowSchoolResults(true);
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white focus:outline-none focus:border-[#facc15] text-sm"
                                                    placeholder={`Enter correct ${modificationType.toLowerCase()}`}
                                                    required
                                                />
                                                {modificationType === 'School' && showSchoolResults && (
                                                    <div className="absolute z-30 w-full mt-1 bg-[rgba(15,15,15,0.98)] border border-[#FACC15]/30 rounded-lg shadow-2xl max-h-48 overflow-y-auto backdrop-blur-sm">
                                                        {schoolResults.length > 0 ? (
                                                            schoolResults.slice(0, 10).map((school) => (
                                                                <button
                                                                    key={school.id}
                                                                    type="button"
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                    onClick={() => {
                                                                        setCorrectValue(school.name);
                                                                        setShowSchoolResults(false);
                                                                        setSchoolResults([]);
                                                                    }}
                                                                    className="w-full px-3 py-2 text-left text-white hover:bg-[rgba(250,204,21,0.1)] transition-colors border-b border-[rgba(250,204,21,0.05)] last:border-b-0"
                                                                >
                                                                    <div className="font-medium text-sm">{school.name}</div>
                                                                    <div className="text-xs text-gray-500">{school.island} &bull; {school.region}</div>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="p-3 text-center text-gray-400 text-sm">No schools found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors text-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-[#facc15] text-black font-semibold rounded-md px-6 py-2 hover:bg-[#e0b90f] transition-all duration-200 border border-[#facc15]"
                                        >
                                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Apply Modification
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

