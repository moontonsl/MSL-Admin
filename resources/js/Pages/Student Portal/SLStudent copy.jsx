import styles from "./SLStudent.module.scss";
import {BadgeCheck} from 'lucide-react';

import profilePic from "./assets/AccountImage.png";
import rankPIC from "./assets/MythicIcon.png";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, usePage } from '@inertiajs/react';
import { useState } from "react";

import EditProfileModal from "./EditProfileModal.jsx"; 



const SLStudent = () => {
    const { user } = usePage().props;
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

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(user);

    
    return (
        <AuthenticatedLayout>


            {/*Title Page*/}
            <Head title="Student Portal" />

            <div className={`${styles.slStudent}`}>
                <div className={`px-2 py-2 md:px-4 pt-4 pb-8 container mx-auto max-w-[1536px]`}>
                <div className={`${styles.topCard} px-6 py-6 md:px-0 md:py-10 max-w-[365px] mx-auto md:max-w-full md:mx-0 overflow-x-hidden grid md:grid-cols-[25%_40%_35%] xl:min-h-[365px]`}>
                      {/* profile section */}
                        <div className="flex flex-col items-center md:justify-center space-y-3 sm:space-y-4">
                            {/* Profile Image */}
                            <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] p-[8px] rounded-full">
                                <div className="bg-neutral-900 rounded-full">
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-[clamp(10rem,12vw,15rem)] h-[clamp(10rem,12vw,15rem)] rounded-full object-cover"
                                />
                                </div>
                            </div>

                            {/* Button opens modal */}
                            {/*<button
                            onClick={() => setShowEditProfileModal(true)}
                            className="mt-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-2 text-sm font-semibold text-white shadow-md hover:from-purple-600 hover:to-pink-500 transition"
                            >
                            Edit Profile
                            </button>*/}
                            </div>

                        <div className="w-full flex flex-col justify-center gap-6 xl:gap-[32px]">
                            {/* Adjust items-alignment for mobile */}
                            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 pt-6">
                                <h1 className="text-2xl font-semibold text-[clamp(1.75rem,3vw+1rem,4rem)] leading-[clamp(2rem,4vw+1rem,4.25rem)]">{user.name + " " + user.surname}</h1>
                                <div className="flex items-center gap-2 xl:text-[32px] xl:leading-[32px] mt-1">
                                    <span>{user.username}</span>
                                    <BadgeCheck className={`text-[var(--border-brand-default)] w-[16px] xl:w-[32px]`}/>
                                </div>
                            </div>

                            {/* details section */}
                            <div className="grid gap-1 lg:gap-2 mb-6 md:mb-0 lg:grid-cols-2 -mt-4 md:mt-0">
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <div className="mr-2 opacity-50">IGN:</div>
                                        <div className="font-medium xl:text-2xl">{user.ml_ign}</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-2 opacity-50">ML ID:</div>
                                        <div className="font-medium xl:text-2xl">{user.ml_id} ({user.ml_server})</div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <div className="mr-2 opacity-50">SQUAD:</div>
                                        <div className="font-medium xl:text-2xl">{user.squadName}</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-2 opacity-50">YR. LVL:</div>
                                        <div className="font-medium xl:text-2xl">{user.year_level}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Column Icons (assuming these also have glass effect) */}
                            <div className="flex items-center gap-8 self-stretch -mt-4"> {/* info-column-frame-324-icons */}
                                {/* Combining Tailwind for layout and custom CSS Module for complex styles */}
                                <div className={`flex justify-center items-center aspect-square ${styles.info_column_frame_335_style}`}> {/* info-column-frame-335 */}
                                    <div className={`flex items-center justify-center gap-2.5 shrink-0 ${styles.info_column_frame_337_item_style}`}>
                                    <div className="flex items-center justify-center aspect-square">
                                        {user.gender === 'male' && <MaleIcon />}
                                        {user.gender === 'female' && <FemaleIcon />}
                                        {user.gender !== 'male' && user.gender !== 'female' && <OtherIcon />}
                                    </div>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-4 ${styles.info_column_frame_337_width}`}> {/* info-column-frame-337 */}
                                    <div className={`flex flex-col items-start gap-2.5 shrink-0 ${styles.info_column_frame_337_item_style}`}></div> {/* info-column-frame-337-1 */}
                                    <div className={`flex flex-col items-start gap-2.5 shrink-0 ${styles.info_column_frame_337_item_style}`}></div> {/* info-column-frame-337-2 */}
                                    <div className={`flex flex-col items-start gap-2.5 shrink-0 ${styles.info_column_frame_337_item_style}`}></div> {/* info-column-frame-337-3 */}
                                    <div className={`flex flex-col items-start gap-2.5 shrink-0 ${styles.info_column_frame_337_item_style}`}></div> {/* info-column-frame-337-4 */}
                                </div>
                            </div>
                        </div>

                        {/* rank stats */}
                        <div className="flex items-center gap-2 md:gap-6 flex-1 self-stretch pt-6 md:pt-0">
                            <div className="flex justify-center items-center gap-2.5 self-stretch">
                                <div
                                    // Added responsive width and height classes
                                    className="w-[150px] h-[160px] md:w-[268px] md:h-[280px] aspect-[67/70] bg-cover bg-center bg-no-repeat"
                                    style={{backgroundImage: `url(${rankPIC})`}}
                                ></div>
                            </div>
                            <div className="flex flex-col justify-center items-start gap-8 flex-1 self-stretch">
                                <div className="flex h-24 flex-col items-start gap-1 self-stretch">
                                    <span className="text-white font-spaceGrotesk text-base font-bold not-italic font-dlig">
                                        Monthly Tournaments
                                    </span>
                                    <div className="flex flex-col items-start">
                                        <span className={`${styles.customLargeText}`}>
                                            0%
                                        </span>
                                        <span className="text-white font-dlig font-spaceGrotesk text-base font-bold not-italic">
                                            Winrate
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-1 self-stretch">
                                    <span className="text-white font-dlig font-spaceGrotesk text-base font-bold not-italic">
                                        Monthly Tournaments
                                    </span>
                                    <div className="flex flex-col items-start">
                                        <span className={`${styles.customLargeText}`}>
                                            0%
                                        </span>
                                        <span className="text-white font-dlig font-spaceGrotesk text-base font-bold not-italic">
                                            Winrate
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start of Bottom Section */}
                    {/* Use flex-col for mobile, md:flex-row for medium and up */}
                    <div className="flex flex-col md:flex-row max-w-[1536px] pt-6 gap-6 flex-1 mx-auto self-stretch pb-6">
                        {/* Right Column - Hero Highlights card */}
                        <div className={`flex flex-col ${styles.bottomMainColumn} ${styles.bottomMainColumn.right} order-first md:order-last max-w-[365px] mx-0 md:max-w-full md:mx-0`}>
                            <div className={`flex py-3 px-8 items-start gap-10 self-stretch ${styles.bottomNavbarGradient}`}>
                                <span className={`cursor-pointer`}>MSL Hero Highlights</span>
                            </div>
                            <div className="flex p-6 flex-col items-center gap-6 flex-1 self-stretch">
                                {/* Highlight Card 1 */}
                                <div className={`flex flex-col justify-center items-start p-6 gap-2.5 rounded-lg ${styles.highlightCard}`}>
                                    {/* The image is a background image on the div to achieve the desired positioning/clipping */}
                                    <div className={`${styles.highlightCardImage}`}></div>
                                    <div className="flex items-center md:ml-0 flex-1 self-stretch z-10">
                                    {/* The actual text block (assuming previous items-end for internal text alignment) */}
                                        <div className={`flex flex-col justify-end items-end md:items-start gap-3 self-stretch text-white`}>
                                            <div className={`${styles.highlightCardHeroText}`}>{user.mainHero}</div>
                                            <div className={`${styles.highlightCardSubheadingText}`}>Main</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Highlight Card 2 */}
                                <div className={`flex flex-col justify-center items-start p-6 gap-2.5 rounded-lg ${styles.highlightCard}`}>
                                    <div className={`${styles.highlightCardImage}`}></div>
                                    <div className="flex items-center md:ml-0 flex-1 self-stretch z-10">
                                    {/* The actual text block (assuming previous items-end for internal text alignment) */}
                                        <div className={`flex flex-col justify-end items-end md:items-start gap-3 self-stretch text-white`}>
                                            <div className={`${styles.highlightCardHeroText}`}>{user.mainHero}</div>
                                            <div className={`${styles.highlightCardSubheadingText}`}>Main</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left Column - Big empty card with navbar */}
                        {/* Make it normal order on mobile, order-first on md+ */}
                        {/* Add max-w-sm mx-auto for mobile, remove on md+ */}
                        <div className={`flex flex-col flex-1 ${styles.bottomMainColumn} ${styles.bottomMainColumn.left} order-none md:order-first max-w-[365px] mx-0 md:max-w-full md:mx-0`}>
                            <div className={`flex px-8 items-start gap-10 self-stretch ${styles.bottomNavbarGradient}`}>
                                <div className="w-[90vw] sm:w-full overflow-x-auto custom-scrollbar">
                                    <div className="flex space-x-4 py-2 whitespace-nowrap">
                                    <span className={`cursor-pointer`}>Recent MSL Tournament</span>
                                    <span className={`opacity-50 cursor-pointer`}>Monthly Tournaments</span>
                                    <span className={`opacity-50 cursor-pointer`}>MCC Appearance</span>
                                    <span className={`opacity-50 cursor-pointer`}>Followers</span>
                                    </div>
                                </div>
                                {/* Content area for the left card */}
                                <div className="flex-1 p-6">
                                    {/* Placeholder for any content that goes here */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End of Bottom Section */}
                    
                    

                </div>
            </div>

            {/* ✅ Render modal when true */}
            {showEditProfileModal && (
                <EditProfileModal
                user={selectedUser}
                onClose={() => setShowEditProfileModal(false)}
                />
            )}

        </AuthenticatedLayout>
    )
}
export default SLStudent;