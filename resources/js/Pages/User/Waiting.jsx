import React, { useState, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import UserStateLayout from "@/Layouts/UserStateLayout.jsx";
import { Clock, CheckCircle, AlertCircle, AlertTriangle, Trash2 } from 'lucide-react';

const Waiting = () => {
    const { user } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const passwordInputRef = useRef(null);

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setDeletePassword('');
        setDeleteError('');
        setTimeout(() => passwordInputRef.current?.focus(), 100);
    };

    const confirmDeleteAccount = () => {
        if (!deletePassword.trim()) {
            setDeleteError('Password is required');
            passwordInputRef.current?.focus();
            return;
        }

        setDeleteError('');
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        
        router.delete(route('profile.destroy'), {
            data: { password: deletePassword },
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setTimeout(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/login';
                }, 2000);
            },
            onError: (errors) => {
                console.error('Delete account error:', errors);
                setShowSuccessModal(false);
                setShowDeleteModal(true);
                setDeleteError(Object.values(errors)[0] || 'Failed to delete account. Please try again.');
            },
        });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletePassword('');
        setDeleteError('');
    };

    const handleSuccessOkay = () => {
        setShowSuccessModal(false);
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
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
                                <img src="/MSL_LOGO.png" alt="MSL Logo" className="h-20 w-20"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 mt-6">
                                Account Pending Verification
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
                                        Your account has been submitted and is currently being reviewed by our Student Leaders or Regional Admins. 
                                        This process typically takes 24-48 hours.
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
                                        Pending Verification
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
                                            <span>Our team will review your submitted documents</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>You'll receive an email notification once verified</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>You'll gain access to all MSL platform features</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 mb-4">
                                Have questions about your verification status?
                            </p>
                            <p className="text-white mb-6">
                                Contact your Student Leader or Regional Admin at your institution
                            </p>
                            
                            {/* Delete Account Button */}
                            <button
                                onClick={handleDeleteAccount}
                                className="px-6 py-3 text-red-400 hover:text-red-300 border border-red-400/50 hover:border-red-400 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                                <AlertTriangle className="w-6 h-6 text-[#facc15]" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Delete Account
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                        </p>
                        
                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Enter your password to confirm
                            </label>
                            <input
                                ref={passwordInputRef}
                                type="password"
                                id="deletePassword"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all duration-200"
                                placeholder="Enter your password"
                                onKeyPress={(e) => e.key === 'Enter' && confirmDeleteAccount()}
                            />
                            {deleteError && (
                                <p className="text-red-400 text-sm mt-1">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-gray-300 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md hover:bg-[rgba(20,20,20,0.8)] hover:border-[#facc15] transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="px-4 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 flex items-center space-x-2 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border border-[#facc15] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[rgba(250,204,21,0.2)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                                <div className="w-6 h-6 text-[#facc15] text-2xl font-bold">✓</div>
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Account Deleted Successfully
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Your account has been permanently deleted. You will be redirected to the login page.
                        </p>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleSuccessOkay}
                                className="px-6 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserStateLayout>
    );
};

export default Waiting; 