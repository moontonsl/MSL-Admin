import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";

function PlayerSearchInput({ label, placeholder, subtext, value, onChange, onSelect, excludeIds, university }) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (searchTerm) => {
        if (searchTerm.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const excludeParams = excludeIds.length > 0 ? `&exclude=${excludeIds.join(',')}` : '';
            const universityParam = university ? `&university=${encodeURIComponent(university)}` : '';
            const url = `/school-players?search=${encodeURIComponent(searchTerm)}${excludeParams}${universityParam}`;
            const response = await fetch(url);
            const players = await response.json();
            setSearchResults(players);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePlayerSelect = (player) => {
        onSelect(player);
        setShowResults(false);
        onChange(player.username);
    };

    return (
        <div className="w-full relative">
            {label && (
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1 font-['Montserrat']">
                    {label}
                </label>
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    handleSearch(e.target.value);
                }}
                onFocus={() => {
                    if (searchResults.length > 0) setShowResults(true);
                }}
                onBlur={() => {
                    // Delay hiding results to allow clicking on them
                    setTimeout(() => setShowResults(false), 200);
                }}
                className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60 font-['Montserrat']"
                placeholder={placeholder || label}
            />
            {subtext && (
                <p className="text-[10px] text-white/60 mt-1 font-['Montserrat']">{subtext}</p>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-neutral-800 border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-3 text-white/60 text-sm">Searching...</div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((player) => (
                            <button
                                key={player.id}
                                type="button"
                                onClick={() => handlePlayerSelect(player)}
                                className="w-full text-left p-3 hover:bg-white/10 text-white text-sm border-b border-white/10 last:border-b-0"
                            >
                                <div className="font-medium">{player.username}</div>
                                <div className="text-white/60 text-xs">{player.name} {player.surname}</div>
                            </button>
                        ))
                    ) : (
                        <div className="p-3 text-white/60 text-sm">No players found</div>
                    )}
                </div>
            )}
        </div>
    );
}

function InputGroup({ label, placeholder, subtext, value, onChange }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1 font-['Montserrat']">
                    {label}
                </label>
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60 font-['Montserrat']"
                placeholder={placeholder || label}
            />
            {subtext && (
                <p className="text-[10px] text-white/60 mt-1 font-['Montserrat']">{subtext}</p>
            )}
        </div>
    );
}

