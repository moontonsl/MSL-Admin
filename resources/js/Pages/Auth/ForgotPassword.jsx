import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isRateLimited, setIsRateLimited] = useState(false);

    // Check if user is rate limited on component mount
    useEffect(() => {
        const checkRateLimit = () => {
            const lastRequest = localStorage.getItem(`password_reset_${data.email}`);
            if (lastRequest) {
                const timeLeft = 60 - Math.floor((Date.now() - parseInt(lastRequest)) / 1000);
                if (timeLeft > 0) {
                    setIsRateLimited(true);
                    setCountdown(timeLeft);
                }
            }
        };

        if (data.email) {
            checkRateLimit();
        }
    }, [data.email]);

    // Countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
                if (countdown - 1 === 0) {
                    setIsRateLimited(false);
                }
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        setError(''); // Clear error on input change
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.email) {
            setError('⚠️ Please enter your email address.');
            return;
        }

        if (isRateLimited) {
            setError(`⚠️ Please wait ${countdown} seconds before requesting another password reset link.`);
            return;
        }

        post(route('password.email'), {
            onError: (errors) => {
                if (errors.email) {
                    setError(errors.email);
                    // If it's a rate limit error, start the countdown
                    if (errors.email.includes('wait') || errors.email.includes('minute')) {
                        setIsRateLimited(true);
                        setCountdown(60);
                        localStorage.setItem(`password_reset_${data.email}`, Date.now().toString());
                    }
                } else if (errors.message) {
                    setError(errors.message);
                } else {
                    setError('⚠️ An error occurred. Please try again.');
                }
            },
            onSuccess: () => {
                // Start countdown on successful request
                setIsRateLimited(true);
                setCountdown(60);
                localStorage.setItem(`password_reset_${data.email}`, Date.now().toString());
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
                <div className="login-wrapper w-full max-w-full flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto">
                    
                    {/* Forgot Password Container */}
                    <div className="login-container-login w-full md:w-[500px] h-auto md:h-full p-6 md:p-12 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] md:rounded-[15px_0_0_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
                        <div className="choose-login-container p-0 flex flex-col items-stretch w-full max-w-[400px] mx-auto md:min-w-[340px] md:max-w-[400px]">
                            <h2 className="text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8">
                                Reset Your Password
                            </h2>

                            <div className="mb-6 text-sm text-[#cccccc]">
                                Forgot your password? No problem. Just let us know your email
                                address and we will email you a password reset link that will
                                allow you to choose a new one.
                            </div>

                            <div className="mb-4 text-xs text-[#f1c40f] bg-[rgba(255,255,255,0.05)] p-3 rounded-lg border border-[#333333]">
                                <strong>Note:</strong> You can only request one password reset link per minute per email address.
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-400 bg-[rgba(34,197,94,0.1)] border border-green-500 p-3 rounded-lg">
                                    {status}
                                </div>
                            )}

                            {/* Error Message Display */}
                            {error && (
                                <div className="error-message-login bg-[#ffdddd] border-l-6 border-l-[#f44336] p-3 mb-4 text-[#a94442] font-medium rounded animate-fadeIn w-full mx-auto">
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Forgot Password Form */}
                            <form className="form-login flex flex-col gap-4" onSubmit={submit}>
                                {/* Email Input Group */}
                                <div className="input-group-login mb-4">
                                    <label htmlFor="email" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={data.email}
                                        onChange={handleInputChange}
                                        className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                                    />
                                </div>

                                {/* Footer Container with Submit Button and Links */}
                                <div className="footer-container-login flex flex-col items-center">
                                    <button
                                        type="submit"
                                        disabled={processing || isRateLimited}
                                        className="login-btn-login w-full py-4 bg-[#2c2c2c] text-white rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3c3c3c]"
                                    >
                                        {processing ? 'Sending...' : 
                                         isRateLimited ? `Wait ${countdown}s...` : 
                                         'Email Password Reset Link'}
                                    </button>
                                    <p className="footer-text-login text-white text-center mt-4 text-sm">
                                        Remember your password?{' '}
                                        <a href="/login" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                            Back to Login
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Video Container */}
                    <div className="video-container-login relative flex items-stretch justify-center w-full md:w-[680px] bg-black rounded-[0_0_15px_15px] md:rounded-[0_15px_15px_0] overflow-hidden h-[250px] min-h-[180px] md:h-auto md:min-h-0">
                        <div className="video-foreground relative w-full h-full flex items-stretch justify-center">
                            <iframe
                                src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                                title="MSL Video"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full aspect-auto border-none bg-black block"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
