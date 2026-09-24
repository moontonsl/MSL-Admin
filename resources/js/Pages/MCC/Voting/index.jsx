import React, { useState, useEffect } from "react";
import { Header, Footer } from "@/Components";
import WinNavigation from "./WinNavigation";

// Team data structure
const teams = [
    {
        id: 1,
        name: "Team 1",
        image: "/images/MCC/team1.png",
        votes: 0
    },
    {
        id: 2,
        name: "Team 2",
        image: "/images/MCC/Voting 1.png",
        votes: 0
    },
    {
        id: 3,
        name: "Team 3",
        image: "/images/MCC/Voting 2.png",
        votes: 0
    },
    {
        id: 4,
        name: "Team 4",
        image: "/images/MCC/Voting 3.png",
        votes: 0
    },
    {
        id: 5,
        name: "Team 5",
        image: "/images/MCC/Voting 4.png",
        votes: 0
    }
];

export default function VotingPage() {
    const [shuffledTeams, setShuffledTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Shuffle teams on component mount
    useEffect(() => {
        setShuffledTeams(shuffleArray(teams));
    }, []);

    const handleVote = (teamId) => {
        setSelectedTeam(teamId);
        // TODO: Implement voting logic here
        console.log(`Voted for team ${teamId}`);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-0">
                <div 
                    className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-10" 
                    style={{ 
                        backgroundImage: "url('/images/MCC/VoteBG.png')", 
                        backgroundSize: "cover", 
                        backgroundPosition: "center",
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}
                >
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">VOTE FOR YOUR TEAM</h1>
                        <p className="text-xl text-gray-300">Select your favorite team to support</p>
                    </div>

                    {/* Teams Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {shuffledTeams.map((team) => (
                            <div 
                                key={team.id}
                                className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                                    selectedTeam === team.id ? 'ring-4 ring-[#F3C718]' : ''
                                }`}
                                onClick={() => handleVote(team.id)}
                            >
                                <div className="relative aspect-square overflow-hidden rounded-lg">
                                    <img 
                                        src={team.image} 
                                        alt={team.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-xl font-bold">Click to Vote</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl font-bold">{team.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="mt-12">
                        <WinNavigation />
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
} 