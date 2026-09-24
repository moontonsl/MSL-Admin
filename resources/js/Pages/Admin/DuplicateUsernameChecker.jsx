import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DuplicateUsernameChecker() {
    const [duplicates, setDuplicates] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await axios.get('/admin/duplicate-usernames/stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const checkDuplicates = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.get('/admin/duplicate-usernames/check');
            if (response.data.success) {
                setDuplicates(response.data.duplicates);
                setMessage(`Found ${response.data.duplicate_count} duplicate username(s) out of ${response.data.total_users_checked} users checked.`);
            }
        } catch (error) {
            setMessage('Error checking for duplicates: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const resolveDuplicates = async (username, action) => {
        if (!confirm(`Are you sure you want to ${action} duplicate usernames for "${username}"?`)) {
            return;
        }

        try {
            const response = await axios.post('/admin/duplicate-usernames/resolve', {
                username,
                action
            });

            if (response.data.success) {
                setMessage(response.data.message);
                // Refresh the duplicates list
                checkDuplicates();
                loadStats();
            }
        } catch (error) {
            setMessage('Error resolving duplicates: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <AdminLayout>
            <Head title="Duplicate Username Checker" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Duplicate Username Checker</h1>

                            {/* Statistics */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-800">{stats.total_users}</div>
                                        <div className="text-sm text-blue-600">Total Users</div>
                                    </div>
                                    <div className="bg-green-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-800">{stats.users_with_username}</div>
                                        <div className="text-sm text-green-600">With Username</div>
                                    </div>
                                    <div className="bg-yellow-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-800">{stats.users_without_username}</div>
                                        <div className="text-sm text-yellow-600">Without Username</div>
                                    </div>
                                    <div className="bg-purple-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-800">{stats.unique_usernames}</div>
                                        <div className="text-sm text-purple-600">Unique Usernames</div>
                                    </div>
                                    <div className="bg-red-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-red-800">{stats.duplicate_usernames}</div>
                                        <div className="text-sm text-red-600">Duplicate Usernames</div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mb-6">
                                <button
                                    onClick={checkDuplicates}
                                    disabled={loading}
                                    className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded mr-4"
                                >
                                    {loading ? 'Checking...' : 'Check for Duplicates'}
                                </button>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`p-4 rounded-lg mb-6 ${
                                    message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                    {message}
                                </div>
                            )}

                            {/* Duplicates List */}
                            {duplicates.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Duplicate Usernames Found:</h2>
                                    {duplicates.map((duplicate, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-lg font-medium">
                                                    Username: <span className="text-red-600">{duplicate.username}</span>
                                                </h3>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => resolveDuplicates(duplicate.username, 'update')}
                                                        className="bg-yellow-500 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded"
                                                    >
                                                        Update with Suffix
                                                    </button>
                                                    <button
                                                        onClick={() => resolveDuplicates(duplicate.username, 'delete')}
                                                        className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                                    >
                                                        Delete Duplicates
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                Count: {duplicate.count} users
                                            </div>
                                            <div className="space-y-2">
                                                {duplicate.users.map((user, userIndex) => (
                                                    <div key={userIndex} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                        <div>
                                                            <span className="font-medium">{user.name}</span>
                                                            <span className="text-gray-500 ml-2">({user.email})</span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Created: {user.created_at}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {duplicates.length === 0 && !loading && (
                                <div className="text-center text-gray-500 py-8">
                                    No duplicate usernames found. Click "Check for Duplicates" to scan the database.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 