import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import UserStateLayout from "@/Layouts/UserStateLayout.jsx";
import { Ban, AlertCircle, Mail } from 'lucide-react';

const Blocked = () => {
    const { user } = usePage().props;

    return (
        <UserStateLayout>
            <Head title="Account Blocked" />
            
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#000] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center h-20 w-20 bg-gray-500/20 rounded-2xl">
                                <img src="/MSL_LOGO.png" alt="MSL Logo" className="h-20 w-20"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 mt-6">
                                Account Blocked
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Your account has been suspended
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                                        Access Suspended
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Your MSL account has been blocked by an administrator. 
                                        You no longer have access to the platform features.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Blocked Reason */}
                        {user.blocked_reason && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                                <div className="flex items-start space-x-4">
                                    <Ban className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400 mb-2">
                                            Reason for Blocking
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                                            {user.blocked_reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Info */}
                        <div className="bg-white/5 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Full Name</p>
                                    <p className="text-white font-medium">{user.name} {user.surname}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Username</p>
                                    <p className="text-white font-medium">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">School/Institution</p>
                                    <p className="text-white font-medium">{user.university}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">MLBB IGN</p>
                                    <p className="text-white font-medium">{user.ml_ign}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Current Status</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                        Blocked
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                                        Need Help?
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        If you believe this is an error or have questions about your account status, 
                                        please contact your Student Leader or Regional Admin at your institution.
                                    </p>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-gray-300 text-sm">
                                            <strong>Contact Information:</strong><br/>
                                            • Your Student Leader: [Contact your institution]<br/>
                                            • Your Regional Admin: [Contact your region]<br/>
                                            • Email: {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    // Trigger logout
                                    const form = document.createElement('form');
                                    form.method = 'POST';
                                    form.action = '/logout';
                                    
                                    const csrfToken = document.createElement('input');
                                    csrfToken.type = 'hidden';
                                    csrfToken.name = '_token';
                                    csrfToken.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                    
                                    form.appendChild(csrfToken);
                                    document.body.appendChild(form);
                                    form.submit();
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserStateLayout>
    );
};

export default Blocked; 