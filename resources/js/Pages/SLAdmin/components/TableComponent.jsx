import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import avatar from '../assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png';
import Modal from '@/Components/Modal.jsx';
import Toast from '@/Components/Toast.jsx';
import SecurePdfViewer from '@/Components/SecurePdfViewer';
import AccountModificationModal from '@/Pages/ApprovalPages/AccountModificationModal.jsx';

const TableComponent = ({ stateFilter, searchQuery, schoolFilter, courseFilter, user, onCountsRefresh }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [fileExists, setFileExists] = useState(true);
    const [showNoAttachmentAlert, setShowNoAttachmentAlert] = useState(false);
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [promoteRole, setPromoteRole] = useState('');
    const [promoteDurationType, setPromoteDurationType] = useState('permanent');
    const [promoteDays, setPromoteDays] = useState(1);
    const [showModificationModal, setShowModificationModal] = useState(false);
    const ITEMS_PER_PAGE = 20;
    const abortControllerRef = useRef(null);

    const getRemainingDays = (expiryDate) => {
        if (!expiryDate) return null;
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : null;
    };

    const fetchUsers = async (page = 1, retryCount = 0) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        setLoading(true);
        try {
            let url = `/api/sladmin/users?page=${page}&per_page=${ITEMS_PER_PAGE}`;
            if (stateFilter) {
                url += `&state=${encodeURIComponent(stateFilter)}`;
            }
            if (searchQuery && searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            }
            if (schoolFilter && schoolFilter.trim()) {
                url += `&university=${encodeURIComponent(schoolFilter.trim())}`;
            }
            if (courseFilter && courseFilter.trim()) {
                url += `&course=${encodeURIComponent(courseFilter.trim())}`;
            }

            const response = await fetch(url, { signal });

            // Check response status first
            if (!response.ok) {
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;

                // Try to get more specific error information
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.message || errorMessage;
                    } else {
                        const textResponse = await response.text();
                        console.error('Non-JSON error response:', textResponse);
                        if (textResponse.includes('html') || textResponse.includes('<!DOCTYPE')) {
                            errorMessage = 'Server returned HTML instead of data. This usually means a server error occurred.';
                        } else {
                            errorMessage = `Server response: ${textResponse.substring(0, 200)}...`;
                        }
                    }
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }

                throw new Error(errorMessage);
            }

            // Check content type before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Expected JSON but got:', contentType, textResponse.substring(0, 200));
                throw new Error('Server returned invalid data format. Expected JSON but got: ' + contentType);
            }

            const data = await response.json();

            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Server returned invalid data structure');
            }

            setUsers(data.data || []);
            setTotalPages(data.last_page || 1);
            setCurrentPage(data.current_page || 1);
            setTotalUsers(data.total || 0);

        } catch (error) {
            if (error.name === 'AbortError') return;
            // Retry logic for temporary server issues
            if (retryCount < 2 && (
                error.message.includes('Server error: 500') ||
                error.message.includes('Server error: 502') ||
                error.message.includes('Server error: 503') ||
                error.message.includes('Server error: 504') ||
                error.message.includes('HTML instead of data')
            )) {
                setTimeout(() => {
                    fetchUsers(page, retryCount + 1);
                }, 2000 * (retryCount + 1)); // Exponential backoff: 2s, 4s
                return;
            }

            // Show user-friendly error message
            let errorMessage = 'Failed to load users. ';
            if (error.message.includes('Server error:')) {
                errorMessage += error.message;
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your connection.';
            } else if (error.message.includes('invalid data format')) {
                errorMessage += 'Server returned invalid data. Please try again.';
            } else if (error.message.includes('HTML instead of data')) {
                errorMessage += 'Server error occurred. Please try again in a few moments.';
            } else {
                errorMessage += error.message;
            }

            showToast(errorMessage, 'error');
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchUsers(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, schoolFilter, courseFilter]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchUsers(1);
        }
    }, [stateFilter]);

    useEffect(() => {
        fetchUsers(currentPage);

    }, [currentPage]);

    useEffect(() => {
        if (showModal && selectedUser) {
            const updatedUser = users.find(u => u.id === selectedUser.id);
            if (updatedUser) {
                setSelectedUser(updatedUser);
            }
        }
    }, [users]);

    //Prevent modal close
    useEffect(() => {
        if (showAttachmentModal) {

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showAttachmentModal]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPagination = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let left = Math.max(2, currentPage - 2);
            let right = Math.min(totalPages - 1, currentPage + 2);
            if (left > 2) pages.push('left-ellipsis');
            for (let i = left; i <= right; i++) pages.push(i);
            if (right < totalPages - 1) pages.push('right-ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        fetchUsers(currentPage);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleViewAttachment = async (proofOfEnrollment) => {
        if (proofOfEnrollment) {
            // Use secure route
            const fullUrl = `/user/attachment/${selectedUser.id}`;

            // We can't easily check HEAD on the secure route without auth headers in fetch, 
            // but the iframe/img tag will handle the request with cookies.
            // For now, assume it exists if the user has proofOfEnrollment path in DB.
            setFileExists(true);
            setAttachmentUrl(fullUrl);
            setShowAttachmentModal(true);
        }
    };

    const closeAttachmentModal = () => {
        setShowAttachmentModal(false);
        setAttachmentUrl('');
        // Reset zoom and pan when closing modal
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
        setIsDragging(false);
        setFileExists(true);
    };

    // Zoom and Pan handlers for images
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        setZoomLevel(prev => {
            const newZoom = Math.max(0.5, Math.min(3, prev + delta));
            return newZoom;
        });
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const hideToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleVerifyAttempt = (user) => {
        if (!user.proofOfEnrollment) {
            setShowNoAttachmentAlert(true);
            return false;
        }
        return true;
    };

    const handleAction = async (action, userId, payload = null) => {
        setActionLoading(true);
        setError('');

        try {
            let url;
            let method;
            let body = {};

            switch (action) {
                case 'verify':
                    // Additional check for proof of enrollment before making the API call
                    const targetUser = users.find(u => u.id === userId);
                    if (targetUser && !targetUser.proofOfEnrollment) {
                        throw new Error('Cannot verify user without proof of enrollment. The user must upload their proof of enrollment document first.');
                    }
                    url = `/api/sladmin/users/${userId}/verify`;
                    method = 'PATCH';
                    break;
                case 'block':
                    url = `/api/sladmin/users/${userId}/block`;
                    method = 'PATCH';
                    body = { reason: payload };
                    break;
                case 'unblock':
                    url = `/api/sladmin/users/${userId}/unblock`;
                    method = 'PATCH';
                    break;
                case 'renew':
                    url = `/api/sladmin/users/${userId}/renew`;
                    method = 'PATCH';
                    break;
                case 'delete':
                    url = `/api/sladmin/users/${userId}`;
                    method = 'DELETE';
                    break;
                case 'promote':
                    url = `/api/sladmin/users/${userId}/promote`;
                    method = 'PATCH';
                    body = payload ? { duration: payload.duration } : {};
                    break;
                case 'promote-regional-admin':
                    url = `/api/sladmin/users/${userId}/promote-regional-admin`;
                    method = 'PATCH';
                    body = payload ? { duration: payload.duration } : {};
                    break;
                case 'demote':
                    url = `/api/sladmin/users/${userId}/demote`;
                    method = 'PATCH';
                    break;
                case 'demote-regional-admin':
                    url = `/api/sladmin/users/${userId}/demote-regional-admin`;
                    method = 'PATCH';
                    break;
                default:
                    throw new Error('Invalid action');
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
            });

            console.log(`Action ${action} response:`, {
                status: response.status,
                statusText: response.statusText,
                contentType: response.headers.get('content-type'),
                url: url,
                userId: userId
            });

            // Check response status first
            if (!response.ok) {
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;
                let data = null;

                // Try to get more specific error information
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                        errorMessage = data.error || data.message || errorMessage;
                    } else {
                        const textResponse = await response.text();
                        console.error('Non-JSON error response:', textResponse);

                        if (textResponse.includes('html') || textResponse.includes('<!DOCTYPE')) {
                            errorMessage = 'Server returned HTML instead of data. This usually means a server error occurred.';
                        } else if (textResponse.includes('error') || textResponse.includes('Error')) {
                            errorMessage = `Server error: ${textResponse.substring(0, 200)}...`;
                        } else {
                            errorMessage = `Server response: ${textResponse.substring(0, 200)}...`;
                        }
                    }
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }

                // Special handling for verification without attachment
                if (action === 'verify' && response.status === 400 && data?.error && data.error.includes('proof of enrollment')) {
                    throw new Error('Verification failed: User must upload proof of enrollment before verification.');
                }

                throw new Error(errorMessage);
            }

            // Check content type before parsing success response
            const contentType = response.headers.get('content-type');
            let data;

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Expected JSON but got:', contentType, textResponse.substring(0, 200));
                throw new Error('Server returned invalid data format. Expected JSON but got: ' + contentType);
            }

            data = await response.json();

            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Server returned invalid data structure');
            }

            //Close modal and refresh user list
            setShowModal(false);
            setShowBlockModal(false);
            setShowPromoteModal(false);
            setSelectedUser(null);
            setBlockReason('');
            fetchUsers(currentPage);
            if (onCountsRefresh) onCountsRefresh();

            //success toast
            const actionMessages = {
                'verify': 'User verified successfully',
                'block': 'User blocked successfully',
                'unblock': 'User unblocked successfully',
                'renew': data.message || 'User renewed successfully',
                'delete': 'User deleted successfully',
                'promote': data.message || 'User promoted to Student Leader successfully',
                'promote-regional-admin': data.message || 'User promoted to Regional Admin successfully',
                'demote': data.message || 'Student Leader demoted successfully',
                'demote-regional-admin': data.message || 'Regional Admin demoted to Student successfully'
            };
            showToast(actionMessages[action] || 'Action completed successfully', 'success');

        } catch (err) {
            console.error('Action error:', err);
            console.error('Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack,
                action: action,
                userId: userId
            });

            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.message.includes('Server error:')) {
                errorMessage = err.message;
            } else if (err.message.includes('invalid data format')) {
                errorMessage = 'Server returned invalid data. Please try again.';
            } else if (err.message.includes('HTML instead of data')) {
                errorMessage = 'Server error occurred. Please try again in a few moments.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockUser = () => {
        if (!selectedUser) {
            setError('No user selected for blocking.');
            return;
        }
        if (!blockReason.trim()) {
            setError('Please provide a reason for blocking the user.');
            return;
        }
        const userId = selectedUser.id; // Store the ID before calling handleAction
        handleAction('block', userId, blockReason.trim());
    };

    return (
        <>
            {/* Summary Section */}
            {users.length > 0 && (
                <div className="mb-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-white">
                                <span className="font-semibold">
                                    {stateFilter === 'StudentLeaders' ? 'Student Leaders:' :
                                        stateFilter === 'RegionalAdmins' ? 'Regional Admins:' :
                                            'Students:'}
                                </span> {totalUsers}
                            </div>
                            {(() => {
                                const usersWithoutAttachment = users.filter(user => !user.proofOfEnrollment && (user.state === 'New' || user.state === 'Renew'));
                                return usersWithoutAttachment.length > 0 ? (
                                    <div className="text-red-400">
                                        <span className="font-semibold">Users Missing Attachments (Current Page):</span> {usersWithoutAttachment.length}
                                    </div>
                                ) : null;
                            })()}
                        </div>
                        <div className="text-sm text-gray-400">
                            Users without proof of enrollment cannot be verified • Showing page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-[#1a1a1a] text-white shadow custom-scrollbar">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-4 py-3 text-left">MSL Account</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">School / Institution</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Year Level</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                            <th className="px-4 py-3 text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8">No users found.</td></tr>
                        ) : users.map((item) => (
                            <tr key={item.id} className="hover:bg-[#2f2f2f] transition-colors">
                                <td className="flex items-center gap-3 px-4 py-3">
                                    <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] p-[2px] rounded-full">
                                        <div className="bg-neutral-900 rounded-full">
                                            <img
                                                src={avatar}
                                                alt={item.name}
                                                className="h-[32px] w-[32px] rounded-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-gray-200 font-bold">{item.name} {item.surname}</div>
                                        <div className="text-xs text-gray-400">IGN: {item.ml_ign}</div>
                                        <div className="flex-col items-center gap-2 md:flex-row">
                                            <div className="text-xs text-gray-400">{item.ml_id} ({item.ml_server})</div>
                                            <span className="text-xs text-blue-400 cursor-pointer">Facebook</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">{item.university}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{item.year_level}</td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <div className="flex flex-col gap-1">
                                        {stateFilter === 'StudentLeaders' ? (
                                            <span className="rounded px-2 py-1 text-xs font-medium bg-purple-600/10 text-purple-400">
                                                Student Leader
                                            </span>
                                        ) : stateFilter === 'RegionalAdmins' ? (
                                            <span className="rounded px-2 py-1 text-xs font-medium bg-blue-600/10 text-blue-400">
                                                Regional Admin
                                            </span>
                                        ) : (
                                            <>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-medium ${item.state === 'Verified'
                                                        ? 'bg-green-600/10 text-green-400'
                                                        : item.state === 'Blocked'
                                                            ? 'bg-red-600/10 text-red-400'
                                                            : 'bg-yellow-600/10 text-yellow-400'
                                                        }`}
                                                >
                                                    {item.state}
                                                </span>
                                                {!item.proofOfEnrollment && (item.state === 'New' || item.state === 'Renew') && (
                                                    <span className="rounded px-2 py-1 text-xs font-medium bg-red-600/10 text-red-400 border border-red-500/30">
                                                        ⚠️ No Attachment
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                        <button className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 whitespace-nowrap" onClick={() => openModal(item)}>
                                            View Profile
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center my-6 gap-2 text-sm text-white">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {getPagination().map((page, idx) =>
                        page === 'left-ellipsis' || page === 'right-ellipsis' ? (
                            <span key={page + idx} className="px-2">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-white text-black font-bold' : 'bg-neutral-800'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* User Details Modal */}
            <Modal show={showModal} maxWidth="80vw" onClose={closeModal}>
                {selectedUser && (
                    <div className="bg-gradient-to-br from-[#000] via-gray-800 to-black text-white p-2 sm:p-8 min-h-[600px] max-h-[90vh] overflow-y-auto relative rounded-md">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-200 text-gray-300 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.646 2.647a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 h-fit">
                                    {/* Avatar Section */}
                                    <div className="text-center mb-2">
                                        <div className="relative inline-block">
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                            <div className="relative rounded-full border-4 border-yellow-400 p-2 bg-gradient-to-tr from-yellow-400 to-yellow-300">
                                                <img
                                                    src={avatar}
                                                    alt="avatar"
                                                    className="w-32 h-32 rounded-full object-cover shadow-2xl"
                                                />
                                            </div>
                                        </div>


                                    </div>

                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {selectedUser.name || '-'} {selectedUser.surname || '-'}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2">
                                                <p className="text-gray-400 text-sm">@{selectedUser.username || '-'}</p>
                                                <div className="inline-flex items-center gap-1">
                                                    {stateFilter === 'StudentLeaders' ? (
                                                        <>
                                                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                                            <span className="font-semibold text-xs uppercase tracking-wider text-purple-400">
                                                                Student Leader
                                                            </span>
                                                        </>
                                                    ) : stateFilter === 'RegionalAdmins' ? (
                                                        <>
                                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                                            <span className="font-semibold text-xs uppercase tracking-wider text-blue-400">
                                                                Regional Admin
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={`w-2 h-2 rounded-full ${selectedUser.state === 'Verified' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                                                            <span className={`font-semibold text-xs uppercase tracking-wider ${selectedUser.state === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                                {selectedUser.state}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedUser.promotion_expires_at && (
                                                <div className="mt-2 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-500/20 rounded-full">
                                                        <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest whitespace-nowrap">
                                                            {getRemainingDays(selectedUser.promotion_expires_at) !== null
                                                                ? `${getRemainingDays(selectedUser.promotion_expires_at)} days remaining`
                                                                : 'Expiring soon'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">School</div>
                                                <div className="font-medium text-white">{selectedUser.university || '-'}</div>
                                            </div>

                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Year Level</div>
                                                <div className="font-medium text-white">{selectedUser.year_level || '-'}</div>
                                            </div>

                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Course</div>
                                                <div className="font-medium text-white">{selectedUser.course || '-'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Promote Buttons for Super Admin */}
                                    {user?.role === 'Super Admin' && stateFilter === 'Verified' && (
                                        <div className="mt-6 pt-6 border-t border-gray-700/50">
                                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">Promote User</div>
                                            <div className="space-y-2">
                                                <button
                                                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                                                    onClick={() => {
                                                        setPromoteRole('Student Leader');
                                                        setShowPromoteModal(true);
                                                        setPromoteDurationType('permanent');
                                                        setPromoteDays(1);
                                                    }}
                                                    disabled={actionLoading}
                                                >
                                                    {actionLoading ? 'Promoting...' : 'Student Leader'}
                                                </button>
                                                <button
                                                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                                                    onClick={() => {
                                                        setPromoteRole('Regional Admin');
                                                        setShowPromoteModal(true);
                                                        setPromoteDurationType('permanent');
                                                        setPromoteDays(1);
                                                    }}
                                                    disabled={actionLoading}
                                                >
                                                    {actionLoading ? 'Promoting...' : 'Regional Admin'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                                    <h4 className="text-lg font-semibold text-white mb-6 border-b border-gray-700/50 pb-3">Student Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* MLBB Information */}
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Mobile Legends</h5>
                                            <div className="space-y-3">
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">MLBB ID</div>
                                                    <div className="font-medium text-white">{selectedUser.ml_id || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Server</div>
                                                    <div className="font-medium text-white">{selectedUser.ml_server || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">IGN</div>
                                                    <div className="font-medium text-white">{selectedUser.ml_ign || '-'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Contact Details</h5>
                                            <div className="space-y-3">
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Email</div>
                                                    <div className="font-medium text-white break-words">{selectedUser.email || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Phone</div>
                                                    <div className="font-medium text-white">{selectedUser.contact_number || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Student ID</div>
                                                    <div className="font-medium text-white">{selectedUser.studentId || '-'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location Information */}
                                        <div className="space-y-4 md:col-span-2">
                                            <h5 className="text-sm font-medium text-green-400 uppercase tracking-wider">Location</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Region</div>
                                                    <div className="font-medium text-white">{selectedUser.region || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Island</div>
                                                    <div className="font-medium text-white">{selectedUser.island || '-'}</div>
                                                </div>
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Joined</div>
                                                    <div className="font-medium text-white">
                                                        {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Verification Details */}
                                        {(selectedUser.verified_by || selectedUser.verified_date) && (
                                            <div className="space-y-4 md:col-span-2">
                                                <h5 className="text-sm font-medium text-purple-400 uppercase tracking-wider">Verification Details</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {selectedUser.verified_by && (
                                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                                            <div className="text-gray-400 text-xs mb-1">Verified By</div>
                                                            <div className="font-medium text-white">
                                                                {selectedUser.verifier_name ? `${selectedUser.verifier_name} ${selectedUser.verifier_surname}` : 'Unknown'}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedUser.verified_date && (
                                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                                            <div className="text-gray-400 text-xs mb-1">Verified On</div>
                                                            <div className="font-medium text-white">
                                                                {new Date(selectedUser.verified_date).toLocaleDateString()} at {new Date(selectedUser.verified_date).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Blocked Reason */}
                                        {selectedUser.state === 'Blocked' && (
                                            <div className="md:col-span-2">
                                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                            <span className="font-semibold text-red-400 text-sm uppercase tracking-wider">Blocked</span>
                                                            {selectedUser.blocker_name && (
                                                                <span className="text-xs text-red-400/70">by {selectedUser.blocker_name} {selectedUser.blocker_surname}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-red-400/70">
                                                            {selectedUser.blocked_at
                                                                ? `${new Date(selectedUser.blocked_at).toLocaleDateString()} at ${new Date(selectedUser.blocked_at).toLocaleTimeString()}`
                                                                : 'Date not recorded'}
                                                        </div>
                                                    </div>
                                                    {selectedUser.blocked_reason && (
                                                        <div className="text-red-300">{selectedUser.blocked_reason}</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Attachment Warning */}
                                        {!selectedUser.proofOfEnrollment && (selectedUser.state === 'New' || selectedUser.state === 'Renew') && (
                                            <div className="md:col-span-2">
                                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-semibold text-red-400">No Proof of Enrollment Uploaded</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {/* Left Side Actions */}
                                            <div className="contents">
                                                <button
                                                    className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${selectedUser.proofOfEnrollment
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewAttachment(selectedUser.proofOfEnrollment);
                                                    }}
                                                    disabled={!selectedUser.proofOfEnrollment}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                        {selectedUser.proofOfEnrollment ? 'View Attachment' : 'No Attachment'}
                                                    </div>
                                                </button>

                                                {(stateFilter === 'New' || stateFilter === 'Renew') && stateFilter !== 'StudentLeaders' && stateFilter !== 'RegionalAdmins' && (
                                                    <button
                                                        className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${!selectedUser.proofOfEnrollment
                                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                                            }`}
                                                        onClick={() => {
                                                            if (handleVerifyAttempt(selectedUser)) {
                                                                handleAction('verify', selectedUser.id);
                                                            }
                                                        }}
                                                        disabled={actionLoading || !selectedUser.proofOfEnrollment}
                                                        title={!selectedUser.proofOfEnrollment ? 'Cannot verify without proof of enrollment' : 'Verify this student'}
                                                    >
                                                        {actionLoading ? 'Processing...' : 'Verify'}
                                                    </button>
                                                )}


                                            </div>

                                            {/* Right Side Actions */}
                                            <div className="contents">

                                                {stateFilter === 'Verified' && stateFilter !== 'StudentLeaders' && stateFilter !== 'RegionalAdmins' && (
                                                    <button
                                                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#facc15] hover:bg-[#e6b800] text-black rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                                                        onClick={() => {
                                                            setShowModal(false);
                                                            setShowModificationModal(true);
                                                        }}
                                                        disabled={actionLoading}
                                                    >
                                                        Modify
                                                    </button>
                                                )}

                                                {(stateFilter === 'Verified' || stateFilter === 'Renew' || stateFilter === 'New') && stateFilter !== 'StudentLeaders' && stateFilter !== 'RegionalAdmins' && (
                                                    <button
                                                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                                                        onClick={() => handleAction('renew', selectedUser.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? 'Processing...' : 'Renew'}
                                                    </button>
                                                )}

                                                {stateFilter !== 'StudentLeaders' && stateFilter !== 'RegionalAdmins' && (
                                                    stateFilter === 'Blocked' ? (
                                                        <button
                                                            className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                                                            onClick={() => handleAction('unblock', selectedUser.id)}
                                                            disabled={actionLoading}
                                                        >
                                                            {actionLoading ? 'Processing...' : 'Unblock User'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base bg-red-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                                                            onClick={() => {
                                                                setShowBlockModal(true);
                                                                setBlockReason('');
                                                                setError('');
                                                            }}
                                                            disabled={actionLoading}
                                                        >
                                                            Block User
                                                        </button>
                                                    )
                                                )}

                                                {user?.role === 'Regional Admin' && (stateFilter === 'Verified' || stateFilter === 'MasterList') && (
                                                    <button
                                                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                                                        onClick={() => {
                                                            setPromoteRole('Student Leader');
                                                            setShowPromoteModal(true);
                                                            setPromoteDurationType('permanent');
                                                            setPromoteDays(1);
                                                        }}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? 'Promoting...' : 'Promote to SL'}
                                                    </button>
                                                )}



                                                {(user?.role === 'Regional Admin' || user?.role === 'Super Admin') && stateFilter === 'StudentLeaders' && (
                                                    <button
                                                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none disabled:opacity-50"
                                                        onClick={() => handleAction('demote', selectedUser.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? 'Demoting...' : 'Demote to Student'}
                                                    </button>
                                                )}

                                                {user?.role === 'Super Admin' && stateFilter === 'RegionalAdmins' && (
                                                    <button
                                                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none disabled:opacity-50"
                                                        onClick={() => handleAction('demote-regional-admin', selectedUser.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? 'Demoting...' : 'Demote to Student'}
                                                    </button>
                                                )}

                                                {(user?.role === 'Super Admin' || (user?.role === 'Regional Admin' && stateFilter === 'Blocked' && selectedUser.state === 'Blocked')) && (
                                                    <button
                                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none disabled:opacity-50"
                                                        onClick={() => handleAction('delete', selectedUser.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {error && (
                                        <div className="mt-4 p-4 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg text-center">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Block User Modal */}
            {showBlockModal && createPortal(
                <div className="fixed inset-0 z-[9999] bg-[#fff]/50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowBlockModal(false);
                        }}
                    ></div>
                    <div
                        className="relative bg-black text-white p-6 rounded-lg max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Block User</h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBlockModal(false);
                                }}
                                className="text-white hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {selectedUser && (
                            <div className="mb-6">
                                <p className="text-gray-300 mb-2">
                                    You are about to block <span className="font-semibold text-white">{selectedUser.name} {selectedUser.surname}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    This action will prevent the user from accessing the platform. Please provide a reason for blocking.
                                </p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label htmlFor="blockReason" className="block text-sm font-medium text-gray-300 mb-2">
                                Reason for Blocking *
                            </label>
                            <textarea
                                id="blockReason"
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2a2a2a] border border-neutral-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter the reason for blocking this user..."
                                rows={4}
                                maxLength={1000}
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                {blockReason.length}/1000 characters
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-600 text-white rounded text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBlockModal(false);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBlockUser();
                                }}
                                className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-500 disabled:opacity-50"
                                disabled={actionLoading || !blockReason.trim()}
                            >
                                {actionLoading ? 'Processing...' : 'Block User'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Promote User Modal */}
            {showPromoteModal && createPortal(
                <div className="fixed inset-0 z-[9999] bg-[#fff]/50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowPromoteModal(false)}
                    ></div>
                    <div
                        className="relative bg-black text-white p-6 rounded-lg max-w-md w-full mx-4 border border-neutral-700"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Promote User</h3>
                            <button
                                onClick={() => setShowPromoteModal(false)}
                                className="text-white hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 mb-2 text-lg">
                                Are you sure you want to promote <span className="font-semibold text-white">{selectedUser?.name} {selectedUser?.surname}</span> to <span className="text-purple-400 font-bold">{promoteRole}</span>?
                            </p>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Promotion Duration</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPromoteDurationType('permanent')}
                                        className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 border ${promoteDurationType === 'permanent'
                                            ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                            : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:bg-neutral-700'}`}
                                    >
                                        Permanent
                                    </button>
                                    <button
                                        onClick={() => setPromoteDurationType('days')}
                                        className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 border ${promoteDurationType === 'days'
                                            ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                            : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:bg-neutral-700'}`}
                                    >
                                        For days
                                    </button>
                                </div>
                            </div>

                            {promoteDurationType === 'days' && (
                                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label htmlFor="promoteDays" className="block text-sm font-medium text-gray-300 mb-2">Number of Days</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="promoteDays"
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={promoteDays}
                                            onChange={(e) => setPromoteDays(parseInt(e.target.value) || 1)}
                                            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                        />
                                        <span className="text-gray-400 font-medium">days</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 italic flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Automatically reverts after {promoteDays} {promoteDays === 1 ? 'day' : 'days'}.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowPromoteModal(false)}
                                className="px-6 py-2.5 bg-neutral-700 text-white rounded-lg font-semibold hover:bg-neutral-600 transition-colors"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const action = promoteRole === 'Regional Admin' ? 'promote-regional-admin' : 'promote';
                                    const duration = promoteDurationType === 'days' ? promoteDays : 0;
                                    handleAction(action, selectedUser.id, { duration });
                                }}
                                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20 active:scale-95"
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'Confirm Promotion'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Attachment Modal  */}
            {showAttachmentModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80" onClick={closeAttachmentModal}></div>
                    <div className="relative bg-black text-white p-4 rounded-lg max-w-[95vw] w-[800px] max-h-[90vh] overflow-auto border border-neutral-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Proof of Enrollment</h3>
                            <div className="flex items-center gap-2">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg px-3 py-1 border border-neutral-700">
                                    <button
                                        onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                                        className="text-white hover:text-blue-400 transition-colors p-1 rounded hover:bg-neutral-700"
                                        title="Zoom Out"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                        </svg>
                                    </button>
                                    <span className="text-sm text-gray-300 min-w-[3rem] text-center">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>
                                    <button
                                        onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                                        className="text-white hover:text-blue-400 transition-colors p-1 rounded hover:text-blue-400 transition-colors p-1 rounded hover:bg-neutral-700"
                                        title="Zoom In"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setZoomLevel(1)}
                                        className="text-white hover:text-green-400 transition-colors p-1 rounded hover:bg-neutral-700 text-xs"
                                        title="Reset Zoom"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <button
                                    onClick={closeAttachmentModal}
                                    className="text-white hover:text-gray-300 text-2xl font-bold ml-4"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center overflow-hidden w-full">
                            {!fileExists ? (
                                // File not found message
                                <div className="text-center p-8 text-red-400 bg-red-500/10 rounded-lg border border-red-500/30 w-full">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-xl font-semibold mb-2">File Not Found</p>
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-red-300">The proof of enrollment file could not be located on the server.</p>
                                    </div>
                                </div>
                            ) : selectedUser?.proofOfEnrollment?.toLowerCase().endsWith('.pdf') ? (
                                // PDF Viewer with Zoom
                                <div className="relative w-full h-[75vh] overflow-hidden bg-neutral-900 rounded-lg border border-neutral-700">
                                    <SecurePdfViewer url={attachmentUrl} />
                                </div>
                            ) : (
                                // Image Viewer with Zoom and Pan
                                <div
                                    className="relative overflow-hidden rounded-lg border border-neutral-700 w-full"
                                    style={{
                                        height: '75vh',
                                        cursor: isDragging ? 'grabbing' : 'grab'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onWheel={handleWheel}
                                >
                                    <img
                                        src={attachmentUrl}
                                        alt="Proof of Enrollment"
                                        className="transition-transform duration-200 ease-out select-none"
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                                            transformOrigin: 'center',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            userSelect: 'none',
                                            WebkitUserSelect: 'none',
                                            pointerEvents: 'none' // Disable direct interaction
                                        }}
                                        onContextMenu={(e) => e.preventDefault()}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    {/* Transparent overlay to capture drag events and prevent context menu */}
                                    <div
                                        className="absolute inset-0 z-10"
                                        onContextMenu={(e) => e.preventDefault()}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        onWheel={handleWheel}
                                    ></div>
                                </div>
                            )}

                            {/* File not found message */}
                            <div
                                className="hidden text-center p-8 text-red-400 bg-red-500/10 rounded-lg border border-red-500/30"
                                style={{ display: 'none' }}
                            >
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-xl font-semibold mb-2">File Not Found</p>
                                <p className="text-sm text-red-300">The proof of enrollment file could not be located on the server.</p>
                                <p className="text-xs text-red-400 mt-2">Path: {attachmentUrl}</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* No Attachment Alert Modal */}
            {showNoAttachmentAlert && createPortal(
                <div className="fixed inset-0 z-[80] bg-[#fff]/50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowNoAttachmentAlert(false)}
                    ></div>
                    <div
                        className="relative bg-black text-white p-6 rounded-lg max-w-md w-full mx-4 border border-neutral-700"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-red-400">⚠️ Verification Blocked</h3>
                            <button
                                onClick={() => setShowNoAttachmentAlert(false)}
                                className="text-white hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-center mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 mb-3 text-center">
                                <span className="font-semibold text-white">{selectedUser?.name} {selectedUser?.surname}</span> cannot be verified at this time.
                            </p>
                            <p className="text-red-300 text-sm text-center">
                                <strong>Reason:</strong> No proof of enrollment document has been uploaded.
                            </p>
                            <p className="text-gray-400 text-sm text-center mt-3">
                                The student must upload their proof of enrollment before they can be verified.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowNoAttachmentAlert(false)}
                                className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={hideToast}
                duration={4000}
            />

            <AccountModificationModal
                isOpen={showModificationModal}
                onClose={() => setShowModificationModal(false)}
                prefillUser={selectedUser}
            />
        </>
    );
};

export default TableComponent;
