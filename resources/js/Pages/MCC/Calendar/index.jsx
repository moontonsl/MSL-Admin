import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header, Footer } from "@/Components";

// Event data per month
const eventData = {
    May: [
        { dayOfWeek: "Saturday", dayNum: 3, month: "MAY", event: "University Rivals Visayas Day 1", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 4, month: "May", event: "University Rivals Visayas Day 2", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 17, month: "May", event: "University Rivals Luzon A Day 1", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 18, month: "May", event: "University Rivals Luzon A Day 2", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 24, month: "May", event: "University Rivals Luzon B Day 1", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 25, month: "May", event: "University Rivals Luzon B Day 2", status: "UPCOMING" }
    ],
    June: [
        { dayOfWeek: "Saturday", dayNum: 1, month: "June", event: "University Rivals Mindanao Day 1", status: "UPCOMING" },
        { dayOfWeek: "Sunday", dayNum: 2, month: "June", event: "University Rivals Mindanao Day 2", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 15, month: "June", event: "Quarter Finals", status: "UPCOMING" },
        { dayOfWeek: "Sunday", dayNum: 16, month: "June", event: "Semi Finals", status: "UPCOMING" },
        { dayOfWeek: "Saturday", dayNum: 29, month: "June", event: "Grand Finals", status: "UPCOMING" }
    ]
};

const months = ["May", "June"];

export default function MCCCALENDARFINALPage() {
    const [monthIndex, setMonthIndex] = useState(0);
    const currentMonth = months[monthIndex];
    const events = eventData[currentMonth];

    const prevMonth = () => monthIndex > 0 && setMonthIndex(monthIndex - 1);
    const nextMonth = () => monthIndex < months.length - 1 && setMonthIndex(monthIndex + 1);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-0">
                <div 
                    className="flex flex-col items-center min-h-[100vh] lg:min-h-screen py-4 sm:py-8 bg-fixed bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/MCC/MCC2_CALENDAR_BG.png')" }}
                >
                    <div className="w-full max-w-[800px] mx-auto px-2 sm:px-4">
                        {/* Frame */}
                        <div className="relative w-[95%] md:w-full">
                            <div
                                className="flex flex-col overflow-hidden p-4 sm:p-6"
                                style={{
                                    background: 'linear-gradient(152.36deg, #000000 9.71%, #1D1D1D 50.48%, #000000 91.25%)',
                                    border: '0.64px solid #F3C718',
                                    borderRadius: '6.4px',
                                }}
                            >
                                {/* Header */}
                                <div className="relative flex items-center justify-center mb-3">
                                    <button 
                                        onClick={prevMonth} 
                                        disabled={monthIndex === 0} 
                                        className={`absolute left-0 ${monthIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-110 transition-transform"}`}
                                    >
                                        <ChevronLeft size={24} color="#F3C718" />
                                    </button>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-white px-8 sm:px-16">EVENT CALENDAR</h1>
                                    <button 
                                        onClick={nextMonth} 
                                        disabled={monthIndex === months.length - 1} 
                                        className={`absolute right-0 ${monthIndex === months.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110 transition-transform"}`}
                                    >
                                        <ChevronRight size={24} color="#F3C718" />
                                    </button>
                                </div>

                                {/* Month banner */}
                                <div className="bg-[#F3C718] flex justify-center items-center py-1 sm:py-3 mb-2 sm:mb-4">
                                    <span className="text-xl sm:text-3xl font-bold text-black">{currentMonth}</span>
                                </div>

                                {/* Table headers */}
                                <div className="flex justify-between items-center py-1 border-b border-[#F3C718] text-[#F3C718] font-bold">
                                    <div className="w-1/4 text-center text-sm sm:text-xl">DATE</div>
                                    <div className="w-2/4 text-center text-sm sm:text-xl">EVENT</div>
                                    <div className="w-1/4 text-center text-sm sm:text-xl">STATUS</div>
                                </div>

                                {/* Events */}
                                <div className="flex-grow overflow-y-auto overflow-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    {events.map((e, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 sm:py-4 border-b border-[#F3C718]">
                                            {/* Date card */}
                                            <div className="w-1/4 flex justify-center">
                                                <div className="border border-[#F3C718] rounded-md w-[60px] sm:w-[90px] overflow-hidden">
                                                    <div className="text-[#F3C718] text-[10px] sm:text-sm font-bold text-center py-0.5 sm:py-1">{e.dayOfWeek}</div>
                                                    <div className="text-[#F3C718] text-2xl sm:text-4xl font-bold text-center leading-none py-1">{e.dayNum}</div>
                                                    <div className="bg-[#F3C718] text-black text-[10px] sm:text-sm font-bold text-center py-0.5 sm:py-1">{e.month}</div>
                                                </div>
                                            </div>
                                            {/* Event */}
                                            <div className="w-2/4 text-center">
                                                <span className="text-[#F3C718] text-xs sm:text-lg font-bold">{e.event}</span>
                                            </div>
                                            {/* Status */}
                                            <div className="w-1/4 flex justify-center">
                                                <span className="text-[#F3C718] border border-[#F3C718] rounded-md px-2 sm:px-6 py-0.5 sm:py-2 text-xs sm:text-base font-bold">{e.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
