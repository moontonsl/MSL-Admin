import React from 'react';
import { Header, Footer } from "@/Components";

export default function Soon() {
    return (
        <>
            <div className="min-h-screen bg-black text-white">
                <div className="relative z-10">
                    <Header />
                </div>

                <main
                    className="relative z-0 min-h-screen py-8 md:py-16 flex items-center justify-center overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/MCC/MCC2_BG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed"
                    }}
                >
                    {/* Animated floating blurred shape */}
                    <div className="absolute w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl left-[-10%] top-1/4 animate-pulse-slow z-0"></div>
                    <div className="absolute w-80 h-80 bg-blue-400/10 rounded-full blur-2xl right-[-8%] bottom-1/4 animate-pulse-slow z-0"></div>
                    
                    {/* Overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
                    
                    {/* Glassmorphism card */}
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
                        <div className="bg-white/10 border border-yellow-400/30 rounded-2xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-md max-w-xl w-full">
                            {/* Animated Icon */}
                            <svg
                                className="w-20 h-20 mb-6 text-yellow-400 drop-shadow-lg animate-spin-slow"
                                fill="none"
                                viewBox="0 0 48 48"
                                style={{ filter: "drop-shadow(0 0 16px #f3c718)" }}
                            >
                                <path d="M24 4v40M24 4l-8 16h16l-8 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {/* Animated Gradient Border Text */}
                            <h1 className="text-5xl md:text-7xl font-extrabold font-space mb-4 text-center bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_0_30px_#f3c718]">
                                COMING SOON
                            </h1>
                            <p className="text-lg md:text-2xl text-yellow-200 font-poppins text-center max-w-xl mt-2 drop-shadow">
                                We're working hard to bring you something amazing. Stay tuned!
                            </p>
                            {/* Call to action */}
                            <a
                                href="/"
                                className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                Back to Home
                            </a>
                        </div>
                    </div>
                </main>

                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </>
    );
}
