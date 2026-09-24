import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutPrograms.jsx";
import { Eye, Check, XCircle, FilePlus } from "lucide-react";
import AccountModificationModal from "./AccountModificationModal.jsx";
import UserProfileModal from "./UserProfileModal.jsx";
import MSLModal from "@/Components/MSLModal.jsx";

export default function SLAdminApproval() {
  const { user } = usePage().props;
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMSLModal, setShowMSLModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const itemsPerPage = 10;
  const mobileWindowSize = 4;

  // Fetch modification requests
  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/modification-requests?page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.data || []);
        setTotalPages(data.last_page || 1);
        setCurrentPage(data.current_page || 1);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Force hard refresh on first visit to ensure fresh CSRF token after login
    // Check if we've already reloaded in this session
    const hasReloaded = sessionStorage.getItem('slAdminApprovalReloaded') === 'true';
    
    if (!hasReloaded) {
      // Mark that we're about to reload
      sessionStorage.setItem('slAdminApprovalReloaded', 'true');
      // Force hard refresh without modifying URL
      window.location.reload();
      return;
    }
    
    // Clear the reload flag so next navigation will refresh again
    sessionStorage.removeItem('slAdminApprovalReloaded');
    
    fetchRequests();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchRequests(page);
    }
  };

  const computeMobilePages = () => {
    if (totalPages <= mobileWindowSize)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxStart = totalPages - mobileWindowSize + 1;
    const start = Math.min(Math.max(1, currentPage), maxStart);
    const pages = [];
    for (let p = start; p < start + mobileWindowSize; p++) pages.push(p);
    return pages;
  };

  const mobilePages = computeMobilePages();

  const handleViewProfile = (userData) => {
    // Use the user data directly from the request object (no API call needed)
    if (userData) {
      setSelectedUser(userData);
      setShowProfileModal(true);
    } else {
      alert('User data not available');
    }
  };

  const handleApprove = async (requestId) => {
    setModalData({
      title: 'Approve Request',
      message: 'Are you sure you want to approve this modification request?',
      type: 'success',
      confirmText: 'Approve',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setShowMSLModal(false);
        try {
          const response = await fetch(`/api/modification-requests/${requestId}/approve`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
          });
          
          const data = await response.json();
          
          if (data.success) {
            setModalData({
              title: 'Success',
              message: 'Request approved successfully!',
              type: 'success',
              confirmText: 'OK',
              showCancel: false,
              onConfirm: () => {
                setShowMSLModal(false);
                fetchRequests(currentPage);
              }
            });
            setShowMSLModal(true);
          } else {
            setModalData({
              title: 'Error',
              message: 'Error approving request: ' + (data.error || 'Unknown error'),
              type: 'error',
              confirmText: 'OK',
              showCancel: false,
              onConfirm: () => setShowMSLModal(false)
            });
            setShowMSLModal(true);
          }
        } catch (error) {
          setModalData({
            title: 'Error',
            message: 'Error approving request. Please try again.',
            type: 'error',
            confirmText: 'OK',
            showCancel: false,
            onConfirm: () => setShowMSLModal(false)
          });
          setShowMSLModal(true);
        }
      }
    });
    setShowMSLModal(true);
  };

  const handleReject = async (requestId) => {
    setModalData({
      title: 'Reject Request',
      message: 'Are you sure you want to reject this modification request?',
      type: 'error',
      confirmText: 'Reject',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setShowMSLModal(false);
        try {
          const response = await fetch(`/api/modification-requests/${requestId}/reject`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
          });
          
          const data = await response.json();
          
          if (data.success) {
            setModalData({
              title: 'Success',
              message: 'Request rejected successfully!',
              type: 'success',
              confirmText: 'OK',
              showCancel: false,
              onConfirm: () => {
                setShowMSLModal(false);
                fetchRequests(currentPage);
              }
            });
            setShowMSLModal(true);
          } else {
            setModalData({
              title: 'Error',
              message: 'Error rejecting request: ' + (data.error || 'Unknown error'),
              type: 'error',
              confirmText: 'OK',
              showCancel: false,
              onConfirm: () => setShowMSLModal(false)
            });
            setShowMSLModal(true);
          }
        } catch (error) {
          setModalData({
            title: 'Error',
            message: 'Error rejecting request. Please try again.',
            type: 'error',
            confirmText: 'OK',
            showCancel: false,
            onConfirm: () => setShowMSLModal(false)
          });
          setShowMSLModal(true);
        }
      }
    });
    setShowMSLModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">Pending</span>;
      case 'Approved':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">Approved</span>;
      case 'Rejected':
        return <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">{status}</span>;
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <>
      <Head title="SL Admin Approval" />
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center p-4 font-['Montserrat']">
          <div className="w-full max-w-xs sm:max-w-7xl lg:max-w-full xl:max-w-full mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 shadow-2xl">

              {/* Header with Title and Create Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="font-bold text-white text-center text-[20px] sm:text-[28px] lg:text-[40px]">
                  SL Admin Approval
                </h1>
                {user.role === 'SL' && (
                  <button onClick={() => setShowModal(true)}
                    className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold">
                    <FilePlus className="w-4 h-4" /> Create Modification
                  </button>
                )}
              </div>

              {/* Table View (Desktop) */}
              <div className="hidden sm:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="font-bold text-gray-200 text-[20px] sm:text-[24px] lg:text-[30px]">
                      <th className="px-4 py-3 text-left border-b border-white/20">Username</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Request</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Wrong</th>
                      <th className="px-4 py-3 text-left border-b border-white/20">Correct</th>
                      <th className="px-4 py-3 text-center border-b border-white/20">Proof</th>
                      <th className="px-4 py-3 text-center border-b border-white/20">Status</th>
                      <th className="px-4 py-3 text-center border-b border-white/20">Approved By</th>
                      {user.role === 'Regional Admin' && (
                        <>
                          <th className="px-4 py-3 text-center border-b border-white/20">Approve</th>
                          <th className="px-4 py-3 text-center border-b border-white/20">Reject</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, index) => (
                      <tr
                        key={req.id}
                        className={`font-medium text-gray-200 text-[14px] sm:text-[16px] ${
                          index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/10 transition`}
                      >
                        <td className="px-4 py-3">{req.user?.username || 'N/A'}</td>
                        <td className="px-4 py-3">{req.modification_type}</td>
                        <td className="px-4 py-3 text-red-400">{req.wrong_value}</td>
                        <td className="px-4 py-3 text-green-400">{req.correct_value}</td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleViewProfile(req.user)}
                            className="flex items-center mx-auto px-3 py-1 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {req.approved_by ? `${req.approved_by.name || ''} ${req.approved_by.surname || ''}`.trim() : 'Pending Approval'}
                        </td>
                        {user.role === 'Regional Admin' && req.status === 'Pending' && (
                          <>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleApprove(req.id)}
                                className="flex items-center mx-auto px-3 py-1 bg-green-500/80 text-white rounded-lg hover:bg-green-600 transition"
                              >
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleReject(req.id)}
                                className="flex items-center mx-auto px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition"
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </button>
                            </td>
                          </>
                        )}
                        {user.role === 'Regional Admin' && req.status !== 'Pending' && (
                          <>
                            <td className="px-4 py-3 text-center text-gray-500">-</td>
                            <td className="px-4 py-3 text-center text-gray-500">-</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Version */}
              <div className="sm:hidden space-y-2">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white/5 rounded-lg p-3 text-gray-200 shadow text-xs w-[90%] mx-auto"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{req.user?.username || 'N/A'}</p>
                        {getStatusBadge(req.status)}
                      </div>
                      <p><span className="font-bold">Request:</span> {req.modification_type}</p>
                      <p className="text-red-400"><span className="font-bold">Wrong:</span> {req.wrong_value}</p>
                      <p className="text-green-400"><span className="font-bold">Correct:</span> {req.correct_value}</p>
                      <p><span className="font-bold">Approved By:</span> {req.approved_by ? `${req.approved_by.name || ''} ${req.approved_by.surname || ''}`.trim() : 'Pending Approval'}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleViewProfile(req.user)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500/80 text-white rounded-md hover:bg-blue-600 transition text-xs"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        {user.role === 'Regional Admin' && req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-500/80 text-white rounded-md hover:bg-green-600 transition text-xs"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition text-xs"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-500/70 text-white rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>

                <div className="hidden sm:flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700/70 text-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex sm:hidden space-x-2">
                  {mobilePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700/70 text-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-500/70 text-white rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

      <AccountModificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
      />

      <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={selectedUser}
      />
      
      <MSLModal
        isOpen={showMSLModal}
        onClose={() => setShowMSLModal(false)}
        {...modalData}
      />
    </>
  );
}
