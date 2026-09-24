import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEvents.jsx";

function EventShow({ event }) {
    // Handle different event types
    const getEventActionButton = () => {
        switch (event.event_canonical) {
            case 'BattleTrips':
                return (
                    <Link href="/MPLS16Battletrips">
                        <div className="flex w-[150px] h-[45px] justify-center items-center gap-1 rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                            <span className="text-white font-['Space Grotesk'] text-base font-bold leading-[140%]">Join Battle Trip</span>
                        </div>
                    </Link>
                );
            case 'StreamerNights':
                return (
                    <div className="flex w-[150px] h-[45px] justify-center items-center gap-1 rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                        <span className="text-white font-['Space Grotesk'] text-base font-bold leading-[140%]">Coming Soon</span>
                    </div>
                );
            default:
                return (
                    <div className="flex w-[150px] h-[45px] justify-center items-center gap-1 rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                        <span className="text-white font-['Space Grotesk'] text-base font-bold leading-[140%]">Learn More</span>
                    </div>
                );
        }
    };

    return (
        <>
            <Head title={event.event_title} />
            <AuthenticatedLayout>
                <main className="relative text-center mb-12 pt-4 px-4 sm:px-4 md:px-6 lg:px-0 lg:mx-auto max-w-[1440px]">
                    {/* Back Button */}
                    <div className="flex justify-start mb-6">
                        <Link href="/Events">
                            <div className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Back to Events</span>
                            </div>
                        </Link>
                    </div>

                    {/* Event Header */}
                    <section className="w-full flex flex-col items-center text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 mb-4">
                            <span className="text-white font-['Space Grotesk'] text-sm font-bold">{event.event_state}</span>
                        </div>
                        <h1 className="text-white font-['Montserrat'] text-[32px] md:text-[48px] font-bold leading-[140%] mb-4 tracking-[-0.015em]">
                            {event.event_title}
                        </h1>
                        <p className="text-white font-['Poppins'] text-base md:text-lg italic font-medium leading-[140%] max-w-2xl">
                            {event.event_subtitle}
                        </p>
                    </section>

                    {/* Event Content */}
                    <section className="mx-auto flex flex-col lg:flex-row gap-8 max-w-[1200px]">
                        {/* Left Column - Event Details */}
                        <div className="flex-1">
                            <div className="bg-[rgba(36,36,36,0.8)] rounded-[20px] p-6 md:p-8 shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)]">
                                <h2 className="text-white font-['Montserrat'] text-2xl font-bold mb-6">Event Details</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">Event Name</h3>
                                        <p className="text-gray-300 font-['Space Grotesk'] text-base">{event.event_name}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">Description</h3>
                                        <p className="text-gray-300 font-['Space Grotesk'] text-base leading-relaxed">
                                            {event.event_subtitle}
                                        </p>
                                    </div>

                                    {event.event_content01 && (
                                        <div>
                                            <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">Additional Information</h3>
                                            <p className="text-gray-300 font-['Space Grotesk'] text-base leading-relaxed">
                                                {event.event_content01}
                                            </p>
                                        </div>
                                    )}

                                    {event.event_content02 && (
                                        <div>
                                            <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">More Details</h3>
                                            <p className="text-gray-300 font-['Space Grotesk'] text-base leading-relaxed">
                                                {event.event_content02}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">Status</h3>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                                                {event.event_state}
                                            </span>
                                        </div>
                                        
                                        {event.is_featured && (
                                            <div>
                                                <h3 className="text-white font-['Space Grotesk'] text-lg font-bold mb-2">Featured</h3>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-600 text-white">
                                                    Featured Event
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Event Logo */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-[rgba(36,36,36,0.8)] rounded-[20px] p-6 md:p-8 shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)]">
                                <div className="w-full h-64 md:h-80 bg-black rounded-lg flex items-center justify-center">
                                    <img 
                                        src={`/images/MCC/Events/${event.event_logo}`}
                                        alt={event.event_title}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden text-white text-center">
                                        <p>Logo not found</p>
                                        <p className="text-sm text-gray-400">{event.event_logo}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <section className="mt-12 flex justify-center">
                        <div className="flex gap-4">
                            <Link href="/Events">
                                <div className="flex w-[150px] h-[45px] justify-center items-center gap-1 rounded-full border border-white bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                    <span className="text-white font-['Space Grotesk'] text-base font-bold leading-[140%]">Back to Events</span>
                                </div>
                            </Link>
                            {getEventActionButton()}
                        </div>
                    </section>
                </main>
            </AuthenticatedLayout>
        </>
    );
}

export default EventShow;
