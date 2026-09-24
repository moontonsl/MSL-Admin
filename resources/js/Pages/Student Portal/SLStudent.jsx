import styles from "./SLAdmin.module.scss";
import styles2 from "./SLStudent.module.scss";
import {BadgeCheck, ArrowDownAZ, Funnel, Search, Users, UserCheck, UserX, RefreshCw, Crown} from 'lucide-react';

import profilePic from "./assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutSLStudent.jsx";
import TableComponent from "@/Pages/SLAdmin/components/TableComponent.jsx";
import { Head, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import EditProfileModal from "./EditProfileModal.jsx"; 
import rankPIC from "./assets/MythicIcon.png";



const SLStudent = () => {
    const { user, verified, new: newUsers, blocked } = usePage().props;

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(user);

    // Sync selectedUser when user prop changes (after page reload)
    useEffect(() => {
        setSelectedUser(user);
    }, [user]);

    // Male SVG (Gold)
    const MaleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path d="M16 3.5H21M21 3.5V8.5M21 3.5L14.25 10.25M16 14.5C16 17.8137 13.3137 20.5 10 20.5C6.68629 20.5 4 17.8137 4 14.5C4 11.1863 6.68629 8.5 10 8.5C13.3137 8.5 16 11.1863 16 14.5Z" stroke="#F3C718" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
    
    // Female SVG (Pink)
    const FemaleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <circle cx="12" cy="10" r="5" stroke="#E75480" strokeWidth="2"/>
        <path d="M12 15V22M9 19H15" stroke="#E75480" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
    
    // Other/Non-binary SVG (Purple)
    const OtherIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path d="M12 2L14.09 8.26L20.97 8.27L15.45 12.14L17.54 18.4L12 14.53L6.46 18.4L8.55 12.14L3.03 8.27L9.91 8.26L12 2Z" stroke="#9B59B6" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
    );
    return (
        <AuthenticatedLayout>

            {/*Title Page*/}
            <Head title="Student Portal" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
             style={{ backgroundImage: "url('/webbg2025.png')" }}>
                <div className="px-4 sm:px-6 lg:px-8 py-6 container mx-auto max-w-7xl">
                    {/* Hero Profile Section */}
                    <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        
                        {/* Profile Picture + Button */}
                        <div className="lg:col-span-3 flex flex-col items-center lg:items-center">
                        <div className="relative">
                            <div className="bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-2 rounded-full shadow-2xl">
                            <div className="bg-neutral-900 rounded-full p-1">
                                <img
                                src={profilePic}
                                alt="Profile"
                                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-neutral-800"
                                />
                            </div>
                            </div>

                            {/* BadgeCheck stays on image */}
                            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-neutral-900">
                            <BadgeCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Button for Edit Profile*/}
                        <button
                            onClick={() => setShowEditProfileModal(true)}
                            className="mt-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-2 text-sm font-semibold text-white shadow-md hover:from-purple-600 hover:to-pink-500 transition"
                        >
                            Edit Profile
                        </button>
                        </div>

                        {/* User Info */}
                        <div className="lg:col-span-5 text-center lg:text-left flex flex-col justify-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                            {user.name} {user.surname}
                        </h1>
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                            <span className="text-lg sm:text-xl text-neutral-300 font-medium">
                            @{user.username}
                            </span>
                        </div>

                        {/* User Details Grid (compressed spacing) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">IGN:</div>
                            <div className="text-sm sm:text-base font-semibold text-white">{user.ml_ign}</div>
                            </div>
                            <div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">ML ID:</div>
                            <div className="text-sm sm:text-base font-semibold text-white">{user.ml_id} ({user.ml_server})</div>
                            </div>
                            <div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">SQUAD</div>
                            <div className="text-sm sm:text-base font-semibold text-white">{user.squadName}</div>
                            </div>
                            <div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">YR. LVL:</div>
                            <div className="text-sm sm:text-base font-semibold text-white">{user.year_level}</div>
                            </div>
                        </div>

                        {/* Info Column Icons / Glass Boxes */}
                        <div className="flex items-center gap-6 mt-6 flex-wrap justify-center lg:justify-start">
                        {/* Gender Box */}
                        <div className="w-14 h-14 flex justify-center items-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-md">
                            {user.gender === 'male' && <MaleIcon />}
                            {user.gender === 'female' && <FemaleIcon />}
                            {user.gender !== 'male' && user.gender !== 'female' && <OtherIcon />}
                        </div>

                        {/* Other Glass Boxes (placeholders, can replace with real stats/info) */}
                        <div className="w-14 h-14 flex justify-center items-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/20 shadow-md">
                            <Users className="w-6 h-6 text-white/80" />
                        </div>

                        <div className="w-14 h-14 flex justify-center items-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-white/20 shadow-md">
                            <UserCheck className="w-6 h-6 text-white/80" />
                        </div>

                        <div className="w-14 h-14 flex justify-center items-center rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-md border border-white/20 shadow-md">
                            <Crown className="w-6 h-6 text-white/80" />
                        </div>
                        </div>

                        </div>
                        {/* Rank Stats */}
                        <div className="lg:col-span-4 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div
                            className="w-[150px] h-[160px] md:w-[200px] md:h-[220px] aspect-[67/70] bg-cover bg-center bg-no-repeat rounded-xl"
                            style={{ backgroundImage: `url(${rankPIC})` }}
                            ></div>

                            <div className="flex flex-col justify-center gap-8 flex-1">
                            <div>
                                <span className="text-white font-spaceGrotesk text-base font-bold">
                                Monthly Tournaments
                                </span>
                                <div>
                                <span className={`${styles.customLargeText}`}>0%</span>
                                <span className="block text-white font-spaceGrotesk text-base font-bold">
                                    Winrate
                                </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-white font-spaceGrotesk text-base font-bold">
                                Monthly Tournaments
                                </span>
                                <div>
                                <span className={`${styles.customLargeText}`}>0%</span>
                                <span className="block text-white font-spaceGrotesk text-base font-bold">
                                    Winrate
                                </span>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>

                    {/* ===========================
                    Two separate cards below (inside same container)
                    =========================== */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                    {/* LEFT CARD — 60% with navbar */}
                    <div className="lg:col-span-7">
                    <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 
                                    backdrop-blur-sm border border-neutral-700/50 rounded-2xl 
                                    p-6 sm:p-8 lg:p-10 shadow-2xl h-full min-h-[250px] 
                                    flex flex-col">

                        {/* Navbar inside card */}
                        <div className="flex items-start gap-6 border-b border-neutral-700/50 pb-3 mb-4">
                        <div className="w-[90vw] sm:w-full overflow-x-auto custom-scrollbar">
                            <div className="flex space-x-6 py-1 whitespace-nowrap text-white font-medium">
                            <span className="cursor-pointer">Recent MSL Tournament</span>
                            <span className="opacity-50 cursor-pointer">Monthly Tournaments</span>
                            <span className="opacity-50 cursor-pointer">MCC Appearance</span>
                            <span className="opacity-50 cursor-pointer">Followers</span>
                            </div>
                        </div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 text-neutral-300">
                        {/* Placeholder for any content that goes here */}
                        <p className="text-sm opacity-70"></p>
                        </div>
                    </div>
                    </div>

                    {/* RIGHT CARD — 40% */}
                    <div className="lg:col-span-5">
                      <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 
                                    backdrop-blur-sm border border-neutral-700/50 rounded-2xl 
                                    p-6 sm:p-8 lg:p-10 shadow-2xl h-full min-h-[250px] 
                                    flex flex-col">

                        {/* Navbar inside card */}
                        <div className="flex items-start gap-6 border-b border-neutral-700/50 pb-3 mb-4">
                          <div className="w-[90vw] sm:w-full overflow-x-auto custom-scrollbar">
                            <div className="flex space-x-6 py-1 whitespace-nowrap text-white font-medium">
                              <span className="cursor-pointer">MSL Hero Highlights</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex p-6 flex-col items-center gap-6 flex-1 self-stretch">
                                {/* Highlight Card 1 */}
                                <div className={`flex flex-col justify-center items-start p-6 gap-2.5 rounded-lg ${styles2.highlightCard}`}>
                                    {/* The image is a background image on the div to achieve the desired positioning/clipping */}
                                    <div className={`${styles2.highlightCardImage}`}></div>
                                    <div className="flex items-center md:ml-0 flex-1 self-stretch z-10">
                                    {/* The actual text block (assuming previous items-end for internal text alignment) */}
                                        <div className={`flex flex-col justify-end items-start gap-3 self-stretch text-white`}>
                                            <h1 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-white mb-2">
                                                {user.mainHero}
                                            </h1>
                                            <span className="text-lg sm:text-xl text-neutral-300 font-medium">
                                                Main
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Highlight Card 2 */}
                                <div className={`flex flex-col justify-center items-start p-6 gap-2.5 rounded-lg ${styles2.highlightCard}`}>
                                    <div className={`${styles2.highlightCardImage}`}></div>
                                    <div className="flex items-center md:ml-0 flex-1 self-stretch z-10">
                                    {/* The actual text block (assuming previous items-end for internal text alignment) */}
                                        <div className={`flex flex-col justify-end items-start gap-3 self-stretch text-white`}>
                                            <h1 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-white mb-2">
                                                {user.mainHero}
                                            </h1>
                                            <span className="text-lg sm:text-xl text-neutral-300 font-medium">
                                                Main
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                      </div>
                    </div>
                </div>  
                </div>
            </div>


            {/* ✅ Render modal when true */}
            {showEditProfileModal && (
                <EditProfileModal
                user={selectedUser}
                onClose={() => setShowEditProfileModal(false)}
                onSave={(updatedUser) => {
                    setSelectedUser(updatedUser);
                }}
                />
            )}

        </AuthenticatedLayout>
    )
}
export default SLStudent;