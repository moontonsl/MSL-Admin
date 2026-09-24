import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Eye, EyeOff, CheckCircle } from 'react-feather';

export default function ResetPassword({ token, email, status, passwordReset }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        setError(''); // Clear error on input change
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.password || !data.password_confirmation) {
            setError('⚠️ Please fill in all password fields.');
            return;
        }

        if (data.password !== data.password_confirmation) {
            setError('⚠️ Passwords do not match.');
            return;
        }

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                if (errors.email) {
                    setError(errors.email);
                } else if (errors.password) {
                    setError(errors.password);
                } else if (errors.password_confirmation) {
                    setError(errors.password_confirmation);
                } else if (errors.message) {
                    setError(errors.message);
                } else {
                    setError('⚠️ An error occurred. Please try again.');
                }
            },
        });
    };

    // If password was successfully reset, show success message
    if (passwordReset) {
        return (
            <AuthenticatedLayout>
                <Head title="Password Reset Success" />
                <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
                    <div className="login-wrapper w-full max-w-full flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto">
                        
                        {/* Success Container */}
                        <div className="login-container-login w-full md:w-[500px] h-auto md:h-full p-6 md:p-12 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] md:rounded-[15px_0_0_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
                            <div className="choose-login-container p-0 flex flex-col items-center w-full max-w-[400px] mx-auto md:min-w-[340px] md:max-w-[400px]">
                                
                                {/* Success Icon */}
                                <div className="mb-6 flex justify-center">
                                    <CheckCircle size={64} className="text-green-400" />
                                </div>

                                <h2 className="text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8 text-center">
                                    Password Reset Successful!
                                </h2>

                                <div className="mb-8 text-sm text-[#cccccc] text-center">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </div>

                                {/* Success Message */}
                                {status && (
                                    <div className="mb-6 text-sm font-medium text-green-400 bg-[rgba(34,197,94,0.1)] border border-green-500 p-4 rounded-lg text-center w-full">
                                        {status}
                                    </div>
                                )}

                                {/* Back to Login Button */}
                                <div className="footer-container-login flex flex-col items-center w-full">
                                    <a 
                                        href="/login" 
                                        className="login-btn-login w-full py-4 bg-[#2c2c2c] text-white rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 text-center no-underline hover:bg-[#3c3c3c]"
                                    >
                                        Back to Login
                                    </a>
                                </div>
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

    return (
        <AuthenticatedLayout>
            <Head title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
                <div className="login-wrapper w-full max-w-full flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto">
                    
                    {/* Reset Password Container */}
                    <div className="login-container-login w-full md:w-[500px] h-auto md:h-full p-6 md:p-12 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] md:rounded-[15px_0_0_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
                        <div className="choose-login-container p-0 flex flex-col items-stretch w-full max-w-[400px] mx-auto md:min-w-[340px] md:max-w-[400px]">
                            <h2 className="text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8">
                                Set New Password
                            </h2>

                            <div className="mb-6 text-sm text-[#cccccc]">
                                Please enter your new password below. Make sure it's secure and easy to remember.
                            </div>

                            {/* Error Message Display */}
                            {error && (
                                <div className="error-message-login bg-[#ffdddd] border-l-6 border-l-[#f44336] p-3 mb-4 text-[#a94442] font-medium rounded animate-fadeIn w-full mx-auto">
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Reset Password Form */}
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
                                        value={data.email}
                                        onChange={handleInputChange}
                                        className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                                        readOnly
                                    />
                                </div>

                                {/* Password Input Group */}
                                <div className="input-group-login mb-4">
                                    <label htmlFor="password" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                                        New Password
                                    </label>
                                    <div className="password-container-login relative w-full">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            placeholder="Enter new password"
                                            value={data.password}
                                            onChange={handleInputChange}
                                            className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 pr-10 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            className="eye-icon-login absolute right-4 top-1/2 -translate-y-1/2 text-white bg-none border-none cursor-pointer p-1"
                                            onClick={() => setPasswordVisible((v) => !v)}
                                            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                        >
                                            {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input Group */}
                                <div className="input-group-login mb-4">
                                    <label htmlFor="password_confirmation" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                                        Confirm New Password
                                    </label>
                                    <div className="password-container-login relative w-full">
                                        <input
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            placeholder="Confirm new password"
                                            value={data.password_confirmation}
                                            onChange={handleInputChange}
                                            className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 pr-10 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            className="eye-icon-login absolute right-4 top-1/2 -translate-y-1/2 text-white bg-none border-none cursor-pointer p-1"
                                            onClick={() => setConfirmPasswordVisible((v) => !v)}
                                            aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                                        >
                                            {confirmPasswordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Footer Container with Submit Button and Links */}
                                <div className="footer-container-login flex flex-col items-center">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="login-btn-login w-full py-4 bg-[#2c2c2c] text-white rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3c3c3c]"
                                    >
                                        {processing ? 'Resetting...' : 'Reset Password'}
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
