import React from "react";
import { Link } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import communityFrame from "./Images/NEW COMMUNITY.png";
import aboutUsFrame from "./Images/NEW ABOUT US.png";
import assetsFrame from "./Images/NEW ASSETS.png";
import msldirectoryFrame from "./Images/NEW MSL DIRECTORY.png";

export default function ResourcesPage() {
    const bgStyle = {
        backgroundImage: "url('/images/MCC/Resources/MainBG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000000"
    };

    const resourceItems = [
        { image: communityFrame, alt: "Community", path: "/campus", isExternal: false },
        { image: aboutUsFrame, alt: "About Us", path: "/about", isExternal: false },
        { image: msldirectoryFrame, alt: "MSL Directory", path: "/soon", isExternal: false },
        { image: assetsFrame, alt: "Assets", path: "https://tinyurl.com/Promotional-Material-Assets", isExternal: true }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>
            <title>MSL Resources</title>

            <main className="relative z-0">
                <div
                    className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
                    style={bgStyle}
                >
                    {/* Title with top margin for mobile */}
                    <div className="flex flex-col items-center mt-10 mb-8 md:mt-16 md:mb-12">
                        <h1 className="text-2xl md:text-7xl font-bold text-white tracking-wider">
                            RESOURCES
                        </h1>
                    </div>

                    {/* Resource buttons grid */}
                    <div className="w-full max-w-[1200px] mx-auto px-2 md:px-6 mb-10 md:mb-16">
                        {/* 
                            Layout:
                            - 1 column on mobile
                            - 2 columns on medium and larger screens
                            - Added bottom margin to separate from footer
                        */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                            {resourceItems.map((item, idx) =>
                                item.isExternal ? (
                                    <a
                                        key={idx}
                                        href={item.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="w-full h-auto object-contain rounded-lg shadow-lg hover:shadow-2xl min-h-[120px] md:min-h-[200px]"
                                        />
                                    </a>
                                ) : (
                                    <Link
                                        key={idx}
                                        href={item.path}
                                        className="transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="w-full h-auto object-contain rounded-lg shadow-lg hover:shadow-2xl min-h-[120px] md:min-h-[200px]"
                                        />
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}