export default function TeamRegistration() {
    const { auth } = usePage().props;
    const user = auth.user;

    // Get captain data from session storage
    const [captain, setCaptain] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingTeam, setExistingTeam] = useState(null);

    useEffect(() => {
        try {
            const captainData = sessionStorage.getItem('campusTournamentCaptain');
            const editTeamData = sessionStorage.getItem('campusTournamentEditTeam');

            if (captainData) {
                setCaptain(JSON.parse(captainData));
            }

            if (editTeamData) {
                const teamData = JSON.parse(editTeamData);
                setExistingTeam(teamData);
                setIsEditMode(true);

                // Find captain from team members
                const captainMember = teamData.members?.find(member => member.role === 'captain');
                if (captainMember?.player) {
                    setCaptain(captainMember.player);
                }
            }
        } catch (error) {
            console.error('Error loading team data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const [formData, setFormData] = useState({
        captain: '',
        discordId: '',
        teamName: '',
        player2: '',
        player3: '',
        player4: '',
        player5: ''
    });

    const [selectedPlayers, setSelectedPlayers] = useState({
        captain: null,
        player2: null,
        player3: null,
        player4: null,
        player5: null
    });

    // Update form data when captain is loaded or when editing existing team
    useEffect(() => {
        if (captain) {
            setFormData(prev => ({
                ...prev,
                captain: captain.username
            }));
            setSelectedPlayers(prev => ({
                ...prev,
                captain: captain
            }));
        }

        // Pre-fill form data when editing existing team
        if (isEditMode && existingTeam) {
            // Filter members by role to ensure correct mapping regardless of array order
            // This prevents the captain (who might be at index 0, 2, etc.) from being mapped to a "Member" slot
            const membersList = existingTeam.members || [];
            const memberPlayers = membersList
                .filter(m => m.role === 'member')
                .map(m => m.player);

            setFormData(prev => ({
                ...prev,
                discordId: existingTeam.discord_id || '',
                teamName: existingTeam.team_name || '',
                // Map the found members to slots 2-5
                player2: memberPlayers[0]?.username || '',
                player3: memberPlayers[1]?.username || '',
                player4: memberPlayers[2]?.username || '',
                player5: memberPlayers[3]?.username || ''
            }));

            // Pre-fill selected players
            setSelectedPlayers(prev => ({
                ...prev,
                captain: captain,
                player2: memberPlayers[0] || null,
                player3: memberPlayers[1] || null,
                player4: memberPlayers[2] || null,
                player5: memberPlayers[3] || null
            }));
        }
    }, [captain, isEditMode, existingTeam]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handlePlayerSelect = (field, player) => {
        setSelectedPlayers(prev => ({
            ...prev,
            [field]: player
        }));
    };

    const handlePlayerChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (selectedPlayers[field] && selectedPlayers[field].username !== value) {
            handlePlayerSelect(field, null);
        }
    };

    const getExcludeIds = () => {
        return Object.values(selectedPlayers)
            .filter(player => player !== null)
            .map(player => player.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const playerIds = Object.values(selectedPlayers)
            .filter(p => p !== null)
            .map(p => p.id);

        // Check if all players are selected
        const requiredPlayers = ['player2', 'player3', 'player4', 'player5'];
        for (const field of requiredPlayers) {
            if (!selectedPlayers[field]) {
                const playerNum = field.replace('player', '');
                setModalMessage(`Player ${playerNum} is required. Please search and select a valid player from the dropdown. If they don't appear, they might already be in an active team.`);
                setShowErrorModal(true);
                setIsSubmitting(false);
                return;
            }
        }

        const hasDuplicates = new Set(playerIds).size !== playerIds.length;
        if (hasDuplicates) {
            setModalMessage('Duplicate players found in the roster. Please ensure each player is unique.');
            setShowErrorModal(true);
            setIsSubmitting(false);
            return;
        }

        const url = isEditMode ? `/team-update/${existingTeam.id}` : '/team-registration';
        const routerMethod = isEditMode ? router.put : router.post;

        // Get user_id from URL if present (for unauthenticated access)
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                // Clear session storage only on complete success
                sessionStorage.removeItem('campusTournamentCaptain');
                sessionStorage.removeItem('campusTournamentEditTeam');
            },
            onError: (errors) => {
                const errorMessage = errors.message ||
                    Object.values(errors).flat().join(', ') ||
                    ((isEditMode ? 'Update' : 'Registration') + ' failed. Please try again.');
                setModalMessage(errorMessage);
                setShowErrorModal(true);
            },
            onFinish: () => setIsSubmitting(false)
        };

        const data = {
            teamName: formData.teamName,
            discordId: formData.discordId,
            captain: captain,
            players: selectedPlayers,
            user_id: userId // Send user_id if present
        };

        if (isEditMode) {
            router.put(url, data, options);
        } else {
            router.post(url, data, options);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <MainLayout>
                <Head title="Loading..." />
                <section
                    className="relative min-h-[calc(100vh-160px)] py-8 md:py-12"
                    style={{
                        backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="relative max-w-3xl mx-auto px-4 font-['Montserrat'] flex items-center justify-center min-h-[400px]">
                        <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                            <p className="text-lg">Loading team data...</p>
                        </div>
                    </div>
                </section>
            </MainLayout>
        );
    }

    // Show error if no captain data in edit mode
    if (isEditMode && !captain) {
        return (
            <MainLayout>
                <Head title="Error" />
                <section
                    className="relative min-h-[calc(100vh-160px)] py-8 md:py-12"
                    style={{
                        backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="relative max-w-3xl mx-auto px-4 font-['Montserrat'] flex items-center justify-center min-h-[400px]">
                        <div className="text-center text-white">
                            <h1 className="text-2xl font-bold mb-4">Error</h1>
                            <p className="text-lg mb-4">Unable to load team data for editing.</p>
                            <button
                                onClick={() => window.history.back()}
                                className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-6 py-3"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEditMode ? "Edit Team" : "Team Registration"} />
            <section
                className="relative min-h-[calc(100vh-160px)] py-8 md:py-12"
                style={{
                    backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative max-w-3xl mx-auto px-4 font-['Montserrat']">
                    <div className="flex flex-col items-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <img
                            src="/images/About Page/SL Logo.png"
                            alt="SL Logo"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none"
                        />
                        <h1 className="text-white font-bold font-['Montserrat'] tracking-tight text-[24px] md:text-[32px] lg:text-[40px]">
                            CAMPUS TOURNAMENT
                        </h1>
                        <p className="text-white/80 font-['Montserrat'] text-[14px] md:text-[16px] lg:text-[16px] text-center max-w-2xl">
                            {isEditMode
                                ? "Edit your team details for the ongoing Campus Tournament."
                                : "Campus Tournament is a local campus event where student players compete every two weeks for diamond rewards."
                            }
                        </p>
                    </div>

                    <div className="bg-neutral-900/70 rounded-xl border border-white/10 shadow-xl backdrop-blur p-4 md:p-6">
                        <div className="text-center text-white font-bold font-['Montserrat'] tracking-tight text-[20px] md:text-[24px] lg:text-[30px] uppercase rounded-md py-2 mb-3">
                            {(captain?.university || 'SCHOOL').toUpperCase()}
                        </div>

                        <div className="bg-yellow-400/15 border border-yellow-400/40 rounded-md p-3 md:p-4 mb-4">
                            <p className="text-[12px] md:text-sm font-semibold text-yellow-300 mb-1">Important Requirements:</p>
                            <ul className="list-disc list-inside text-[11px] md:text-[12px] text-yellow-100/90 space-y-1">
                                <li><strong>Verification Required:</strong> All team members must be verified users to participate in campus tournaments.</li>
                                <li>Each team may include only one senior high school student in their roster.</li>

                            </ul>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>

                            <div className="w-full">
                                <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1 font-['Montserrat']">
                                    Captain
                                </label>
                                <input
                                    type="text"
                                    value={formData.captain}
                                    disabled
                                    className="w-full rounded-full border border-white/30 bg-gray-600/50 text-white/60 placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60 font-['Montserrat'] cursor-not-allowed"
                                    placeholder="Captain"
                                />
                                <p className="text-[10px] text-white/60 mt-1 font-['Montserrat']">* Only the team captain must register their whole team</p>
                            </div>

                            <InputGroup
                                label="Discord ID (Optional)"
                                placeholder="Enter your Discord ID"
                                subtext="Format: username#0000 or User ID"
                                value={formData.discordId}
                                onChange={(value) => setFormData(prev => ({ ...prev, discordId: value }))}
                            />

                            <InputGroup
                                label="Team Name"
                                subtext="* Maximum of 4 words, must be culturally appropriate"
                                value={formData.teamName}
                                onChange={(value) => setFormData(prev => ({ ...prev, teamName: value }))}
                            />

                            <div className="pt-2 space-y-3">
                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 2</h3>
                                    <PlayerSearchInput
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school, verified, and have an MSL account"
                                        value={formData.player2}
                                        onChange={(value) => handlePlayerChange('player2', value)}
                                        onSelect={(player) => handlePlayerSelect('player2', player)}
                                        excludeIds={getExcludeIds()}
                                        university={captain?.university || user?.university}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 3</h3>
                                    <PlayerSearchInput
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school, verified, and have an MSL account"
                                        value={formData.player3}
                                        onChange={(value) => handlePlayerChange('player3', value)}
                                        onSelect={(player) => handlePlayerSelect('player3', player)}
                                        excludeIds={getExcludeIds()}
                                        university={captain?.university || user?.university}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 4</h3>
                                    <PlayerSearchInput
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school, verified, and have an MSL account"
                                        value={formData.player4}
                                        onChange={(value) => handlePlayerChange('player4', value)}
                                        onSelect={(player) => handlePlayerSelect('player4', player)}
                                        excludeIds={getExcludeIds()}
                                        university={captain?.university || user?.university}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-white/90 font-semibold text-sm mb-1">Player 5</h3>
                                    <PlayerSearchInput
                                        placeholder="Search the MSL Username of your teammate"
                                        subtext="* Player must be from your school, verified, and have an MSL account"
                                        value={formData.player5}
                                        onChange={(value) => handlePlayerChange('player5', value)}
                                        onSelect={(player) => handlePlayerSelect('player5', player)}
                                        excludeIds={getExcludeIds()}
                                        university={captain?.university || user?.university}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Registering...') : (isEditMode ? 'Update Team' : 'Submit')}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-white/70 text-[11px] md:text-xs mt-4 max-w-3xl mx-auto">
                        Make sure that you have read the
                        {' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-yellow-300 underline hover:text-yellow-200">
                            Rulebook
                        </a>
                        {' '}to avoid conflicts. Also, join the{' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-yellow-300 underline hover:text-yellow-200">
                            Discord Server
                        </a>
                        {' '}or our{' '}
                        <a href="https://www.facebook.com/MSLPhilippines" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline hover:text-yellow-200">
                            Facebook Page
                        </a>
                        {' '}for more information and announcements.
                    </p>
                </div>
            </section>


            {/* Error Modal */}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setShowErrorModal(false)} />
                    <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="text-center">
                            {/* Error Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>

                            {/* Error Message */}
                            <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-red-400">
                                Error
                            </h3>

                            <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                                {modalMessage}
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}


