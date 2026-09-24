import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import { Search } from 'lucide-react';

const FAQs = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Topic cards data - using icons from the screenshot
    const topics = [
        {
            id: 1,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '📦', // Replace with actual icon path
        },
        {
            id: 2,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '🎯', // Replace with actual icon path
             
        },
        {
            id: 3,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '🎓', // Replace with actual icon path
             
        },
        {
            id: 4,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '💰', // Replace with actual icon path
             
        },
        {
            id: 5,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '🎮', // Replace with actual icon path
             
        },
        {
            id: 6,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '⚙️', // Replace with actual icon path
             
        },
        {
            id: 7,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '🏆', // Replace with actual icon path
             
        },
        {
            id: 8,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '💎', // Replace with actual icon path
             
        },
        {
            id: 9,
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam.',
            icon: '🎪', // Replace with actual icon path
             
        }
    ];

    return (
        <>
            <Head title="FAQs - MSL Philippines" />
            <div className="min-h-screen bg-black text-white" style={{
                backgroundImage: "url('/images/FAQs/Main BG.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}>
                <Header />

                {/* Hero Section with Search - Full Width */}
                <div 
                    className="w-full h-[200px] md:h-[250px] relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/FAQs/SearchBG.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Left Character - Esmeralda - Mobile */}
                    <img 
                        src="/images/FAQs/Esmeralda Astral Muse Allstars 2024 render 1.png"
                        alt="Esmeralda"
                        className="absolute h-[100%] w-auto object-contain opacity-30 md:hidden"
                        style={{ maxWidth: '75%', left: '-20%', bottom: '-13%' }}
                    />
                    {/* Left Character - Esmeralda - Desktop */}
                    <img 
                        src="/images/FAQs/Esmeralda Astral Muse Allstars 2024 render 1.png"
                        alt="Esmeralda"
                        className="hidden md:block absolute left-0 bottom-0 h-[120%] w-auto object-contain"
                        style={{ maxWidth: '35%' }}
                    />
                    
                    {/* Right Character - Silvanna - Mobile */}
                    <img 
                        src="/images/FAQs/silvanaa classroom charm render (1) 1.png"
                        alt="Silvanna"
                        className="absolute h-[100%] w-auto object-contain opacity-30 md:hidden"
                        style={{ maxWidth: '75%', right: '-10%', bottom: '-13%' }}
                    />
                    {/* Right Character - Silvanna - Desktop */}
                    <img 
                        src="/images/FAQs/silvanaa classroom charm render (1) 1.png"
                        alt="Silvanna"
                        className="hidden md:block absolute right-0 bottom-0 h-[120%] w-auto object-contain"
                        style={{ maxWidth: '35%' }}
                    />

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 font-['Montserrat'] tracking-wider">
                            HOW CAN WE HELP?
                        </h1>
                        
                        {/* Search Bar */}
                        <div className="w-full max-w-2xl relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Diamond Compensation"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-['Space Grotesk']"
                                />
                            </div>
                            <p className="text-xs md:text-sm text-black mt-2 text-center font-['Space Grotesk']">
                                Popular topics: <span className="underline">Diamonds</span>, <span className="underline">MCC</span>, <span className="underline">Compensation</span>, <span className="underline">Tournament</span>
                            </p>
                        </div>
                    </div>
                </div>

                <main className="relative z-10 pt-8 pb-20 px-4 md:px-8 lg:px-16">
                    {/* Browse by Topic Header */}
                    <div className="max-w-7xl mx-auto mb-8 px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-['Montserrat']">
                            Browse by Topic:
                        </h2>
                    </div>

                    {/* Topic Cards Grid - Desktop (3 columns) */}
                    <div className="max-w-7xl mx-auto px-4 hidden md:block">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href="/FAQsResult"
                                    className="group"
                                >
                                    <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl p-8 border-2 border-transparent hover:border-yellow-400 transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0">
                                                {topic.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2 font-['Montserrat'] group-hover:text-yellow-400 transition-colors">
                                                    {topic.title}
                                                </h3>
                                                <p className="text-sm text-gray-300 font-['Montserrat']">
                                                    {topic.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Topic List - Mobile (single column, compact cards) */}
                    <div className="max-w-7xl mx-auto px-4 md:hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href="/FAQsResult"
                                    className="group block"
                                >
                                    <div className="bg-neutral-900/80 backdrop-blur-sm rounded-lg p-4 border border-neutral-700/50 active:border-yellow-400 transition-all duration-200">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0">
                                                    {topic.icon}
                                                </div>
                                                <h3 className="text-base font-bold text-white font-['Montserrat'] group-active:text-yellow-400 transition-colors">
                                                    {topic.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-300 font-['Montserrat'] leading-relaxed">
                                                {topic.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="max-w-7xl mx-auto mt-16 flex justify-center px-4">
                        <div className="py-3.5 rounded-[20px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <div className="w-full md:w-[495px] px-2.5 inline-flex justify-start items-start">
                                <div className="w-16 h-20 inline-flex flex-col justify-center items-center gap-2.5 flex-shrink-0">
                                    <img className="w-16 h-16 object-contain" src="/images/FAQs/customer-service (1) 1.png" alt="Customer Service" />
                                </div>
                                <div className="flex-1 md:w-[549px] inline-flex flex-col justify-start items-start gap-0">
                                    <div className="px-2.5 py-1 inline-flex justify-start items-start gap-2 overflow-hidden">
                                        <div className="justify-start text-neutral-100 text-2xl font-bold font-['Montserrat'] leading-loose">
                                            Solve your issue
                                        </div>
                                    </div>
                                    <div className="px-3 py-0 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                        <div className="w-full md:w-[462px] justify-start">
                                            <span className="text-neutral-100 text-base font-medium font-['Montserrat'] leading-snug">Need help fast? </span>
                                            <a 
                                                href="mailto:contact@moontonslph.org"
                                                className="text-neutral-100 text-base font-medium font-['Montserrat'] underline leading-snug hover:text-yellow-400 transition-colors"
                                            >
                                                Send us an email.
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default FAQs;

