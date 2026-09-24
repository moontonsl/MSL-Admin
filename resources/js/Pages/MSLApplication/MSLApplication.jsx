import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutMSLApplication.jsx";
import { Helmet } from "react-helmet";
import {
    Calendar,
    CheckCircle2,
    ShieldCheck,
    MonitorSmartphone,
    Star,
    Gamepad2,
    Users,
} from "lucide-react"; // lucide-react icons


const MSLApplication = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                rel="stylesheet"
            />
            </Helmet>

            <Head title="MSL Application" />

            {/* ================= FRAME 434 ================= */}
            <div className="flex h-auto min-h-[241px] p-1 justify-center items-center gap-4 self-stretch bg-transparent">
                <div className="flex flex-col px-2 py-2 items-start gap-2 flex-1 self-stretch">
                    <div className="flex flex-col h-auto p-2 items-start gap-2 self-stretch">
                        <div className="flex p-2 justify-center items-center text-center w-full">
                            <h1 className="text-white font-bold font-['Montserrat'] text-[24px] sm:text-[32px] lg:text-[40px] uppercase leading-tight w-full lg:whitespace-nowrap">
                                Become a Leader in the Land of Dawn!
                            </h1>
                        </div>

                    <div className="flex p-2 justify-center items-start gap-2 self-stretch">
                    <p className="text-white text-center font-medium font-['Montserrat'] text-[12px] sm:text-[16px] leading-relaxed max-w-[805px]">
                        Join the Moonton Student Leaders Philippines Community and lead
                        your school’s gaming community to new heights.
                        <br />
                        Applications are open until{" "}
                        <span className="font-bold">March 2, 2025</span>
                        <br />
                        Don’t Wait—{" "}
                        <span className="text-[#F2C21A] font-bold">Apply Now!</span>
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* ================= NEW SECTION BELOW FRAME 434 (Hanzo) =================
                Mobile: background image behind text
                Desktop (lg+): side-by-side with actual <img>, no bg on container
            */}
            <section
                className="relative flex flex-col lg:flex-row px-4 justify-center items-center gap-6 lg:gap-10 self-stretch 
                            bg-[url('/mslapplication-hanzo.png')] bg-cover bg-center 
                            lg:bg-none bg-[rgba(12,12,12,0.20)] backdrop-blur-md py-6 sm:py-8 lg:py-1"
                >

                {/* Dark overlay only on mobile/tablet */}
                <div className="absolute inset-0 bg-black/50 lg:hidden" />

                {/* Desktop-only image */}
                <div className="hidden lg:flex w-[781px] h-[585px] justify-center items-end p-2">
                    <img
                    src="/mslapplication-hanzo.png"
                    alt="MSL Students"
                    className="w-[640px] h-[576px] object-cover rounded-lg"
                    />
                </div>
                

                {/* Right: Requirements (always visible; with subtle bg on mobile for readability) */}
                <div className="relative z-10 flex flex-col w-full lg:w-[600px] p-4 gap-1 bg-black/50 lg:bg-transparent rounded-lg">
                    {/* Title */}
                    <h2 className="text-white font-bold font-['Montserrat'] text-[20px] sm:text-[24px] lg:text-[30px] pl-[30px]">
                        Who Can Apply?
                    </h2>
                {/* Senior High School Students */}
                <div className="flex flex-col p-4 gap-6 bg-transparent">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-[30px] bg-black shadow-[0_0_10px_#F2C21A]">
                        <Calendar className="w-8 h-8 text-[#F2C21A]" />
                        <h2 className="text-white font-bold font-['Montserrat'] text-[14px] sm:text-[24px] lg:text-[30px]">
                            Senior High School Students
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 pl-4 sm:pl-8">
                    <Requirement text="Must be enrolled in a DepEd-registered school." />
                    <Requirement text="Grade 11 or incoming Grade 12." />
                    <Requirement text="With Working Laptop/PC or Tablet." />
                    <Requirement text="Played MLBB for at least 3 months." />
                    </div>
                </div>

                {/* College / University Students */}
                <div className="flex flex-col p-4 gap-6 bg-transparent">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-[30px] bg-black shadow-[0_0_10px_#F2C21A]">
                    <Calendar className="w-8 h-8 text-[#F2C21A]" />
                    <h2 className="text-white font-bold font-['Montserrat'] text-[13.5px] sm:text-[24px] lg:text-[30px]">
                        College / University Students
                    </h2>
                    </div>

                    <div className="flex flex-col gap-4 pl-4 sm:pl-8">
                    <Requirement text="Must be enrolled in a CHED-recognized college or university." />
                    <Requirement text="Open to all year levels and courses." />
                    <Requirement text="With Working Laptop/PC or Tablet." />
                    <Requirement text="Played MLBB for at least 3 months." />
                    </div>
                </div>
                </div>
            </section>

            {/* === Third Frame 434: What We’re Looking For ===
                Mobile: 2-column grid
                Tablet+: keep it neat; Desktop: your wide layout
            */}
            <section className="w-full flex flex-col items-center gap-5 px-4 sm:px-6 md:px-10 py-10 bg-[rgba(12,12,12,0.20)]">
                {/* Title */}
                <h2 className="text-white font-bold font-['Montserrat'] text-[24px] sm:text-[30px] lg:text-[30px] leading-[120%] whitespace-nowrap">
                    What We’re Looking For?
                </h2>

                {/* Subtitle */}
                <p className="text-white font-medium font-['Montserrat'] text-[12px] sm:text-[16px] leading-[120%] text-center">
                    We’re searching for student leaders with these qualities:
                </p>

                {/* Card Container (Mobile full width, desktop row) */}
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 place-items-center max-w-[1200px] py-4 mx-auto">
                    <Card img="leader.png" title="Leadership Capacity" desc="A strong moral compass" />
                    <Card img="honesty.png" title="Integrity & Honesty" desc="A strong moral compass." />
                    <Card
                    icon={<MonitorSmartphone className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] text-[#F2C21A]" />}
                    title="Tech-Savvy"
                    desc="Familiar with tools like Google Forms and Sheets."
                    />
                    <Card img="determination.png" title="Determination" desc="Committed to growing the MLBB Community." />
                </div>
            </section>

            {/* ===== WHY JOIN SECTION (Silvanna) =====
                Mobile: background image behind text
                Desktop: side-by-side with real image, no bg on container
            */}
            <section
            className="relative flex flex-col lg:flex-row justify-center items-center h-auto lg:h-[650px] w-full 
                        bg-[rgba(12,12,12,0.20)] backdrop-blur-md px-4 sm:px-6 lg:px-12 py-10 
                        bg-[url('/mslapplication-silvanna.png')] bg-cover 
                        bg-[position:70%_center] lg:bg-none"
            >

                {/* Overlay for readability (mobile only) */}
                <div className="absolute inset-0 bg-black/50 lg:hidden" />

                {/* Wrapper */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-[1451px] gap-8 lg:gap-10">
                    {/* LEFT SIDE - TEXT CONTENT */}
                    <div className="flex flex-col items-start justify-center max-w-[500px] bg-black/60 lg:bg-transparent p-6 rounded-lg">
                    <h2 className="text-white font-['Montserrat'] font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-[140%] mb-4">
                        WHY JOIN?
                    </h2>

                    <p className="text-[#F2C21A] font-medium font-['Montserrat'] text-[16px] sm:text-[18px] lg:text-[20px] leading-[140%] mb-6">
                        Why Become a Moonton Student Leader?
                    </p>

                    <div className="flex flex-col gap-4">
                        <Bullet icon={<ShieldCheck className="w-7 h-7 text-[#F2C21A]" />} text="Lead your school’s MLBB Community." />
                        <Bullet icon={<Star className="w-7 h-7 text-[#F2C21A]" />} text="Enhance Leadership and Collaboration Skills." />
                        <Bullet icon={<Gamepad2 className="w-7 h-7 text-[#F2C21A]" />} text="Organize and manage fun gaming events." />
                        <Bullet icon={<Users className="w-7 h-7 text-[#F2C21A]" />} text="Connect with other passionate MLBB Leaders." />
                    </div>

                    <p className="text-white text-[14px] lg:text-[16px] font-medium leading-[140%] mt-6">
                        This is your chance to make a difference, inspire your peers, and grow as a leader.
                    </p>

                    <div className="inline-flex mt-6 h-[60px] px-[32px] rounded-[10px] bg-[#F2C21A] shadow-[0_0_10px_#F2C21A] justify-center items-center cursor-pointer">
                        <span className="text-[#2C2C2C] text-center font-bold font-['Montserrat'] text-[20px] lg:text-[26px] leading-[140%]">
                        APPLY NOW
                        </span>
                    </div>
                    </div>

                    {/* RIGHT SIDE - IMAGE (desktop only) */}
                    <div className="hidden lg:flex justify-end items-start w-full max-w-[769px] h-[559px]">
                    <img
                        src="/mslapplication-silvanna.png"
                        alt="MSL Students"
                        className="w-[969px] h-[559px] object-cover rounded-lg"
                    />
                    </div>
                </div>
            </section>
    </AuthenticatedLayout>
    );
};

/* ✅ Small helper component for requirements */
const Requirement = ({ text }) => (
    <div className="flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-[#F2C21A] flex-shrink-0" />
        <p className="text-white font-medium font-['Montserrat'] text-[12px] sm:text-[16px] leading-snug">
            {text}
        </p>
    </div>
);

/* ✅ Card: responsive width + hover animation */
const Card = ({ img, icon, title, desc }) => (
    <div
        className="flex flex-col items-center justify-center gap-5 
                w-full max-w-[345px] 
                h-[220px] sm:h-[280px] lg:h-[400px] 
                p-4 sm:p-6 rounded-[20px] border border-white/80 
                bg-transparent shadow-[-20px_30px_7.5px_rgba(0,0,0,0.30)]
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-[0_0_20px_#F2C21A]/70"
    >
        {img ? (
        <img
            src={img}
            alt={title}
            className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] object-contain"
        />
        ) : (
        icon
        )}
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
        <h3 className="text-white font-bold font-['Montserrat'] text-[14px] sm:text-[20px] lg:text-[24px] leading-[120%]">
            {title}
        </h3>
        <p className="text-white font-medium font-['Montserrat'] text-[10px] sm:text-[14px] lg:text-[18px] leading-[120%]">
            {desc}
        </p>
        </div>
    </div>
    );



/* ✅ Helper for bullet points */
const Bullet = ({ icon, text }) => (
    <div className="flex items-center gap-3">
        {icon}
        <p className="text-white text-[14px] lg:text-[16px] font-medium leading-[140%]">
        {text}
        </p>
    </div>
);

export default MSLApplication;
