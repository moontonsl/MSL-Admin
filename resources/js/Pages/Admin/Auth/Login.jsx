import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'react-feather';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);
    
    // Background carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const backgroundImages = [
        '/images/heroes/yuzhong.png',
        '/images/heroes/dyrroth.png',
    ];

    // Auto-rotate background images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % backgroundImages.length
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen flex">
                {/* Left: Login Card with Background Carousel */}
                <div className="w-full lg:w-1/3 flex items-center justify-end bg-white relative">
                    {/* Background carousel with opacity */}
                    <div
                        className="absolute inset-0 opacity-50 z-0 transition-all duration-1000 ease-in-out"
                        style={{ 
                            background: `url(${backgroundImages[currentImageIndex]}) center/cover no-repeat`,
                        }}
                    />
                    <div className="max-w-md w-full space-y-8 p-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl relative z-20 lg:-mr-40 lg:translate-x-16">
                        <img src="/images/AdminPortal/MSL_Colored.png" alt="Logo" className="h-100 w-auto mr-2" />
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-400 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB43A] focus:border-[#FFB43A]"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-400 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB43A] focus:border-[#FFB43A] pr-10"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-[#212121] bg-[#FFB43A] hover:bg-[#FFA726] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB43A] disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {processing ? 'Authenticating...' : 'LOGIN'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right: Welcome Section */}
                <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#212121] relative">
                    {/* Background image with opacity */}
                    <div
                        className="absolute inset-0 opacity-30 z-0"
                        style={{ background: 'url(/images/AdminPortal/eruditio.jpeg) center/cover no-repeat' }}
                    />
                    <div className="relative z-10 max-w-lg text-left">
                        <h6 className="text-white text-2xl md:text-sm font-light">WELCOME TO</h6>
                        <h1 className="text-[#FFB43A] text-3xl md:text-5xl font-extrabold mb-4 tracking-wide">Moonton Student Leaders PH</h1>
                        <p className="text-gray-200 text-base md:text-xl">
                            Moonton Student Leaders (MSL) organizes campus-wide events, initiates, and, grows MLBB Communities in their campus.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}