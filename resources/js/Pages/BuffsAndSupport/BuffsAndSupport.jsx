import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutBuffsAndSupport.jsx";
import Carousel from "./Carousel/Carousel.jsx";
import { Helmet } from "react-helmet";
import { Gem, Coins, Gamepad2, Handshake, Shirt, BookOpen, Trophy, Users, School, HeartHandshake, CheckCircle } from "lucide-react";
import {
  DiamondsSupportCalculator,
  ShsEventsCalculator,
  EventsForCauseCalculator,
  MonetaryGrantsCalculator
} from "./BuffsCalculators";
import { Workflow, FileText, UserPlus, BadgeCheck, CalendarCheck2, Gift } from "lucide-react";

const BuffsAndSupport = ({ eventPhotos = [] }) => {
    return (
        <>
            <Head title="Buffs and Support" />
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <AuthenticatedLayout>
                {/* --- Buffs & Support Page Content --- */}
                <header className="bg-gradient-to-r from-[#F2C21A] to-yellow-600 text-black font-['Montserrat']">
                    <div className="max-w-6xl mx-auto px-6 py-10 sm:py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            {/* TITLE */}
                            <h1 className="font-bold mb-4 text-[24px] sm:text-[32px] lg:text-[40px] leading-tight text-center">
                                Buffs & <br></br>  Support Program
                            </h1>
                            {/* BODY */}
                            <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px] text-center">
                                Empowering student esports organizations with diamonds,
                                monetary support, and exclusive tools to elevate events across
                                the Philippines.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <a
                                    //href="https://forms.gle/eBXzXTcySNgdtjRj6"
                                    // href="/MSLBuffsAndSupportApplicationForm"
                                    target="_blank"
                                    href="https://forms.gle/fpaS8gRR61VgTdY26"
                                    className="px-6 py-3 bg-black text-[#F2C21A] font-bold rounded-xl"
                                >
                                    Apply Now
                                </a>
                                <a
                                    //href="bit.ly/2025BuffAndSupport"
                                    // href="https://docs.google.com/document/d/1Nn3yrCn3qAMdxmEz9Tvo4xACrUIv1pukZ9tJVA1p7ak/edit?tab=t.0"
                                    target="_blank"
                                    href="https://docs.google.com/document/d/14rAnSyb5goYr2nAfe10RtGE5k_rNQ2AA3yow0UEncS8/edit?usp=sharing"
                                    className="px-6 py-3 border border-black text-black font-bold rounded-xl"
                                >
                                    Learn More →
                                </a>
                            </div>
                        </div>
                        <div className="bg-black/80 text-white rounded-2xl p-6">
                            {/* HEADER */}
                            <h2 className="font-bold mb-2 text-[20px] sm:text-[24px] lg:text-[30px] text-center">
                                Program Benefits
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <Gem className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Diamonds for events
                                </span>
                                </li>
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <Coins className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Monetary support
                                </span>
                                </li>
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <Gamepad2 className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Tournament Lobby access
                                </span>
                                </li>
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <Handshake className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Access to Brand Sponsorships
                                </span>
                                </li>
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <Shirt className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Merchandise Support
                                </span>
                                </li>
                                <li className="flex items-center gap-3 bg-white/5 rounded-xl p-4 min-h-[70px] hover:bg-white/10 transition-colors">
                                <BookOpen className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
                                <span className="text-gray-300 font-medium text-sm sm:text-base">
                                    Access to MLBB resources
                                </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                
                <main className="max-w-6xl mx-auto px-6 py-16 space-y-16 font-['Montserrat']">
                    {/* Event Types Section */}
                    <section>
                        {/* HEADER */}
                        <h2 className="font-bold mb-8 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                            Event Types Supported
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                        {/* Tournaments */}
                        <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px]">
                            <Trophy className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <div>
                            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                                Tournaments
                            </h3>
                            <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                                Competitive events for MLBB, held onsite or online, with or
                                without livestream. Open to all skill levels.
                            </p>
                            </div>
                        </div>

                        {/* Non-tournament Activities */}
                        <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px]">
                            <Users className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <div>
                            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                                Non-tournament Activities
                            </h3>
                            <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                                Includes Quiz Bees, General Assemblies, and Org Fair Booths.
                            </p>
                            </div>
                        </div>

                        {/* Inter-school Activities */}
                        <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px]">
                            <School className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <div>
                            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                                Inter-school Activities
                            </h3>
                            <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                                Events that bring together multiple schools or organizations for
                                collaboration, competition, or networking.
                            </p>
                            </div>
                        </div>

                        {/* Events for a Cause */}
                        <div className="flex items-start gap-4 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors min-h-[150px]">
                            <HeartHandshake className="w-10 h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <div>
                            <h3 className="font-bold text-[18px] sm:text-[22px] lg:text-[26px] mb-2">
                                Events for a Cause
                            </h3>
                            <p className="font-medium text-gray-400 text-[12px] sm:text-[16px]">
                                Charity or advocacy events that use MLBB or org activities to
                                support a cause or community.
                            </p>
                            </div>
                        </div>
                        </div>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-3xl font-extrabold mb-2">Calculation</h2>
                        <p className="text-lg text-gray-300 mb-8">See how much we can sponsor your event!</p>
                    </section>
                    <DiamondsSupportCalculator />
                    <ShsEventsCalculator />
                    <EventsForCauseCalculator />
                    <MonetaryGrantsCalculator />

                    
                    {/* Tournament Lobby Section */}
                    <section className="bg-zinc-900/80 rounded-2xl p-8 ring-1 ring-zinc-800">
                        <h2 className="font-['Montserrat'] font-bold mb-2 flex items-center gap-2 text-[24px] sm:text-[30px] lg:text-[40px]">
                            <Trophy className="w-7 h-7 text-[#F2C21A]" />
                            Tournament Lobby
                        </h2>
                        <span className="inline-block bg-[#F2C21A]/20 text-[#F2C21A] text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg mb-4">
                            🔥 Pro-Grade Competitive Play
                        </span>
                        <p className="font-['Montserrat'] text-gray-300 mb-6 font-medium text-[14px] sm:text-[16px]">
                            Unlock the Ultimate Competitive Experience
                        </p>

                        {/* Features in Card Grid */}
                        <ul className="grid md:grid-cols-2 gap-4 mb-6">
                            {[
                            "All Heroes Unlocked",
                            "All Emblems Unlocked",
                            "All Skins Unlocked",
                            "Cross-Server Battles",
                            "6-Ban or 10-Ban Options",
                            ].map((feature, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-3 bg-zinc-800/60 p-3 rounded-xl hover:bg-zinc-700/70 transition"
                            >
                                <CheckCircle className="w-5 h-5 text-[#F2C21A]" />
                                <span className="font-['Montserrat'] text-gray-200 text-sm sm:text-base font-medium">
                                {feature}
                                </span>
                            </li>
                            ))}
                        </ul>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 text-center sm:text-left">
                            <a
                            //href="https://forms.gle/MZkMwxs5KCnrPLEw9"
                            // href="/MSLTournamentLobbyApplicationForm"
                            href="https://forms.gle/uT3v5bU2zxK6mTjMA"
                            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black rounded-xl font-bold font-['Montserrat'] shadow-md hover:scale-105 transition"
                            >
                            Request Access
                            </a>
                            <a
                            href="https://tinyurl.com/TLSOP"
                            className="px-6 py-3 border border-[#F2C21A] text-[#F2C21A] rounded-xl font-bold font-['Montserrat'] hover:bg-[#F2C21A]/10 transition"
                            >
                            View Guidelines →
                            </a>
                        </div>
                    </section>
                
                    {/* Implementation Framework Section */}
                    <section className="bg-zinc-900/80 rounded-2xl p-8 ring-1 ring-zinc-800 max-w-6xl mx-auto mt-16">
                        <h3 className="font-['Montserrat'] font-bold mb-8 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                            <Workflow className="w-6 h-6 text-[#F2C21A]" />
                            Implementation Framework
                        </h3>
                        <div className="grid md:grid-cols-5 gap-6 items-start">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-12 h-12 bg-[#F2C21A] text-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 font-['Montserrat']">Application Process</h4>
                            <p className="text-sm text-gray-400 font-['Montserrat'] font-medium">
                                {/* Submit proposals and pitch decks (2–3 weeks before for diamonds, 45 days for monetary, 1 month for Tournament Lobby). */}
                                Submit event proposals and pitch decks 1–2 weeks before for diamonds and tournament lobby, and 2 months before for merchandise and monetary support.
                            </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-12 h-12 bg-[#F2C21A] text-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 font-['Montserrat']">Registration</h4>
                            <p className="text-sm text-gray-400 font-['Montserrat'] font-medium">
                                Participants must pre-register on the MSL website.
                            </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-12 h-12 bg-[#F2C21A] text-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                                <BadgeCheck className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 font-['Montserrat']">Acknowledgement</h4>
                            <p className="text-sm text-gray-400 font-['Montserrat'] font-medium">
                                Official confirmation of approved budget.
                            </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-12 h-12 bg-[#F2C21A] text-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                                <CalendarCheck2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 font-['Montserrat']">Post-Event</h4>
                            <p className="text-sm text-gray-400 font-['Montserrat'] font-medium">
                                Winner lists, event reports, media.
                            </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-12 h-12 bg-[#F2C21A] text-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                                <Gift className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 font-['Montserrat']">Release of Rewards</h4>
                            <p className="text-sm text-gray-400 font-['Montserrat'] font-medium">
                                Diamonds (3–4 weeks after reports) or monetary grants (45 days after events).
                            </p>
                            </div>
                        </div>
                    </section>

                    <Carousel eventPhotos={eventPhotos} />
                </main>
            </AuthenticatedLayout>
        </>
    );
};

export default BuffsAndSupport;