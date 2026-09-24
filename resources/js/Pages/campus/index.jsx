import React, { useState } from "react";
import { PhilippinesMap } from "@/Components";
import MainLayout from "@/Layouts/MainLayout";
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Campus({ communities, selectedIsland }) {
    const [hoveredMapCode, setHoveredMapCode] = useState(null);

    const handleTabChange = (island) => {
        router.get('/campus', { island }, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
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

    const tabs = ["Luzon", "Visayas", "Mindanao"];

    return (
        <MainLayout data-theme="dark">
            <div className="font-sans flex flex-col min-h-screen">
                <main
                    className="flex-grow flex flex-col md:flex-row min-h-[calc(100vh-64px)] relative"
                    style={{
                        backgroundImage: "url('/images/MCC/MCC2_BG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed"
                    }}
                >
                    {/* Overlay for better readability */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>

                    {/* DIV1: Left Side - Tabs and List */}
                    <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col border-b md:border-b-0 md:border-r border-white/10 relative z-10">
                        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 uppercase tracking-widest">
                            Campus Directory
                        </h1>

                        {/* Tabs */}
                        <div className="flex space-x-6 mb-8 border-b border-white/10 pb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`text-xl font-bold uppercase tracking-wider pb-2 transition-all duration-300 ${selectedIsland === tab
                                        ? "text-yellow-400 border-b-2 border-yellow-400 shadow-[0_4px_12px_rgba(250,204,21,0.3)]"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                            <button
                                onClick={() => handleTabChange('')}
                                className={`text-xl font-bold uppercase tracking-wider pb-2 transition-all duration-300 ${!selectedIsland
                                    ? "text-yellow-400 border-b-2 border-yellow-400 shadow-[0_4px_12px_rgba(250,204,21,0.3)]"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                ALL
                            </button>
                        </div>

                        {/* School List */}
                        <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-2">
                            {communities.data.map((community) => (
                                <a
                                    key={community.id}
                                    href={community.school_link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setHoveredMapCode(community.map_code)}
                                    onMouseLeave={() => setHoveredMapCode(null)}
                                    className="block group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer backdrop-blur-md"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-wide">
                                                {community.school?.name || "UNKNOWN SCHOOL"}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1 uppercase flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                                {community.location || community.school?.municipality?.name || ""}
                                            </p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ChevronRight className="w-5 h-5 text-yellow-400" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                            {communities.data.length === 0 && (
                                <div className="text-gray-500 italic p-4 text-center">No schools found for this selection.</div>
                            )}
                        </div>

                        {/* Footer / Pagination */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                SHOWING {communities.from || 0}-{communities.to || 0} OF {communities.total} SCHOOLS
                            </div>

                            {/* Pagination Controls */}
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
                                        content = <span className="font-bold">{link.label}</span>;
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
                                                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105"
                                                    : !link.url
                                                        ? "text-gray-600 cursor-not-allowed"
                                                        : "bg-white/5 text-gray-300 hover:bg-white/20 hover:text-white"
                                                }
                                            `}
                                        >
                                            {content}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* DIV2: Right Side - Philippines Map */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-8 relative z-10 min-h-[500px] md:min-h-auto">
                        <div className="w-full h-full max-w-xl relative flex items-start justify-center -mt-32">
                            {/* Glow effect behind map */}
                            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full transform scale-75 pointer-events-none"></div>

                            <PhilippinesMap
                                className="w-full h-full max-h-[80vh] drop-shadow-2xl relative z-10"
                                hoveredMapCode={hoveredMapCode}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}