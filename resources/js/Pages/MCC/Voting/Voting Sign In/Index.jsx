import React, { useRef } from 'react';
import { Header, Footer } from "@/Components";
import { Toaster } from 'react-hot-toast';
import MLLoginVoting from './MLLoginVoting';

import LightningNextButton from './LightningNextButton.jsx';

export default function VotingSignIn() {
    const mlLoginRef = useRef(null);

    const handleLoginClick = () => {
        if (mlLoginRef.current) {
            mlLoginRef.current.triggerLogin();
        }
    };

    return (
        <>
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <Toaster 
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            border: '1px solid #F3C718',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '80px',
                            pointerEvents: 'auto'
                        },
                    }}
                />
            </div>

            <div className="min-h-screen bg-black text-white">
                <div className="relative z-10">
                    <Header />
                </div>

                <main 
                    className="relative z-0 min-h-screen py-8 md:py-16"
                    style={{
                        backgroundImage: "url('/images/MCC/VoteBG.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed"
                    }}
                >
                    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                        <div className="text-center mb-8">
                            <img src="/images/MCC/MCCLOGO.png" alt="Voting Sign In" 
                            className="w-32 md:w-64 h-auto mx-auto drop-shadow-[0_0_10px_#F3C718]" />
                        </div>
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-6xl font-bold font-space mb-4">
                                VOTING SIGN IN
                            </h1>
                            <p className="text-lg md:text-xl font-poppins">
                                Sign in with your Mobile Legends account to vote
                            </p>
                        </div>
                        
                        <LightningNextButton onClick={handleLoginClick} />
                        
                        <MLLoginVoting ref={mlLoginRef} />

                        <div className="flex justify-center items-center gap-6 md:gap-12 mt-6 md:mt-10 mb-2">
                            <img src="/images/MCC/SMARTLOGO.png" alt="Voting Sign In" className="w-32 h-auto mx-auto" />
                            <img src="/images/MCC/OppoLogo.png" alt="Voting Sign In" className="w-32 h-auto mx-auto" />
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
