import React, { useState, useEffect } from "react";
import { Header, Footer } from "@/Components";
import { CheckCircle } from "lucide-react";
import { router } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const BracketSection = ({ title, status, existingVotes = [], bracketStatus = {} }) => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [shuffledTeams, setShuffledTeams] = useState([]);
    const [teams, setTeams] = useState([]);
    const hasVoted = bracketStatus[title]?.voted || existingVotes.length > 0;

    useEffect(() => {
        // mga teams para sa mga brackets
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`/api/bracket-teams/${encodeURIComponent(title)}`);
                const fetchedTeams = response.data;
                setTeams(fetchedTeams);
                
                if (!hasVoted) {
                    setShuffledTeams(shuffleArray(fetchedTeams));
                } else {
                    setShuffledTeams(fetchedTeams);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error('Failed to load teams. Please refresh the page.');
            }
        };

        fetchTeams();
    }, [title, status]);

    // pag naka vote na ang user
    useEffect(() => {
        if (hasVoted) {
            const votedTeamIds = existingVotes.map(vote => {
                const team = teams.find(team => team.name === vote.team);
                return team?.id;
            }).filter(Boolean);
            setSelectedTeams(votedTeamIds);
        }
    }, [hasVoted, existingVotes, teams]);

    const handleTeamSelect = (teamId) => {
        if (status !== 'open' || hasVoted) {
            return;
        }
        
        if (selectedTeams.includes(teamId)) {
            setSelectedTeams(selectedTeams.filter(id => id !== teamId));
        } else if (selectedTeams.length < 2) {
            setSelectedTeams([...selectedTeams, teamId]);
        }
    };

    const handleSubmit = async () => {
        if (selectedTeams.length === 0) {
            toast.error('Please select at least 1 team');
            return;
        }
        
        try {
            await router.post(route('predictions.vote'), {
                bracket: title,
                selectedTeams: selectedTeams.map(teamId => 
                    teams.find(team => team.id === teamId)
                )
            }, {
                onSuccess: () => {
                    setSelectedTeams([]);
                    toast.success('Votes submitted successfully!');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'Failed to submit votes. Please try again.');
                    console.error('Error submitting votes:', errors);
                }
            });
        } catch (error) {
            console.error('Error submitting votes:', error);
            toast.error('Failed to submit votes. Please try again.');
        }
    };

    const isTeamSelectable = (teamId) => {
        if (status !== 'open' || hasVoted) return false;
        return selectedTeams.includes(teamId) || selectedTeams.length < 2;
    };

    const getCoverMessage = () => {
        if (hasVoted) return 'VOTE SUBMITTED';
        switch (status) {
            case 'closed':
                return 'VOTING CLOSED';
            case 'upcoming':
                if(title == 'LUZON A BRACKET'){
                    return <div>
                        <p>OPENS ON JUNE 25</p>
                        <p className="text-sm mt-2">VOTING CLOSED: JUNE 27 | 4:00 PM</p>
                    </div>
                }else if(title == 'LUZON B BRACKET'){
                    return <div>
                        <p>OPENS ON JUNE 26</p>
                        <p className="text-sm mt-2">VOTING CLOSED: JUNE 29 | 4:00 PM</p>
                    </div>
                }else if(title == 'VISAYAS BRACKET'){
                    return <div>
                        <p>OPENS ON JUNE 27</p>
                        <p className="text-sm mt-2">VOTING CLOSED: JUNE 30 | 4:00 PM</p>
                    </div>
                }else if(title == 'MINDANAO BRACKET '){
                    return <div>
                        <p>OPENS ON JUNE 28</p>
                        <p className="text-sm mt-2">VOTING CLOSED: JULY 1 | 4:00 PM</p>
                    </div>
                }else{
                    return 'OPENS ON JUNE 18';
                }
            default:
                return '';
        }
    };

    const getOverlayStyle = () => {
        if (hasVoted) return 'bg-green-900/50';
        switch (status) {
            case 'closed':
                return 'bg-black/80';
            case 'upcoming':
                return 'bg-[#F3C718]/50';
            default:
                return '';
        }
    };


    const isDimmed = (teamId) => {
        if (hasVoted) return !selectedTeams.includes(teamId);
        if (status !== 'open') return true;
        return selectedTeams.length === 2 && !selectedTeams.includes(teamId);
    };

    return (
        <div className="w-full max-w-[1640px] relative mb-24 px-4 md:px-8">
            {/* Section Title */}
            <div className="text-center mb-4">
                <h2 className="text-3xl md:text-5xl font-bold font-space leading-tight">
                    {title}
                </h2>
            </div>

            {/* pag may votes na ang users */}
            {hasVoted && (
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-[#F3C718]/30">
                    <h3 className="text-xl font-bold text-[#F3C718] mb-2">Your Votes:</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {existingVotes.map((vote, index) => (
                            <div key={vote.id} className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg">
                                <img 
                                    src={vote.image} 
                                    alt={vote.team}
                                    className="w-8 h-8 object-contain"
                                />
                                <span className="font-medium">{vote.team}</span>
                                <span className="text-sm text-gray-400">
                                    {new Date(vote.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Teams Container - Single Line Horizontal Layout */}
            <div className="w-full flex flex-col items-center relative">
                {/* Subtitle */}
                <p className="text-base md:text-lg font-semibold text-center text-white mb-4">
                    {hasVoted ? 'Your Selected Teams' : 'Choose 1 or 2 Teams'}
                </p>
                
                {/* Teams Horizontal Scroll Container */}
                <div className="w-full rounded-2xl p-4 md:p-6 bg-black/40 relative">
                    {/* Cover Overlay - Always show if hasVoted or status is not open */}
                    {(status !== 'open' || hasVoted) && (
                        <div className={`absolute inset-0 z-20 flex items-center justify-center rounded-2xl ${getOverlayStyle()}`}>
                            <h3 className="text-4xl md:text-6xl font-bold font-space text-white text-center">
                                {getCoverMessage()}
                            </h3>
                        </div>
                    )}
                    
                    {/* Teams Grid Layout - Mobile (2 columns) */}
                    <div className="grid grid-cols-2 gap-4 md:hidden">
                        {shuffledTeams.map((team, index) => {
                            const isSelected = selectedTeams.includes(team.id);
                            const isDisabled = !isTeamSelectable(team.id) || hasVoted;
                            const dimmed = isDimmed(team.id);
                            const isLastItem = index === shuffledTeams.length - 1;
                            const isOddNumber = shuffledTeams.length % 2 === 1;
                            const shouldCenter = isLastItem && isOddNumber;

                            return (
                                <div
                                    key={team.id}
                                    className={`relative bg-black/80 rounded-xl overflow-hidden flex flex-col items-center group transition-all duration-200 ${
                                        isSelected ? 'ring-4 ring-yellow-400' : ''
                                    } ${
                                        !hasVoted && status === 'open' ? 'cursor-pointer' : 'cursor-not-allowed'
                                    } ${
                                        shouldCenter ? 'col-span-2 justify-self-center' : ''
                                    }`}
                                    onClick={() => !isDisabled && handleTeamSelect(team.id)}
                                    style={{ 
                                        opacity: dimmed ? 0.3 : 1,
                                        ...(shouldCenter && { 
                                            maxWidth: '45%',
                                            width: '45%'
                                        })
                                    }}
                                >
                                    {/* Checkmark */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <CheckCircle 
                                            size={32} 
                                            className={`transition-opacity duration-300 ${
                                                isSelected 
                                                    ? 'opacity-100 text-yellow-400' 
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    </div>
                                    {/* Team Image - Fixed dimensions for uniformity - 175x175 for all cards */}
                                    <div 
                                        className="relative"
                                        style={{ 
                                            width: '175px',
                                            height: '175px',
                                            overflow: 'hidden',
                                            margin: '0 auto'
                                        }}
                                    >
                                        <img 
                                            src={team.image}
                                            alt={team.name}
                                            style={{
                                                width: '175px',
                                                height: '175px',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                    {/* Dimming Overlay */}
                                    {dimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Teams Horizontal Scroll - Desktop */}
                    <div className="hidden md:block w-full overflow-x-auto custom-scrollbar py-2 pl-4">
                        <div className="flex flex-row gap-4 md:gap-8 justify-start items-start" style={{ minWidth: 'max-content' }}>
                            {shuffledTeams.map((team) => {
                                const isSelected = selectedTeams.includes(team.id);
                                const isDisabled = !isTeamSelectable(team.id) || hasVoted;
                                const dimmed = isDimmed(team.id);

                                return (
                                    <div
                                        key={team.id}
                                        className={`relative bg-black/80 rounded-xl overflow-hidden flex flex-col items-center group transition-all duration-200 flex-shrink-0 ${
                                            isSelected ? 'ring-4 ring-yellow-400' : ''
                                        } ${
                                            !hasVoted && status === 'open' ? 'cursor-pointer' : 'cursor-not-allowed'
                                        }`}
                                        onClick={() => !isDisabled && handleTeamSelect(team.id)}
                                        style={{ 
                                            opacity: dimmed ? 0.3 : 1,
                                            width: '275px',
                                            height: 'auto'
                                        }}

                                        
                                    >
                                        {/* Checkmark */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <CheckCircle 
                                                size={32} 
                                                className={`transition-opacity duration-300 ${
                                                    isSelected 
                                                        ? 'opacity-100 text-yellow-400' 
                                                        : 'opacity-0'
                                                }`}
                                            />
                                        </div>
                                        {/* Team Image */}
                                        <div 
                                            className="relative w-full"
                                            style={{ 
                                                height: '250px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img 
                                                src={team.image}
                                                alt={team.name}
                                                className="w-full h-full"
                                                style={{
                                                    height: '250px',
                                                    objectFit: 'cover',
                                                    objectPosition: '80% center',
                                                    display: 'block'
                                                }}
                                            />
                                        </div>
                                        {/* Dimming Overlay */}
                                        {dimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Submit Button - Only show if bracket is open and user hasn't voted */}
                {status === 'open' && !hasVoted && selectedTeams.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#F3C718] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#F3C718]/90 transition-all duration-300 transform hover:scale-105"
                        >
                            Submit Vote
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function PredictionsPage({ userVotes = {}, bracketStatus = {}, users_id, auth }) {
    const handleLogout = async () => {
        try {
            const response = await axios.post('/ml/logout');
            if (response.data.success) {
                toast.success('Logged out!');
                window.location.href = response.data.redirect; // Redirect to login
            }
        } catch (error) {
            toast.error('Logout failed!');
        }
    };
    return (
        <>
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <Toaster 
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            border: '1px solid #F3C718',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '80px',
                            pointerEvents: 'auto'
                        },
                    }}
                />
            </div>

            <div className="min-h-screen bg-black text-white">
                <div className="relative z-10">
                    <div className="flex justify-end m-4 absolute top-0 right-0">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>
                </div>
                <main 
                    className="relative z-0 min-h-screen py-8 md:py-16"
                    style={{
                        backgroundImage: "url('/images/MCC/VoteBG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed"
                    }}
                >
                    <div className="Main flex flex-col justify-center items-center overflow-hidden">
                        {/* Header Section - Adjusted spacing */}
                        <div className="MccHeaderLogo w-full px-4 md:px-20 lg:px-80 py-2 md:py-2.5 flex flex-col justify-center items-center overflow-hidden">
                            <img 
                                className="MccHlogo1 h-20 md:h-28 object-contain" 
                                src="/images/MCC/Pamantasan.png" 
                                alt="MCC Logo"
                            />
                            <div className="text-center mt-0.8 md:mt-3">
                                <h1 className="text-[1.75rem] md:text-[3.25rem] lg:text-[3.25rem] font-bold font-space leading-tight">
                                    GROUP STAGE PREDICTION
                                </h1>
                            </div>
                            <div className="mt-0 md:mt-0 text-center flex flex-col gap-0">
                                <p className="text-lg md:text-xl font-poppins font-medium leading-none">
                                    Predict who will make it to the Finals?
                                </p>
                                <p className="text-lg md:text-xl font-poppins font-bold leading-none">
                                    Choose 1 or 2 Teams!
                                </p>
                            </div>
                        </div>

                        {/* Body Section with Brackets */}
                        <div className="Body w-full flex flex-col items-center gap-4 md:gap-8 mt-8 md:mt-16">
                            <BracketSection 
                                title="MINDANAO BRACKET"
                                status={bracketStatus['MINDANAO BRACKET']?.status}
                                existingVotes={userVotes['MINDANAO BRACKET']}
                                bracketStatus={bracketStatus}
                                users_id={users_id}
                            />
                            <BracketSection 
                                title="VISAYAS BRACKET"
                                status={bracketStatus['VISAYAS BRACKET']?.status}
                                existingVotes={userVotes['VISAYAS BRACKET']}
                                bracketStatus={bracketStatus}
                                users_id={users_id}
                            />
                            <BracketSection 
                                title="LUZON A BRACKET"
                                status={bracketStatus['LUZON A BRACKET']?.status}
                                existingVotes={userVotes['LUZON A BRACKET']}
                                bracketStatus={bracketStatus}
                                users_id={users_id}
                            />
                            <BracketSection 
                                title="LUZON B BRACKET"
                                status={bracketStatus['LUZON B BRACKET']?.status}
                                existingVotes={userVotes['LUZON B BRACKET']}
                                bracketStatus={bracketStatus}
                                users_id={users_id}
                            />
                        </div>
                    </div>
                </main>

                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </>
    );
}
