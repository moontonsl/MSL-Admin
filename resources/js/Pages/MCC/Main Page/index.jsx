import React from "react";
import { Link } from "@inertiajs/react";
import { Header, Footer } from "@/Components";

export default function MCCMAINPage() {
    const bgStyle = {
        backgroundImage: "url('/images/MCC/MCC2_BG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000000"
    };

    const navItems = [
        { image: "/images/MCC/MCC_WFReg.png", alt: "Tournament Structure", path: "/MCCWatchFestReg", isExternal: true },
        { image: "/images/MCC/Rulebook.png", alt: "Rulebook", path: "https://mslphilippines.notion.site/MSL-Collegiate-Cup-S2-Rulebook-1356a35bd22f80bc80a2e84cd4280a48", isExternal: true },
        { image: "/images/MCC/Roadmap.png", alt: "Calendar", path: "/mcc/calendar", isExternal: false },
        { image: "/images/MCC/MCCFav.png", alt: "Prediction", path: "/mcc/voting", isExternal: false }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-0">
                <div className="flex flex-col items-center py-5 min-h-screen" style={bgStyle}>
                    {/* Logo */}
                    <div className="flex flex-col items-center mt-2 mb-4 md:mt-4 md:mb-6">
                        <img
                            src="/images/MCC/MCC_HLOGO.png"
                            alt="MCC Logo"
                            className="h-[200px] md:h-[383px] object-contain"
                        />
                    </div>

                    {/* Desktop / tablet nav (row) */}
                    <div className="grid grid-cols-2 sm:flex sm:justify-center sm:flex-wrap overflow-hidden">
                        {navItems.map((item, idx) => (
                            item.isExternal ? (
                                <a
                                    key={idx}
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-transform hover:scale-105"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="sm:w-[300px] sm:h-[300px] object-contain"
                                    />
                                </a>
                            ) : (
                                <Link
                                    key={idx}
                                    href={item.path}
                                    className="transition-transform hover:scale-105"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="sm:w-[300px] sm:h-[300px] object-contain"
                                    />
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Bottom logos */}
<div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-4 md:flex-nowrap md:gap-x-12 md:gap-y-0 mt-6 md:mt-10 mb-2">
  <div className="w-[25%] xs:w-[18%] sm:w-[12%] md:w-auto flex justify-center">
    <img
      src="/images/MCC/MLBB NEW LOGO.png"
      alt="MLBB Logo"
      className="h-[40px] md:h-[60px] object-contain"
    />
  </div>
  {/* <div className="w-[25%] xs:w-[18%] sm:w-[12%]  md:w-auto flex justify-center">
    <img
      src="/images/MCC/MSL LOGO.png"
      alt="MSL Logo"
      className="h-[40px] md:h-[60px] object-contain"
    />
  </div> */}
  <div className="w-[25%] xs:w-[18%] sm:w-[12%]  md:w-auto flex justify-center">
    <img
      src="/images/MCC/SMARTLOGO.png"
      alt="Smart Logo"
      className="h-[40px] md:h-[60px] object-contain"
    />
  </div>
  <div className="w-[25%] xs:w-[18%] sm:w-[12%]  md:w-auto flex justify-center">
    <img
      src="/images/MCC/OppoLogo.png"
      alt="Oppo Logo"
      className="h-[40px] md:h-[50px] object-contain"
    />
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
