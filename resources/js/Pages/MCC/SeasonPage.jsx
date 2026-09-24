import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head } from '@inertiajs/react';

const SeasonPage = ({ season, content, allSeasons }) => {
    const [isSeasonOpen, setIsSeasonOpen] = useState(false);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [scaledHeight, setScaledHeight] = useState(null);

    useLayoutEffect(() => {
        const updateScale = () => {
            const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
            const s = Math.min(1, viewportWidth / 1920);
            setScale(s);
            if (containerRef.current) {
                setScaledHeight(containerRef.current.scrollHeight * s);
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('orientationchange', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, []);

    const supportsZoom = typeof document !== 'undefined' && document.documentElement && 'zoom' in document.documentElement.style;

    // Get images from content
    const heroLeft = content?.hero_images?.hero_left?.path || '/images/MCC S2/Joy.png';
    const heroRight = content?.hero_images?.hero_right?.path || '/images/MCC S2/YZhong 1.png';
    const mccLogo = content?.logos?.mcc_logo?.path || '/images/MCC S2/MCCLOGO.png';
    const titleImage = content?.logos?.title_image?.path || '/images/MCC S2/Pamantasang lakas MSL COLLEGIATE CUP S2.png';
    const mainBg = content?.backgrounds?.main_bg?.path || '/images/MCC S2/Main BG.png';
    const heroBg = content?.backgrounds?.hero_bg?.path || '/images/MCC S2/PHINMA.jpg';
    const knockoutBg = content?.backgrounds?.knockout_bg?.path || '/images/MCC S2/Knockout BG.png';
    const redElement = content?.backgrounds?.red_element?.path || '/images/MCC S2/RED 1.png';
    const nuLogo = content?.teams?.nu_logo?.path || '/images/MCC S2/NU logo.png';
    const bottomThumbnail = content?.backgrounds?.bottom_thumbnail?.path || '/images/MCC S2/BOTTOM.png';
    const playoffsBracket = content?.backgrounds?.playoffs_bracket?.path || '/images/MCC S2/PLayoffs bracket.png';

    // Buttons
    const registrationBtn = content?.buttons?.registration?.path || '/images/MCC S2/Registration Button.png';
    const rulesBtn = content?.buttons?.rules?.path || '/images/MCC S2/Rules Button.png';
    const calendarBtn = content?.buttons?.calendar?.path || '/images/MCC S2/Calendar Button.png';
    const favouritesBtn = content?.buttons?.favourites?.path || '/images/MCC S2/Favourites Button.png';

    // Text content
    const aboutTitle = content?.text_content?.about_title?.text || 'MLBB COLLEGIATE CUP';
    const aboutDescription = content?.text_content?.about_description?.text || 'MSL Collegiate Cup (MCC) is the trademark collegiate tournament...';

    // Dummy data for teams and standings
    const topTeams = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: 'NU BULLDOGS' }));
    const standingsRows = Array.from({ length: 8 }, (_, i) => ({
        rank: i + 1,
        team: 'NU BULLDOGS',
        match: '0-0',
        games: '0-0',
        points: '00',
    }));

    const TeamPanel = ({ backgroundClass, teamName }) => (
        <div className="flex-1 self-stretch p-2.5 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className={`self-stretch rounded-[10px] outline outline-[0.85px] outline-offset-[-0.85px] flex flex-col justify-start items-start gap-2 overflow-hidden ${backgroundClass}`}>
                <div className="self-stretch p-2.5 flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <div className="self-stretch h-28 p-2 inline-flex justify-center items-center gap-2 overflow-hidden">
                        <img className="w-24 h-28 object-contain" src={`/${nuLogo}`} alt={teamName} />
                    </div>
                    <div className="self-stretch p-2 rounded-[10px] inline-flex justify-center items-center gap-2 overflow-hidden">
                        <div className="text-center justify-start text-white text-base font-bold font-montserrat leading-tight">{teamName}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ScorePanel = () => (
        <div className="flex-1 h-48 p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="self-stretch p-2.5 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
                <div className="text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px]">0 : 0</div>
            </div>
            <div className="self-stretch p-2.5 bg-yellow-400 rounded-[10px] flex flex-col justify-center items-center gap-2.5 overflow-hidden">
                <div className="text-center justify-start text-white text-xl font-bold font-montserrat leading-7">4:00 PM</div>
            </div>
        </div>
    );

    const MatchCard = () => (
        <div
            className="self-stretch p-2.5 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-yellow-400 inline-flex justify-start items-start gap-2.5 overflow-visible"
            style={{
                backgroundImage: `url('/${knockoutBg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <TeamPanel backgroundClass="bg-blue-900" teamName="NU BULLDOGS" />
            <ScorePanel />
            <TeamPanel backgroundClass="bg-red-800" teamName="NU BULLDOGS" />
        </div>
    );

    return (
        <MainLayout>
            <Head title={`MCC ${season.season_name}`} />
            <div className="w-full overflow-x-hidden bg-black" style={{ minHeight: scaledHeight ? `${Math.ceil(scaledHeight)}px` : undefined }}>
                <div style={{ width: '100vw', margin: '0 auto', overflow: 'hidden' }}>
                    <div style={supportsZoom ? { zoom: scale, width: '1920px', position: 'relative', left: '50%', transform: 'translateX(-50%)', transformOrigin: 'top left' } : { transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top left', position: 'relative', left: '50%', width: '1920px', willChange: 'transform' }}>
                        <div
                            ref={containerRef}
                            className="w-[1920px] bg-Background-Default-Default inline-flex flex-col justify-center items-center overflow-visible font-montserrat relative"
                            style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('/${mainBg}')`,
                                backgroundRepeat: 'no-repeat, repeat-y',
                                backgroundPosition: 'top center, top center',
                                backgroundSize: 'cover, 1920px auto',
                            }}
                        >
                            {/* Main Content */}
                            <div className="min-h-[6500px] flex flex-col justify-start items-center gap-1 overflow-visible pb-24">
                                {/* Hero Section */}
                                <div className="h-[3000px] xl:h-[2550px] flex flex-col justify-start items-center overflow-hidden">
                                    <div className="w-[1920px] h-[3000px] xl:h-[2550px] relative">
                                        {/* Background hero image */}
                                        <div className="w-[1920px] left-0 top-0 absolute inline-flex flex-col justify-start items-center gap-2.5">
                                            <img className="self-stretch h-[1011px]" src={`/${heroBg}`} alt="Hero" />
                                        </div>

                                        {/* Four buttons - Desktop */}
                                        <div className="w-[1200px] left-1/2 -translate-x-1/2 top-[1620px] absolute hidden xl:grid grid-cols-2 gap-6 place-items-center z-20">
                                            <div className="w-[520px] h-[220px] flex items-center justify-center group transition-transform duration-300 ease-out hover:scale-[1.04]">
                                                <img className="w-full h-full object-contain select-none group-hover:brightness-110 group-hover:drop-shadow-[0_0_16px_rgba(243,199,24,0.45)]" src={`/${registrationBtn}`} alt="Registration" />
                                            </div>
                                            <div className="w-[520px] h-[220px] flex items-center justify-center group transition-transform duration-300 ease-out hover:scale-[1.04]">
                                                <img className="w-full h-full object-contain select-none group-hover:brightness-110 group-hover:drop-shadow-[0_0_16px_rgba(243,199,24,0.45)]" src={`/${rulesBtn}`} alt="Rules" />
                                            </div>
                                            <div className="w-[520px] h-[220px] flex items-center justify-center group transition-transform duration-300 ease-out hover:scale-[1.04]">
                                                <a href="/MCC/calendar" className="block w-full h-full">
                                                    <img className="w-full h-full object-contain select-none cursor-pointer group-hover:brightness-110 group-hover:drop-shadow-[0_0_16px_rgba(243,199,24,0.45)]" src={`/${calendarBtn}`} alt="Calendar" />
                                                </a>
                                            </div>
                                            <div className="w-[520px] h-[220px] flex items-center justify-center group transition-transform duration-300 ease-out hover:scale-[1.04]">
                                                <img className="w-full h-full object-contain select-none group-hover:brightness-110 group-hover:drop-shadow-[0_0_16px_rgba(243,199,24,0.45)]" src={`/${favouritesBtn}`} alt="Favourites" />
                                            </div>
                                        </div>

                                        {/* MCC Logo */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-[1120px] z-20 inline-flex items-center justify-center">
                                            <img className="w-[260px] h-auto" src={`/${mccLogo}`} alt="MCC Logo" />
                                        </div>

                                        {/* Title */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-[1400px] z-20 inline-flex flex-col items-center justify-center">
                                            <img className="w-[1180px] h-auto" src={`/${titleImage}`} alt="Title" />
                                            <div className="mt-2 text-white text-5xl font-bold font-montserrat tracking-wider">MSL COLLEGIATE CUP</div>

                                            {/* Season Selector */}
                                            <div className="mt-8 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsSeasonOpen((v) => !v)}
                                                    className="group w-[380px] h-[68px] px-8 bg-gradient-to-br from-black via-neutral-950 to-black rounded-2xl border-2 border-yellow-400/80 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(243,199,24,0.3),inset_0_1px_0_rgba(243,199,24,0.1)] hover:shadow-[0_0_30px_rgba(243,199,24,0.5),inset_0_1px_0_rgba(243,199,24,0.2)] hover:border-yellow-400 transition-all duration-300 hover:scale-105 active:scale-100"
                                                >
                                                    <div className="text-yellow-400 text-3xl font-bold font-montserrat tracking-[0.08em] group-hover:text-yellow-300 transition-colors">
                                                        SEASON {season.season_number}
                                                    </div>
                                                    <svg className={`w-7 h-7 text-yellow-400 transition-all duration-300 group-hover:text-yellow-300 ${isSeasonOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none">
                                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isSeasonOpen && (
                                                    <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[380px] bg-gradient-to-br from-neutral-950 via-black to-neutral-950 rounded-xl border border-yellow-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(243,199,24,0.25)] backdrop-blur-sm overflow-hidden z-40">
                                                        {allSeasons.map((s) => (
                                                            <a
                                                                key={s.id}
                                                                href={route('MCC.season', s.route_slug)}
                                                                className={`group w-full px-8 py-5 flex items-center justify-between text-2xl font-bold font-montserrat tracking-[0.06em] transition-all duration-200 ${s.id === season.id
                                                                    ? 'text-yellow-400 bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-transparent cursor-default border-b border-yellow-400/20'
                                                                    : 'text-yellow-300/90 hover:bg-gradient-to-r hover:from-yellow-400/20 hover:via-yellow-400/10 hover:to-transparent hover:text-yellow-400'
                                                                    }`}
                                                            >
                                                                <span>SEASON {s.season_number}</span>
                                                                {s.is_active && (
                                                                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(243,199,24,0.6)] animate-pulse" />
                                                                )}
                                                                {s.id !== season.id && (
                                                                    <svg className="w-6 h-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                    </svg>
                                                                )}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hero Images */}
                                        <img className="absolute left-0 top-[880px] w-[840px] xl:w-[800px] h-auto z-10 select-none pointer-events-none" src={`/${heroLeft}`} alt="Hero Left" />
                                        <img className="absolute right-0 top-[860px] w-[680px] xl:w-[650px] h-auto z-10 select-none pointer-events-none" src={`/${heroRight}`} alt="Hero Right" />

                                        {/* About Section */}
                                        <div className="w-[1920px] min-h-[720px] p-2.5 left-0 absolute top-[2480px] xl:top-[2080px] inline-flex justify-center items-center overflow-visible">
                                            <div className="flex-1 self-stretch p-2.5 inline-flex flex-col justify-start items-start gap-2.5 overflow-visible">
                                                <div className="self-stretch p-2.5 flex flex-col justify-start items-center gap-2.5 overflow-visible">
                                                    <div className="text-center justify-start text-white text-4xl font-bold font-['Montserrat'] leading-[56px]">{aboutTitle}</div>
                                                </div>
                                                <div className="self-stretch p-2.5 flex flex-col justify-start items-center gap-2.5 overflow-visible">
                                                    <div className="w-[1364px] justify-start text-white text-3xl font-medium font-['Montserrat']">{aboutDescription}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TOP 8 TEAMS */}
                                <div className="w-[1720px] xl:w-[1292px] p-2.5 inline-flex flex-col justify-start items-center gap-2.5 overflow-hidden">
                                    <div className="w-[1500px] xl:w-[1082px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                                        <div className="w-72 text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px]">TOP 8 TEAMS</div>
                                    </div>

                                    <div className="w-[1500px] grid gap-4 justify-between overflow-hidden xl:hidden" style={{ gridTemplateColumns: 'repeat(4, 360px)' }}>
                                        {topTeams.map((team) => (
                                            <div key={team.id} className="p-2 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
                                                <div className="w-full h-96 bg-black rounded-[10px] outline outline-[0.85px] outline-offset-[-0.85px] outline-yellow-400 flex flex-col justify-start items-start gap-2 overflow-hidden">
                                                    <div className="self-stretch flex-1 p-2.5 flex flex-col justify-start items-start gap-2 overflow-hidden">
                                                        <div className="self-stretch h-64 p-2 inline-flex justify-center items-center gap-2 overflow-hidden">
                                                            <img className="w-44 h-56" src={`/${nuLogo}`} alt={team.name} />
                                                        </div>
                                                        <div className="self-stretch flex-1 py-3 px-4 bg-yellow-400 rounded-[10px] inline-flex justify-center items-center overflow-hidden">
                                                            <div className="text-center justify-start text-black text-[26px] xl:text-2xl font-bold font-montserrat leading-9">{team.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* STANDINGS */}
                                <div className="w-[1720px] xl:w-[1292px] mt-12 p-2.5 inline-flex flex-col justify-start items-center gap-5 overflow-hidden">
                                    <div className="w-[1500px] xl:w-[1082px] h-[80px] p-2.5 bg-black rounded-[10px] outline outline-2 outline-offset-[-2px] outline-yellow-400 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                                        <div className="w-72 text-center justify-start text-white text-4xl font-bold font-montserrat leading-[56px]">STANDINGS</div>
                                    </div>
                                    {/* Standings table would go here - simplified for brevity */}
                                </div>

                                {/* Bottom Thumbnails */}
                                <div className="p-2.5 inline-flex justify-center items-start gap-5 overflow-hidden">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="p-2.5 flex justify-start items-start gap-2.5 overflow-hidden">
                                            <img className="w-96 h-52 object-cover" src={`/${bottomThumbnail}`} alt={`Bottom ${i + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SeasonPage;
