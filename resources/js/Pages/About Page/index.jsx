import { Head } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import React from "react";

export default function ABOUTPage() {
    return (
        <MainLayout>
            <Head>
                <title>About - MSL Philippines</title>
                <meta name="description" content="Learn about MSL Philippines, our mission, vision, and the responsibilities of Moonton Student Leaders." />
                <meta name="keywords" content="MSL Philippines, Mobile Legends, Campus Championship, esports, university, tournament, MLBB" />
            </Head>
            
            <div className="min-h-screen bg-black text-white">
                {/* Background */}
                <div 
                    className="min-h-screen bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/images/About Page/MainBG.png')"
                    }}
                >
                    <div className="min-h-screen bg-black/70">
                        <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-16">
                            
                            {/* Hero Section */}
                            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-20">
                                <div className="order-2 lg:order-1">
                                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6 font-montserrat">
                                        MSL Philippines
                                    </h1>
                                    <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-4 md:mb-6 leading-relaxed font-montserrat">
                                        Welcome to Moonton Student Leaders Philippines, a vibrant and dedicated community for student 
                                        gamers passionate about Mobile Legends Bang Bang. Officially established in October 2020, we 
                                        are committed to promoting and supporting the gaming community across various schools in the 
                                        Philippines.
                                    </p>
                                    <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed font-montserrat">
                                        As of September 2024, the organization has a total of 81 communities in different universities 
                                        across the country. These schools are the exclusive and major target audience for every event held 
                                        not just by the Moonton Student Leader PH but also by Moonton Philippines Technologies, Inc.
                                    </p>
                                    <div className="w-32 p-2.5 bg-zinc-800 rounded-[30px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
                                        <div className="justify-start text-white text-sm md:text-base font-semibold font-['Inter'] leading-normal">Read More</div>
                                    </div>
                                </div>
                                <div className="hidden lg:flex justify-center order-1 lg:order-2">
                                    <img 
                                        src="/images/About Page/SL Logo.png" 
                                        alt="MSL Philippines Logo" 
                                        className="w-80 h-80 object-contain"
                                    />
                                </div>
                            </div>

                            {/* Mission and Vision */}
                            <div className="flex flex-col lg:flex-row gap-8 mb-12 md:mb-20 justify-center items-center mt-8 md:mt-16">
                                {/* Mobile Layout */}
                                <div className="block lg:hidden w-full max-w-sm h-64 relative mx-auto px-4">
                                    {/* Our Mission */}
                                    <div className="w-full px-3.5 py-1 left-0 top-[16px] absolute bg-black rounded-xl shadow-[0px_0px_8px_-2.809999942779541px_rgba(242,194,26,1.00)] inline-flex flex-col justify-start items-start overflow-hidden">
                                        <div className="self-stretch h-7 inline-flex justify-start items-center overflow-hidden">
                                            <div className="text-center justify-start text-white text-xl font-bold font-['Montserrat'] leading-7">Our Mission</div>
                                        </div>
                                        <div className="self-stretch h-20 py-1 inline-flex justify-start items-start gap-1 overflow-hidden">
                                            <div className="w-full pr-16 justify-start text-white text-[6px] font-normal font-['Montserrat'] leading-[8px]">
                                                Empower student-gamers to lead vibrant MLBB communities in their schools by fostering integrity, time management, 
                                                friendliness, adaptability, responsiveness, and academic excellence. Guided by Moonton Philippines, 
                                                the Moonton Student Leaders create inclusive, exciting, and impactful campus initiatives that unite players, 
                                                boost school pride, and prove that gaming passion can go together with academic success.
                                            </div>
                                        </div>
                                    </div>
                                    <img className="w-14 h-14 right-2 top-[-8px] absolute object-contain" src="/images/About Page/Shiny_Harper 1.png" alt="Mission Icon" />
                                    
                                    {/* Our Vision */}
                                    <div className="w-full h-28 px-3.5 py-1 left-0 top-[155px] absolute bg-black rounded-xl shadow-[0px_0px_8px_-2.809999942779541px_rgba(243,199,24,1.00)] inline-flex flex-col justify-start items-start overflow-hidden">
                                        <div className="self-stretch inline-flex justify-start items-center overflow-hidden">
                                            <div className="text-center justify-start text-white text-xl font-bold font-['Montserrat'] leading-7">Our Vision</div>
                                        </div>
                                        <div className="self-stretch py-1 inline-flex justify-start items-start gap-1 overflow-hidden">
                                            <div className="w-full pr-16 justify-start text-white text-[6px] font-normal font-['Montserrat'] leading-[8px]">
                                                To be the leading network of student-gamers in the Philippines who embody integrity, leadership, 
                                                and community spirit—bridging the worlds of gaming and academics, building strong MLBB communities 
                                                and inspiring the next generation of responsible esports leaders.
                                            </div>
                                        </div>
                                    </div>
                                    <img className="w-16 h-16 right-2 top-[137px] absolute object-contain" src="/images/About Page/Let21 1.png" alt="Vision Icon" />
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-stretch">
                                    {/* Our Mission */}
                                    <div className="w-full h-full min-h-[20rem] px-9 py-4 bg-black rounded-[30px] shadow-[0px_0px_10px_-2.809999942779541px_rgba(242,194,26,1.00)] flex flex-col justify-start items-start relative">
                                        <div className="self-stretch inline-flex justify-start items-center overflow-hidden mb-2">
                                            <div className="text-center justify-start text-white text-3xl font-bold font-['Montserrat'] leading-10">Our Mission</div>
                                        </div>
                                        <div className="self-stretch flex-1 py-2.5 inline-flex justify-start items-start gap-2.5">
                                            <div className="w-full justify-start text-white text-base font-medium font-['Montserrat'] leading-relaxed">
                                                Empower student-gamers to lead vibrant MLBB communities in their schools by fostering integrity, time management, 
                                                friendliness, adaptability, responsiveness, and academic excellence. Guided by Moonton Philippines, 
                                                the Moonton Student Leaders create inclusive, exciting, and impactful campus initiatives that unite players, 
                                                boost school pride, and prove that gaming passion can go together with academic success.
                                            </div>
                                        </div>
                                        <img 
                                            src="/images/About Page/Shiny_Harper 1.png" 
                                            alt="Mission Icon" 
                                            className="absolute -right-4 -top-16 w-[138px] h-[143px] object-contain z-10"
                                        />
                                    </div>

                                    {/* Our Vision */}
                                    <div className="w-full h-full min-h-[20rem] px-9 py-4 bg-black rounded-[30px] shadow-[0px_0px_10px_-2.809999942779541px_rgba(242,194,26,1.00)] flex flex-col justify-start items-start relative">
                                        <div className="self-stretch inline-flex justify-start items-center overflow-hidden mb-2">
                                            <div className="text-center justify-start text-white text-3xl font-bold font-['Montserrat'] leading-10">Our Vision</div>
                                        </div>
                                        <div className="self-stretch flex-1 py-2.5 inline-flex justify-start items-start gap-2.5">
                                            <div className="w-full justify-start text-white text-base font-medium font-['Montserrat'] leading-relaxed">
                                                To be the leading network of student-gamers in the Philippines who embody integrity, leadership, 
                                                and community spirit—bridging the worlds of gaming and academics, building strong MLBB communities 
                                                and inspiring the next generation of responsible esports leaders.
                                            </div>
                                        </div>
                                        <img 
                                            src="/images/About Page/Let21 1.png" 
                                            alt="Vision Icon" 
                                            className="absolute -right-4 -top-16 w-[138px] h-[143px] object-contain z-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* MSL Responsibilities */}
                            <div className="mb-12 md:mb-20">
                                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    <div className="text-left w-full">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-8 font-montserrat">
                                            WHAT ARE THE RESPONSIBILITIES OF AN MSL?
                                        </h2>
                                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 font-montserrat">
                                            Moonton Student Leaders (MSLs) play a crucial role in our 
                                            community. They are responsible for:
                                        </p>
                                        <div className="text-sm md:text-base lg:text-lg text-gray-300 space-y-2 font-montserrat">
                                            <p>Organizing events and tournaments.</p>
                                            <p>Promoting Mobile Legends: Bang Bang.</p>
                                            <p>Supporting the gaming community in their schools.</p>
                                            <p>Acting as ambassadors for Moonton and the Mobile Legends game.</p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex justify-center">
                                        <img 
                                            src="/images/About Page/SILVA1.png" 
                                            alt="MSL Character" 
                                            className="w-96 h-96 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Departments Section */}
                            <div className="self-stretch p-2.5 inline-flex flex-col justify-start items-center gap-[5px] overflow-hidden">
                                <div className="self-stretch h-auto lg:h-11 inline-flex justify-center items-center overflow-hidden">
                                    <div className="justify-start text-white text-2xl md:text-3xl lg:text-4xl font-bold font-['Montserrat'] leading-tight lg:leading-[48px]">DEPARTMENTS</div>
                                </div>
                                <div className="self-stretch h-auto lg:h-8 inline-flex justify-center items-center overflow-hidden mb-4 lg:mb-0">
                                    <div className="justify-start text-white text-lg md:text-2xl lg:text-3xl font-medium font-['Montserrat'] leading-tight lg:leading-9">The Backbone of Our Operations</div>
                                </div>
                                
                                {/* Mobile: 2x2 Grid with proper sizing */}
                                <div className="block lg:hidden w-full max-w-sm mx-auto">
                                    <div className="grid grid-cols-2 gap-3 p-4">
                                        <div className="w-full aspect-square inline-flex flex-col justify-center items-center overflow-hidden">
                                            <img className="w-full h-full object-contain" src="/images/About Page/GAD.png" alt="General Affairs Department" />
                                        </div>
                                        <div className="w-full aspect-square inline-flex flex-col justify-center items-center overflow-hidden">
                                            <img className="w-full h-full object-contain" src="/images/About Page/CD.png" alt="Campuses Department" />
                                        </div>
                                        <div className="w-full aspect-square inline-flex flex-col justify-center items-center overflow-hidden">
                                            <img className="w-full h-full object-contain" src="/images/About Page/CSMD.png" alt="Contents and Social Media Department" />
                                        </div>
                                        <div className="w-full aspect-square inline-flex flex-col justify-center items-center overflow-hidden">
                                            <img className="w-full h-full object-contain" src="/images/About Page/PD.png" alt="Partnerships Department" />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop: 1x4 Row centered within max width */}
                                <div className="hidden lg:block w-full">
                                    <div className="mx-auto max-w-[1200px] h-80 px-4 py-2 grid grid-cols-4 gap-8 place-items-center">
                                        <div className="w-64 h-64 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                                            <img className="w-64 h-64 object-contain" src="/images/About Page/GAD.png" alt="General Affairs Department" />
                                        </div>
                                        <div className="w-64 h-64 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                                            <img className="w-64 h-64 object-contain" src="/images/About Page/CD.png" alt="Campuses Department" />
                                        </div>
                                        <div className="w-64 h-64 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                                            <img className="w-64 h-64 object-contain" src="/images/About Page/CSMD.png" alt="Contents and Social Media Department" />
                                        </div>
                                        <div className="w-64 h-64 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                                            <img className="w-64 h-64 object-contain" src="/images/About Page/PD.png" alt="Partnerships Department" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
