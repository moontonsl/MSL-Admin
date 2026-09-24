import React from 'react';
import { Head } from '@inertiajs/react';
import UserStateLayout from "@/Layouts/UsersStateLayout.jsx";
import { CheckCircle, AlertCircle } from 'lucide-react';

const AccountModificationWaiting = () => {
    // Dummy placeholders
    const user = {
        name: "John",
        surname: "Doe",
        username: "johndoe123",
        email: "john.doe@example.com",
        university: "Dummy University",
        ml_ign: "DummyIGN"
    };

    return (
        <UserStateLayout>
            <Head title="Account Pending Verification" />

            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#000] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center h-20 w-20 bg-gray-500/20 rounded-2xl">
                                <img src="/MSL_LOGO-waiting.png" alt="MSL Logo" className="h-20 w-20"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 mt-6">
                                Account Modification Verification
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Your account is currently under review
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                                        Verification in Progress
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Your modification request has been submitted and is currently being reviewed by our Student Leaders or Regional Admins. 
                                        This process typically takes 24 - 48 hours.
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                        Pending Modification Verification
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                                        What happens next?
                                    </h3>
                                    <ul className="text-gray-300 space-y-2">
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>Our team will review your modification request</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>You'll receive an email notification once it is approved</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 mb-4">
                                Have questions about your modification request status?
                            </p>
                            <p className="text-white">
                                Contact your Student Leader or Regional Admin at your institution
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </UserStateLayout>
    );
};

export default AccountModificationWaiting;