import React from 'react';
import { Helmet } from "react-helmet";
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEvents.jsx";
import styles from './events.module.scss';
import MCClogoHD from './MCC HD.png';
import laylaImage from './LAYLA PARANORMAL OPERATIVE COLLECTOR RENDER PNG 2.png';
import REDimage from './RED 1.png';

function Events({ events = [], activeMccSeason }) {
    // Determine the MCC link based on active season
    const mccLink = activeMccSeason
        ? `/MCC/${activeMccSeason.route_slug}`
        : '/MCC';

    return (
        <>
            <Head title="Events" />
            <Helmet>
                <title>Events</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
            </Helmet>
            <AuthenticatedLayout>
                <main className="relative text-center mb-12 pt-10 px-4 sm:px-4 md:px-6 lg:px-0 lg:mx-auto max-w-[1440px]">
                    {/* MSL Collegiate Cup (MCC) Section */}
                    <section
                        className="relative overflow-hidden mx-auto flex flex-col lg:flex-row justify-end items-start gap-5 flex-shrink-0 rounded-[30px]
                bg-[rgba(36,36,36,0.8)] w-[calc(100%-20px)] mx-auto lg:w-full lg:max-w-[1418px] lg:mx-auto"
                        style={{ maxWidth: '1418px', width: '100%', padding: '20px 30px' }}
                    >
                        {/* DESKTOP LAYOUT: TITLE + IMAGE - 50/50 SPLIT */}
                        <div className="hidden lg:flex justify-between items-stretch w-full lg:p-5">

                            {/* Text Content (left on desktop) - W-1/2 */}
                            <div className="flex flex-col justify-start items-start flex-1 p-0 h-auto lg:h-auto mt-0 order-2 lg:order-first w-1/2">
                                <h3 className="text-white text-left font-['Montserrat'] text-[30px] font-bold leading-[140%] w-full">
                                    MSL Collegiate Cup (MCC)
                                </h3>
                                {/* ... Rest of the text content remains unchanged ... */}
                                <div className="p-0 pt-4 w-full">
                                    <h4 className="text-left font-['Montserrat'] text-[#F3C718] text-[20px] font-bold leading-[140%]">What is MCC?</h4>
                                    <p className="text-white pt-3 text-left font-['Montserrat'] text-[18px] font-normal leading-[140%]">
                                        MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national stage.
                                        MCC is a potential franchise that both promotes the participation of MSL Communities and accredited organizations.
                                    </p>
                                </div>

                                <div className="p-0 pt-3 w-full">
                                    <h4 className="text-left font-['Montserrat'] text-[#F3C718] text-[20px] font-bold leading-[140%]">Who can join MCC?</h4>
                                    <p className="text-white pt-3 text-left font-['Montserrat'] text-[18px] font-normal leading-[140%]">
                                        Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                                    </p>
                                </div>

                                <div className="mt-4 pt-3">
                                    <Link href={mccLink}>
                                        <div className="flex w-[190px] h-[58px] justify-center items-center gap-[5.7px] rounded-full border border-[#F3C718] bg-[#F3C718] cursor-pointer hover:bg-[#F3C718] transition-all duration-300">
                                            <span className="text-black font-['Montserrat'] text-[18.5px] font-bold leading-[140%]">Learn More</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Independent Layla (full section height) */}
                            <img
                                src={laylaImage}
                                alt="Layla Character Art"
                                className="
                            hidden lg:block
                            absolute top-0 right-0 
                            h-full
                            object-cover
                            z-0
                        "
                                style={{
                                    width: "60%",     // you can adjust this freely
                                    objectPosition: "center"
                                }}
                            />

                            {/* REDimage overlay (lower right of Layla) */}
                            <img
                                src={REDimage}
                                alt="Red Decorative Element"
                                className="
                            hidden lg:block
                            absolute
                            z-10
                            object-contain
                        "
                                style={{
                                    width: "380px",         // adjust freely
                                    bottom: "-10px",         // pushes from bottom
                                    right: "-10px",          // pushes from right
                                }}
                            />


                            {/* Image (right on desktop) - W-1/2, RELATIVE, BACKGROUND LAYLA + CENTERED LOGO */}
                            <div
                                className="flex-shrink-0 order-1 lg:order-last w-1/2 relative overflow-hidden h-full"
                            >
                                {/* MCC Logo – centered above Layla */}
                                <div className="relative z-10 w-full h-full flex justify-end items-center pr-6">
                                    <img
                                        src={MCClogoHD}
                                        alt="MCC Logo"
                                        className="w-[420px] h-[420px] object-contain rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Independent Layla Background for Mobile */}
                        <img
                            src={laylaImage}
                            alt="Layla Character Art"
                            className="block lg:hidden absolute top-0 left-0 w-full h-full object-cover z-0"
                            style={{
                                objectPosition: "center",
                                opacity: 0.3,
                                maxHeight: "100%",
                                overflow: "hidden"
                            }}
                        />

                        {/* Independent RED Image for Mobile */}
                        <img
                            src={REDimage}
                            alt="Red Decorative Element"
                            className="block lg:hidden absolute z-10"
                            style={{ width: "250px", bottom: "-10px", right: "-10px" }}
                        />

                        {/* MOBILE BODY TEXT + IMAGES */}
                        <div className="flex flex-col lg:hidden relative w-full overflow-hidden">

                            {/* MCC Logo centered at top */}
                            <img
                                src={MCClogoHD}
                                alt="MCC Logo"
                                className="absolute z-20 left-1/2 transform -translate-x-1/2"
                                style={{ width: "100px", top: "15px" }}
                            />

                            {/* MCC Logo centered at top */}
                            <img
                                src={MCClogoHD}
                                alt="MCC Logo"
                                className="absolute z-20 left-1/2 transform -translate-x-1/2"
                                style={{ width: "100px", top: "15px" }}
                            />

                            {/* Text Content */}
                            <div className="relative z-30 w-full flex flex-col items-center pt-24 mt-2 px-2">
                                {/* What is MCC */}
                                <h3 className="text-white text-center font-['Montserrat'] text-[20px] font-bold leading-[130%] mb-2 pb-0">
                                    MSL Collegiate Cup (MCC)
                                </h3>
                                <div className="w-full  text-left mb-3">
                                    <h4 className="text-[#F3C718] font-['Montserrat'] font-bold leading-[140%] text-[14px] sm:text-[15px]">
                                        What is MCC?
                                    </h4>
                                    <p className="text-white font-['Montserrat'] text-[12px] sm:text-[13px] leading-[140%] mt-1">
                                        MSL Collegiate Cup (MCC) is a platform for collegiate players to showcase their skills in the national stage.
                                        MCC is a potential franchise that promotes participation of the MSL Communities and accredited organizations.
                                    </p>
                                </div>

                                {/* Who can join MCC */}
                                <div className="w-full text-left mb-4">
                                    <h4 className="text-[#F3C718] font-['Montserrat'] font-bold leading-[140%] text-[14px] sm:text-[15px]">
                                        Who can join MCC?
                                    </h4>
                                    <p className="text-white font-['Montserrat'] text-[12px] sm:text-[13px] leading-[140%] mt-1">
                                        Aspiring Student-Gamers from MSL Communities and MSL Network Organizations are allowed to join.
                                    </p>
                                </div>

                                {/* Learn More Button */}
                                <div className="w-full flex justify-start mt-3">
                                    <Link href={mccLink}>
                                        <div className="flex w-[140px] sm:w-[150px] h-[40px] sm:h-[45px] justify-center items-center gap-1 rounded-full border border-[#F3C718] bg-[#F3C718] cursor-pointer hover:bg-[#F3C718] transition-all duration-300">
                                            <span className="text-black font-['Montserrat'] text-[14px] sm:text-[15px] font-bold leading-[140%]">
                                                Learn More
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>



                    </section>

                    {/* Other MSL Events Section */}
                    <section className="mx-auto flex flex-col items-center flex-shrink-0 py-4" style={{ maxWidth: '1418px' }}>
                        {/* Title */}
                        <div className="flex w-full px-4 lg:px-0 items-center gap-2 md:gap-9">
                            <h2 className="text-white text-left font-['Montserrat'] text-[20px] md:text-[30px] font-bold leading-[140%] w-full">
                                OTHER MSL EVENTS
                            </h2>
                        </div>

                        {/* Cards Grid: 2 columns on mobile, 3 columns on desktop with centering for odd last card */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 lg:gap-y-5 justify-items-center w-full px-2 md:px-0 pt-4">
                            {events.map((event, index) => {
                                // Construct the URL to point to the controller's show method
                                // This allows the controller to handle dynamic redirects
                                let eventUrl = `/Events/${event.event_canonical || event.id}`;
                                
                                // Ensure the URL starts with / if it's internal and not a full URL
                                if (eventUrl && !eventUrl.startsWith('/') && !eventUrl.startsWith('http')) {
                                    eventUrl = '/' + eventUrl;
                                }

                                // Force hard refresh for Campus Tournament to fix login/CSRF issues
                                const isCampusTournament = eventUrl.toLowerCase().includes('campustournament') ||
                                    (event.event_name && event.event_name.toLowerCase().includes('campus tournament'));

                                // Use standard <a> tag for hard refresh, Inertia <Link> for others
                                const LinkComponent = isCampusTournament ? 'a' : Link;

                                return (
                                    <LinkComponent href={eventUrl} key={event.id}>
                                        <div
                                            className={`
                                        flex flex-col justify-center items-center bg-[rgba(36,36,36,0.8)] shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.14),30px_30px_80px_rgba(243,199,24,0.14)] overflow-hidden w-full max-w-[463.68px]
                                        h-[180px] md:h-[462.825px] cursor-pointer hover:shadow-[inset_-30px_-30px_80px_#141414,inset_30px_20px_100px_#0A0A0A,-30px_-30px_80px_rgba(255,255,255,0.2),30px_30px_80px_rgba(243,199,24,0.2)] transition-all duration-300
                                        ${
                                                // Conditional centering for the last odd card on mobile only
                                                (events.length % 2 === 1 && index === events.length - 1)
                                                    ? 'col-span-1 mx-auto'
                                                    : ''
                                                }
                                    `}
                                        >
                                            <div
                                                className="
                                                flex flex-col items-center flex-1 self-stretch
                                                bg-no-repeat bg-center relative
                                                h-[80px] md:h-[280px]
                                                px-0 pt-1 md:pt-0
                                                bg-contain md:bg-cover
                                                p-[10px] md:p-0
                                            "
                                                style={{
                                                    backgroundImage: `url(/images/MCC/Events/${event.event_logo})`,
                                                    backgroundSize: '85%', // smaller on mobile
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center'
                                                }}
                                            >


                                                <div className="absolute top-3 md:top-8 left-0 flex h-5 md:h-[42.075px] px-0.5 md:px-[9.35px] justify-center items-center gap-0.5 md:gap-[9.35px] rounded-r-md md:rounded-r-[16.83px] bg-red-600">
                                                    <span className="text-white font-['Montserrat'] text-[10px] md:text-lg font-bold">{event.event_state}</span>
                                                </div>
                                            </div>

                                            <div className="flex h-[100px] md:h-[182px] flex-col items-center w-full">
                                                <div className="pt-0">
                                                    <p className="text-white text-[8px] md:text-[26.18px] font-['Montserrat'] font-bold text-center leading-tight">
                                                        {event.event_title}
                                                    </p>
                                                </div>
                                                <div className="pt-2 px-2">
                                                    <p className="text-white font-['Montserrat'] text-[8.5px] md:text-[20.505px] font-normal text-center leading-tight md:leading-snug">
                                                        {event.event_subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </LinkComponent>
                                );
                            })}
                        </div>
                    </section>
                </main>
            </AuthenticatedLayout>
        </>
    );
}

export default Events;