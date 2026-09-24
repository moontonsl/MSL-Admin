import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Check, X, Plus, Trash2, Save } from 'lucide-react';

const UserRegionManagement = () => {
    const { regionalAdmins, allRegions, assignedRegions, regionalAdminsList, user } = usePage().props;
    
    // Debug: Log the allRegions data
    console.log('allRegions data:', allRegions);
    console.log('allRegions type:', typeof allRegions);
    console.log('allRegions length:', allRegions?.length);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ show: false, text: '', type: 'info' });
    
    // Re-assign states
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [reassigningUser, setReassigningUser] = useState(null);
    const [selectedRegionsToReassign, setSelectedRegionsToReassign] = useState([]);
    const [targetUserId, setTargetUserId] = useState('');
    const [reassignLoading, setReassignLoading] = useState(false);

    const showToast = (text, type = 'info') => {
        setMessage({ show: true, text, type });
        setTimeout(() => setMessage({ show: false, text: '', type: 'info' }), 3000);
    };

    const startEditing = (admin) => {
        setEditingUser(admin);
        setSelectedRegions([...admin.assigned_regions]);
    };

    const cancelEditing = () => {
        setEditingUser(null);
        setSelectedRegions([]);
    };

    const toggleRegion = (region) => {
        // Check if region is already assigned to another user (only restrict for Admin, not Super Admin)
        const regionAssignment = assignedRegions[region];
        const currentUserHasRegion = regionAssignment && (
            regionAssignment.all_user_ids?.includes(editingUser?.id) || 
            regionAssignment.user_id === editingUser?.id
        );
        const isAssignedToOther = regionAssignment && !currentUserHasRegion;
        
        if (isAssignedToOther && user.role === 'Admin') {
            showToast(`Region "${region}" is already assigned to ${regionAssignment.assigned_to}`, 'error');
            return;
        }
        
        // For Super Admin, allow assigning even if already assigned to others
        // For Admin, only allow if not assigned to others (checked above)
        setSelectedRegions(prev => 
            prev.includes(region) 
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };

    const saveRegions = async () => {
        if (!editingUser) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${editingUser.id}/regions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ regions: selectedRegions })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Request URL:', `/api/admin/users/${editingUser.id}/regions`);
            console.log('Request data:', { regions: selectedRegions });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response:', textResponse);
                showToast('Server returned invalid response. Please check console for details.', 'error');
                return;
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                showToast(data.message, 'success');
                // Refresh the page to get updated data
                window.location.reload();
            } else {
                if (data.duplicate_regions && data.assigned_to) {
                    const duplicateList = data.duplicate_regions.map((region, index) => 
                        `${region} (assigned to ${data.assigned_to[index]})`
                    ).join(', ');
                    showToast(`Cannot assign regions: ${duplicateList}`, 'error');
                } else {
                    showToast(data.error || 'Failed to update regions', 'error');
                }
            }
        } catch (error) {
            console.error('Error updating regions:', error);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const startReassigning = (admin) => {
        setReassigningUser(admin);
        setSelectedRegionsToReassign([]);
        setTargetUserId('');
        setShowReassignModal(true);
    };

    const cancelReassigning = () => {
        setShowReassignModal(false);
        setReassigningUser(null);
        setSelectedRegionsToReassign([]);
        setTargetUserId('');
    };

    const toggleRegionForReassign = (region) => {
        setSelectedRegionsToReassign(prev => 
            prev.includes(region) 
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };

    const reassignRegions = async () => {
        if (!reassigningUser || !targetUserId || selectedRegionsToReassign.length === 0) {
            showToast('Please select regions and target user', 'error');
            return;
        }
        
        setReassignLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${reassigningUser.id}/reassign-regions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ 
                    to_user_id: parseInt(targetUserId),
                    regions: selectedRegionsToReassign 
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast(data.message, 'success');
                // Refresh the page to get updated data
                window.location.reload();
            } else {
                if (data.duplicate_regions) {
                    const duplicateList = data.duplicate_regions.join(', ');
                    showToast(`Cannot re-assign regions: ${duplicateList} (already assigned to target user)`, 'error');
                } else {
                    showToast(data.error || 'Failed to re-assign regions', 'error');
                }
            }
        } catch (error) {
            console.error('Error re-assigning regions:', error);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setReassignLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Region Management" />
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
                <div className="px-4 sm:px-6 lg:px-8 py-6 container mx-auto max-w-7xl">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 mb-8 shadow-2xl">
                        <h1 className="text-3xl font-bold text-white mb-2">User Region Management</h1>
                        <p className="text-neutral-300">Manage multiple regions for Regional Admin users</p>
                    </div>

                    {/* Toast Message */}
                    {message.show && (
                        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                            message.type === 'success' ? 'bg-green-600' : 
                            message.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                        } text-white`}>
                            {message.text}
                        </div>
                    )}

                    {/* Regional Admins List */}
                    <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Regional Admin Users</h2>
                            
                            {regionalAdmins.length === 0 ? (
                                <div className="text-center py-8 text-neutral-400">
                                    No Regional Admin users found.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {regionalAdmins.map((admin) => (
                                        <div key={admin.id} className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600/50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {admin.name}
                                                    </h3>
                                                    <p className="text-sm text-neutral-400">
                                                        @{admin.username} • {admin.email}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEditing(admin)}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Manage Regions
                                                    </button>
                                                    {admin.assigned_regions.length > 0 && (
                                                        <button
                                                            onClick={() => startReassigning(admin)}
                                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Re-assign Regions
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm text-neutral-400">Original Region:</span>
                                                    <span className="ml-2 px-2 py-1 bg-neutral-600 text-white rounded text-sm">
                                                        {admin.current_region || 'Not set'}
                                                    </span>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm text-neutral-400">Assigned Regions:</span>
                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                        {admin.assigned_regions.length > 0 ? (
                                                            admin.assigned_regions.map((region, index) => {
                                                                const isOriginalRegion = region === admin.current_region;
                                                                return (
                                                                    <span 
                                                                        key={index} 
                                                                        className={`px-2 py-1 text-white rounded text-sm ${
                                                                            isOriginalRegion 
                                                                                ? 'bg-green-600 border border-green-500' 
                                                                                : 'bg-purple-600'
                                                                        }`}
                                                                        title={isOriginalRegion ? 'Original Region' : 'Assigned Region'}
                                                                    >
                                                                        {region}
                                                                        {isOriginalRegion && <span className="ml-1 text-xs">(Original)</span>}
                                                                    </span>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="text-sm text-neutral-500 italic">No regions assigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Region Assignment Modal */}
                    {editingUser && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-neutral-800 rounded-xl border border-neutral-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-white">
                                            Manage Regions for {editingUser.name}
                                        </h3>
                                        <button
                                            onClick={cancelEditing}
                                            className="text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-3">Select Regions</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                {allRegions.map((region) => {
                                                    const regionAssignment = assignedRegions[region];
                                                    const currentUserHasRegion = regionAssignment && (
                                                        regionAssignment.all_user_ids?.includes(editingUser?.id) || 
                                                        regionAssignment.user_id === editingUser?.id
                                                    );
                                                    const isAssignedToOther = regionAssignment && !currentUserHasRegion;
                                                    const isAssignedToCurrent = currentUserHasRegion;
                                                    const isOriginalRegion = region === editingUser?.current_region;
                                                    
                                                    return (
                                                        <label 
                                                            key={region} 
                                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                                                isAssignedToOther && user.role === 'Admin'
                                                                    ? 'bg-red-700/30 border border-red-500/50 cursor-not-allowed opacity-60' 
                                                                    : isAssignedToOther && user.role === 'Super Admin'
                                                                    ? 'bg-yellow-700/30 border border-yellow-500/50 cursor-pointer hover:bg-yellow-700/50'
                                                                    : isAssignedToCurrent
                                                                    ? 'bg-green-700/30 border border-green-500/50 cursor-pointer hover:bg-green-700/50'
                                                                    : 'bg-neutral-700/50 cursor-pointer hover:bg-neutral-700'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRegions.includes(region)}
                                                                onChange={() => toggleRegion(region)}
                                                                disabled={isAssignedToOther && user.role === 'Admin'}
                                                                className={`w-4 h-4 rounded focus:ring-blue-500 ${
                                                                    isAssignedToOther && user.role === 'Admin'
                                                                        ? 'text-red-600 bg-neutral-600 border-neutral-500 cursor-not-allowed' 
                                                                        : 'text-blue-600 bg-neutral-600 border-neutral-500'
                                                                }`}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`${
                                                                        isAssignedToOther && user.role === 'Admin' 
                                                                            ? 'text-red-300' 
                                                                            : isAssignedToOther && user.role === 'Super Admin'
                                                                            ? 'text-yellow-300'
                                                                            : 'text-white'
                                                                    }`}>
                                                                        {region}
                                                                    </span>
                                                                    {isOriginalRegion && (
                                                                        <span className="px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                                                                            Original
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isAssignedToOther && user.role === 'Admin' && (
                                                                    <div className="text-xs text-red-400 mt-1">
                                                                        Assigned to: {assignedRegions[region].assigned_to}
                                                                    </div>
                                                                )}
                                                                {isAssignedToOther && user.role === 'Super Admin' && (
                                                                    <div className="text-xs text-yellow-400 mt-1">
                                                                        Also assigned to: {assignedRegions[region].assigned_to} (can assign to multiple users)
                                                                    </div>
                                                                )}
                                                                {isAssignedToCurrent && !isOriginalRegion && (
                                                                    <div className="text-xs text-green-400 mt-1">
                                                                        Currently assigned
                                                                    </div>
                                                                )}
                                                                {isOriginalRegion && (
                                                                    <div className="text-xs text-green-400 mt-1">
                                                                        Original region
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                                            <div className="text-sm text-neutral-400">
                                                {selectedRegions.length} region{selectedRegions.length !== 1 ? 's' : ''} selected
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg font-medium transition-all duration-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveRegions}
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Re-assign Regions Modal */}
                    {showReassignModal && reassigningUser && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-neutral-800 rounded-xl border border-neutral-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-white">
                                            Re-assign Regions from {reassigningUser.name}
                                        </h3>
                                        <button
                                            onClick={cancelReassigning}
                                            className="text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Target User Selection */}
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-3">Select Target Regional Admin</h4>
                                            <select
                                                value={targetUserId}
                                                onChange={(e) => setTargetUserId(e.target.value)}
                                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <option value="">Select Regional Admin...</option>
                                                {regionalAdminsList
                                                    .filter(admin => admin.id !== reassigningUser.id)
                                                    .map(admin => (
                                                        <option key={admin.id} value={admin.id}>
                                                            {admin.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {/* Region Selection */}
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-3">Select Regions to Re-assign</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                {reassigningUser.assigned_regions.map((region) => {
                                                    const isOriginalRegion = region === reassigningUser.current_region;
                                                    return (
                                                        <label key={region} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                                            isOriginalRegion 
                                                                ? 'bg-green-700/30 border border-green-500/50 hover:bg-green-700/50' 
                                                                : 'bg-neutral-700/50 hover:bg-neutral-700'
                                                        }`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRegionsToReassign.includes(region)}
                                                                onChange={() => toggleRegionForReassign(region)}
                                                                className="w-4 h-4 text-yellow-600 bg-neutral-600 border-neutral-500 rounded focus:ring-yellow-500"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-white">{region}</span>
                                                                    {isOriginalRegion && (
                                                                        <span className="px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                                                                            Original
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isOriginalRegion && (
                                                                    <div className="text-xs text-green-400 mt-1">
                                                                        Original region
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                                            <div className="text-sm text-neutral-400">
                                                {selectedRegionsToReassign.length} region{selectedRegionsToReassign.length !== 1 ? 's' : ''} selected for re-assignment
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={cancelReassigning}
                                                    className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg font-medium transition-all duration-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={reassignRegions}
                                                    disabled={reassignLoading || !targetUserId || selectedRegionsToReassign.length === 0}
                                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {reassignLoading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Re-assigning...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Re-assign Regions
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserRegionManagement;
