import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function DuplicateUsernameForm({ status, user_id, current_username, current_email, user, expired, expires_at }) {
    const { data, setData, post, processing, errors } = useForm({
        username: current_username || '',
    });

    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isRateLimited, setIsRateLimited] = useState(false);

    // Check if user is rate limited on component mount
    useEffect(() => {
        const checkRateLimit = () => {
            const lastRequest = localStorage.getItem(`password_reset_${data.email}`);
            if (lastRequest) {
                const timeLeft = 60 - Math.floor((Date.now() - parseInt(lastRequest)) / 1000);
                if (timeLeft > 0) {
                    // setIsRateLimited(true);
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
        setSuccessMessage(''); // Clear success message on input change
        
        // Real-time username validation
        if (name === 'username') {
            validateUsername(value);
        }
    };

    const validateUsername = (username) => {
        setUsernameError('');
        
        if (!username) {
            setUsernameError('Username is required');
            return false;
        }
        
        if (username.length < 6) {
            setUsernameError('Username must be at least 6 characters long');
            return false;
        }
        
        if (username.length > 20) {
            setUsernameError('Username must be less than 20 characters');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameError('Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        if (username === current_username) {
            setUsernameError('Please enter a different username than your current one');
            return false;
        }
        
        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Validate username before submitting
        if (!validateUsername(data.username)) {
            return;
        }

        post(route('admin.duplicate-usernames.update', { user_id: user_id }), {
            onError: (errors) => {
                console.log(errors);
                if (errors.username) {
                    setError(errors.username);
                } else if (errors.message) {
                    setError(errors.message);
                } else {
                    setError('⚠️ An error occurred. Please try again.');
                }
            },
            onSuccess: (response) => {
                console.log(response);
                setError('');
                setNewUsername(data.username);
                setSuccessMessage('Username updated successfully!');
                setIsSuccess(true);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Forgot Username" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
                <div className="login-wrapper w-full max-w-full flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto">
                    
                    {/* Forgot Username Container */}
                    <div className="login-container-login w-full md:w-[500px] h-auto md:h-full p-6 md:p-12 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] md:rounded-[15px_0_0_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
                        <div className="choose-login-container p-0 flex flex-col items-stretch w-full max-w-[400px] mx-auto md:min-w-[340px] md:max-w-[400px]">
                                                         <h2 className="text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8">
                                 {expired ? 'Link Expired' : (user_id ? 'Update Your Username' : 'Recover Your Username')}
                             </h2>

                                                         <div className="mb-6 text-sm text-[#cccccc]">
                                 {expired ? 
                                     'This link has expired. Please contact support or request a new username update link.' :
                                     (user_id ? 
                                         `Your current username "${current_username}" needs to be updated. Please enter a new unique username.` :
                                         'Forgot your username? No problem. Just let us know your email address and we will email you your username.'
                                     )
                                 }
                             </div>

                                                         {!expired && (
                                 <div className="mb-4 text-xs text-[#f1c40f] bg-[rgba(255,255,255,0.05)] p-3 rounded-lg border border-[#333333]">
                                     <strong>Note:</strong> Enter a new unique username to replace your current one.
                                     {expires_at && (
                                         <div className="mt-1 text-xs text-[#cccccc]">
                                             This link expires in {Math.ceil((new Date(expires_at * 1000) - new Date()) / (1000 * 60 * 60 * 24))} days.
                                         </div>
                                     )}
                                 </div>
                             )}

                            {(status || successMessage) && (
                                <div className="mb-4 text-sm font-medium text-green-400 bg-[rgba(34,197,94,0.1)] border border-green-500 p-3 rounded-lg">
                                    {status || successMessage}
                                    {isSuccess && newUsername && (
                                        <div className="mt-2 text-sm">
                                            Your new username is: <strong className="text-white">{newUsername}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Message Display */}
                            {error && (
                                <div className="error-message-login bg-[#ffdddd] border-l-6 border-l-[#f44336] p-3 mb-4 text-[#a94442] font-medium rounded animate-fadeIn w-full mx-auto">
                                    <p>{error}</p>
                                </div>
                            )}

                                                         {/* Username Update Form */}
                             <form className="form-login flex flex-col gap-4" onSubmit={submit}>
                                 {!isSuccess && !expired && (
                                     <div className="input-group-login mb-4">
                                         <label htmlFor="username" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                                             New Username
                                         </label>
                                         <input
                                             type="text"
                                             id="username"
                                             name="username"
                                             placeholder="Enter new username"
                                             value={data.username}
                                             onChange={handleInputChange}
                                             className={`input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 focus:outline-none focus:ring-0 ${
                                                 usernameError ? 'border-red-500' : 'border-[#242424] focus:border-[#e0b90f]'
                                             }`}
                                         />
                                         {usernameError && (
                                             <div className="text-red-400 text-sm mt-1 animate-fadeIn">
                                                 ⚠️ {usernameError}
                                             </div>
                                         )}
                                     </div>
                                 )}

                                {/* Footer Container with Submit Button and Links */}
                                <div className="footer-container-login flex flex-col items-center">
                                    {expired ? (
                                        <a
                                            href="/login"
                                            className="login-btn-login w-full py-4 bg-[#f1c40f] text-black rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 text-center no-underline hover:bg-[#f39c12]"
                                        >
                                            Go to Login
                                        </a>
                                    ) : isSuccess ? (
                                        <a
                                            href="/login"
                                            className="login-btn-login w-full py-4 bg-[#f1c40f] text-black rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 text-center no-underline hover:bg-[#f39c12]"
                                        >
                                            Go to Login
                                        </a>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing || usernameError}
                                            className="login-btn-login w-full py-4 bg-[#2c2c2c] text-white rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3c3c3c]"
                                        >
                                            {processing ? 'Saving...' : 'Save Username'}
                                        </button>
                                    )}
                                    {!isSuccess && !expired && (
                                        <p className="footer-text-login text-white text-center mt-4 text-sm">
                                            <a href="/login" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                                Back to Login
                                            </a>
                                        </p>
                                    )}
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
