import React, { useMemo, useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Mock data removed

const SOLO_ROLES = ['Jungler', 'Roam', 'Gold Laner', 'Exp Laner', 'Mid Laner'];
const ROLE_IMAGE_MAP = {
  Jungler: 'zxq_icon_jgl.png',
  Roam: 'zxq_icon_roam.png',
  'Gold Laner': 'zxq_icon_gold.png',
  'Exp Laner': 'zxq_icon_exp.png',
  'Mid Laner': 'zxq_icon_mid.png',
};

function RoleIcon({ role }) {
  const file = ROLE_IMAGE_MAP[role];
  if (!file) return null;
  return (
    <img
      src={`/images/Campus Tournament/Roles/${file}`}
      alt={role}
      className="w-4 h-4 md:w-5 md:h-5 object-contain"
      aria-hidden
    />
  );
}

const SOLO_POOL_GRID =
  'grid grid-cols-[120px_repeat(5,minmax(0,1fr))] lg:grid-cols-[150px_repeat(5,minmax(0,1fr))] gap-4';


const RegionalAdmin = () => {
  const { tournaments, approvedTournaments, user } = usePage().props;
  const [localTournaments, setLocalTournaments] = useState(tournaments || []);
  const [decisionById, setDecisionById] = useState({}); // { [id]: 'approved' | 'rejected' }
  const [viewing, setViewing] = useState(null); // request being viewed in modal
  const [expanded, setExpanded] = useState({}); // id -> boolean
  const [mobileViewTeam, setMobileViewTeam] = useState(null); // mobile-only player popup
  const [isProcessing, setIsProcessing] = useState({}); // Track which requests are being processed
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Show success modal
  const [pendingAction, setPendingAction] = useState(null); // Store pending action data

  // Results Editing State
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [isEditingResults, setIsEditingResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null); // { type, title, message }
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Extension State
  const [extendingTournament, setExtendingTournament] = useState(null);
  const [newEndDate, setNewEndDate] = useState('');
  const [isExtending, setIsExtending] = useState(false);
  const [isBulkExtend, setIsBulkExtend] = useState(false);

  // Ongoing Teams View Modal State
  const [viewingTeamsTournament, setViewingTeamsTournament] = useState(null); // tournament being viewed (ongoing section)
  const [viewingTeamsTab, setViewingTeamsTab] = useState('teams'); // 'teams' | 'solo'

  // Pre-Reg Export Modal State
  const [showPreRegModal, setShowPreRegModal] = useState(false);
  const [preRegIsland, setPreRegIsland] = useState('Luzon');
  const [preRegStart, setPreRegStart] = useState('');
  const [preRegEnd, setPreRegEnd] = useState('');
  const [preRegError, setPreRegError] = useState('');

  // Prevent background scroll while any modal is open (including the View modal).
  useEffect(() => {
    const anyModalOpen = Boolean(
      viewingTeamsTournament ||
      viewing ||
      mobileViewTeam ||
      showPreRegModal ||
      extendingTournament ||
      showConfirmModal ||
      showSuccessModal ||
      showSubmitModal
    );

    if (!anyModalOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Avoid layout shift when the scrollbar disappears.
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [
    viewingTeamsTournament,
    viewing,
    mobileViewTeam,
    showPreRegModal,
    extendingTournament,
    showConfirmModal,
    showSuccessModal,
    showSubmitModal,
  ]);

  // Use real approved tournaments data instead of mock data
  const [staticTournaments, setStaticTournaments] = useState(approvedTournaments || []);

  const [filterStatus, setFilterStatus] = useState('ongoing'); // 'ongoing' | 'completed'
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'ongoing' | 'completed'
  const [showOnline, setShowOnline] = useState(true);
  const [showOnsite, setShowOnsite] = useState(true);
  const [searchSchool, setSearchSchool] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Pagination State
  const [requestPage, setRequestPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const itemsPerPage = 5;

  // Transform real tournament data to match the expected format
  const transformedTournaments = useMemo(() => {
    if (!staticTournaments || staticTournaments.length === 0) return [];

    return staticTournaments.map(tournament => ({
      id: tournament.id,
      schoolName: tournament.school_name,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      tournament_type: tournament.tournament_type,
      results_submitted: tournament.results_submitted,
      results_submitted_at: tournament.results_submitted_at,
      teams: tournament.teams ? tournament.teams
        .filter(team => ['registered', 'assembling'].includes(team.status))
        .map(team => ({
          id: team.id,
          name: team.team_name,
          type: team.type || 'team',
          status: team.status,
          result: team.result,
          players: team.members ? team.members.map(member => ({
            id: member.player_id,
            name: member.player ? `${member.player.name} ${member.player.surname}`.trim() : 'Unknown Player',
            // Development/testing: allow mock data to specify verification per player.
            // In production data we default to true if not present.
            verified: Boolean(member?.verified ?? member?.player?.verified ?? true),
            accepted: member.status === 'accepted',
            ign: member.player?.ml_ign ?? member.player?.ign ?? null,
            role: member.role,
            lane_role: member.lane_role ?? null,
            facebook_link: member.player?.facebook_link ?? null
          })) : []
        })) : []
    }));
  }, [staticTournaments]);

  // Split tournaments into Active (Ongoing) and Completed
  const activeTournaments = useMemo(() => {
    return transformedTournaments.filter(t => {
      if (t.results_submitted) return false;
      const type = (t.tournament_type || 'Online').toLowerCase();
      if (type === 'online' && !showOnline) return false;
      if (type === 'onsite' && !showOnsite) return false;

      // School search filter
      if (searchSchool && !t.schoolName?.toLowerCase().includes(searchSchool.toLowerCase())) return false;

      // Date filter (month and year of start_date)
      if ((filterMonth || filterYear) && t.startDate) {
        const tDate = new Date(t.startDate);
        if (!isNaN(tDate.getTime())) {
          if (filterMonth && String(tDate.getMonth() + 1).padStart(2, '0') !== filterMonth) return false;
          if (filterYear && String(tDate.getFullYear()) !== filterYear) return false;
        }
      }

      return true;
    });
  }, [transformedTournaments, showOnline, showOnsite, searchSchool, filterMonth, filterYear]);

  const completedTournaments = useMemo(() => {
    return transformedTournaments.filter(t => {
      if (!t.results_submitted) return false;
      const type = (t.tournament_type || 'Online').toLowerCase();
      if (type === 'online' && !showOnline) return false;
      if (type === 'onsite' && !showOnsite) return false;

      // School search filter
      if (searchSchool && !t.schoolName?.toLowerCase().includes(searchSchool.toLowerCase())) return false;

      // Date filter (month and year of start_date)
      if ((filterMonth || filterYear) && t.startDate) {
        const tDate = new Date(t.startDate);
        if (!isNaN(tDate.getTime())) {
          if (filterMonth && String(tDate.getMonth() + 1).padStart(2, '0') !== filterMonth) return false;
          if (filterYear && String(tDate.getFullYear()) !== filterYear) return false;
        }
      }

      return true;
    });
  }, [transformedTournaments, showOnline, showOnsite, searchSchool, filterMonth, filterYear]);




  // Set default selected tournament
  React.useEffect(() => {
    if (completedTournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(completedTournaments[0].id);
    }
  }, [completedTournaments, selectedTournamentId]);

  useEffect(() => {
    setRequestPage(1);
    setOngoingPage(1);
    setCompletedPage(1);
  }, [showOnline, showOnsite, filterStatus, activeTab, searchSchool, filterMonth, filterYear]);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setIsEditingResults(false); // Reset edit mode on change
  };

  const hasPending = useMemo(() => localTournaments.some(r => r.status === 'pending'), [localTournaments]);

  const handleConfirmAction = (action, tournament) => {
    setPendingAction({ action, tournament });
    setShowConfirmModal(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const formatDate = (value) => {
    try {
      if (!value) return '';

      // Handle different date formats
      let date;
      if (typeof value === 'string') {
        // If it's already a valid date string, use it directly
        if (value.includes('T') || value.includes(' ')) {
          date = new Date(value);
        } else {
          // If it's just a date (YYYY-MM-DD), add time
          date = new Date(`${value}T00:00:00`);
        }
      } else {
        date = new Date(value);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', value);
        return 'Invalid Date';
      }

      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Date formatting error:', e, 'Value:', value);
      return 'Invalid Date';
    }
  };

  const handleApprove = (id) => {
    const tournament = localTournaments.find(t => t.id === id);
    handleConfirmAction('approve', tournament);
  };

  const executeApprove = async (id) => {
    setIsProcessing(prev => ({ ...prev, [id]: true }));

    try {
      const response = await fetch(`/campus-tournaments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to remove the approved tournament
        setLocalTournaments(prev => prev.filter(t => t.id !== id));
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        alert('Error approving tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error approving tournament:', error);
      alert('Error approving tournament. Please try again.');
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setIsProcessing(prev => ({ ...prev, [id]: true }));

    try {
      const response = await fetch(`/campus-tournaments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          rejection_reason: reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to remove the rejected tournament
        setLocalTournaments(prev => prev.filter(t => t.id !== id));
      } else {
        alert('Error rejecting tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error rejecting tournament:', error);
      alert('Error rejecting tournament. Please try again.');
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };


  const handleExtendClick = (tournament) => {
    setIsBulkExtend(false);
    setExtendingTournament(tournament);
    // Set default date to current end date (formatted for input)
    if (tournament.endDate) {
      const date = new Date(tournament.endDate);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      setNewEndDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setNewEndDate('');
    }
  };

  const handleBulkExtendClick = () => {
    setIsBulkExtend(true);
    setExtendingTournament({ id: 'bulk', schoolName: 'All Ongoing Tournaments' });
    setNewEndDate('');
  };

  const handleExtendSubmit = async () => {
    if (!extendingTournament || !newEndDate) return;

    setIsExtending(true);

    try {
      const isBulk = extendingTournament.id === 'bulk';
      const url = isBulk
        ? '/campus-tournaments/bulk-extend'
        : `/campus-tournaments/${extendingTournament.id}/extend`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          end_date: newEndDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the staticTournaments/transformedTournaments locally to reflect change
        // Since transformedTournaments is derived from staticTournaments, we can just reload the page or update state if we had a setter for staticTournaments (which we don't really have exposed easily for partial updates without refetching, but we can try to force a reload or just use Inertia reload).
        // Better: use Inertia reload, but for now simple alert and reload
        // Better: use Inertia reload, but for now simple alert and reload
        setSubmitModalData({
          type: 'success',
          title: 'Success',
          message: isBulk
            ? 'All ongoing tournaments extended successfully!'
            : 'Tournament registration extended successfully!',
          showCancel: false
        });
        setShowSubmitModal(true);
        setExtendingTournament(null);
        router.reload({
          only: ['tournaments', 'approvedTournaments'],
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            setLocalTournaments(page.props.tournaments || []);
            setStaticTournaments(page.props.approvedTournaments || []);
          }
        });
      } else {
        setSubmitModalData({
          type: 'error',
          title: 'Error',
          message: 'Error extending tournament: ' + (data.error || JSON.stringify(data.errors) || 'Unknown error'),
          showCancel: false
        });
        setShowSubmitModal(true);
      }
    } catch (error) {
      console.error('Error extending tournament:', error);
      setSubmitModalData({
        type: 'error',
        title: 'Error',
        message: 'Error extending tournament. Please try again.',
        showCancel: false
      });
      setShowSubmitModal(true);
    } finally {
      setIsExtending(false);
    }
  };

  const handleDeleteTournament = async (tournament) => {
    if (!confirm(`Are you sure you want to delete the tournament for ${tournament.schoolName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/campus-tournaments/${tournament.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      const data = await response.json();

      if (data.success) {
        setSubmitModalData({
          type: 'success',
          title: 'Success',
          message: 'Tournament deleted successfully',
          showCancel: false
        });
        setShowSubmitModal(true);
        router.reload({
          only: ['tournaments', 'approvedTournaments'],
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            setLocalTournaments(page.props.tournaments || []);
            setStaticTournaments(page.props.approvedTournaments || []);
          }
        });
      } else {
        setSubmitModalData({
          type: 'error',
          title: 'Error',
          message: 'Error deleting tournament: ' + (data.error || 'Unknown error'),
          showCancel: false
        });
        setShowSubmitModal(true);
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setSubmitModalData({
        type: 'error',
        title: 'Error',
        message: 'Error deleting tournament. Please try again.',
        showCancel: false
      });
      setShowSubmitModal(true);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };



  const PlayerCell = ({ player }) => {
    const nameDisplay = player?.name || 'Player';
    return (
      <div className="w-full md:w-auto flex flex-col items-center gap-1 text-white/80 text-xs md:text-sm font-montserrat">
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <svg
            className="absolute inset-0 m-auto w-5 h-5 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {player?.avatarUrl && (
            <img src={player.avatarUrl} alt={nameDisplay} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {player?.facebook_link ? (
            <a
              href={player.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate max-w-[8ch] md:max-w-[12ch] hover:text-blue-400 transition-colors"
              title="View Facebook Profile"
            >
              {nameDisplay}
            </a>
          ) : (
            <span className="truncate max-w-[8ch] md:max-w-[12ch]">{nameDisplay}</span>
          )}
          <span className={`w-2.5 h-2.5 rounded-full ${player?.accepted ? 'bg-green-400' : 'bg-red-500'}`} />
        </div>
      </div>
    );
  };

  // Modal-specific player cell:
  // - Name + IGN stack on the left
  // - Avatar/icon on the right
  const PlayerCellModal = ({ player, align = 'start' }) => {
    const verified = Boolean(player?.verified);
    const nameDisplay = player?.name || 'Player';
    return (
      <div
        className={`w-full flex items-center gap-3 min-w-0 ${align === 'center' ? 'justify-center' : 'justify-start'
          }`}
      >
        <div className="relative w-9 h-9 rounded-full flex-shrink-0">
          {/* Keep the image clipped, but allow the verification dot to overflow outside the avatar. */}
          <div className="relative w-full h-full overflow-hidden rounded-full border border-white/20 bg-white/10">
            <svg
              className="absolute inset-0 m-auto w-5 h-5 text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {player?.avatarUrl && (
              <img
                src={player.avatarUrl}
                alt={nameDisplay}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Verification indicator (dot) OVER avatar */}
          <span
            className={`absolute bottom-[-3px] right-[-3px] z-20 w-4 h-4 rounded-full border border-black/60 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${player?.accepted ? 'bg-green-400' : 'bg-red-500'
              }`}
          />
        </div>

        <div className={`flex flex-col min-w-0 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
          <div className="flex items-center gap-2 min-w-0">
            {player?.facebook_link ? (
              <a
                href={player.facebook_link}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate max-w-[100px] text-white/90 text-sm font-montserrat leading-tight hover:text-blue-400 transition-colors"
                title="View Facebook Profile"
              >
                {nameDisplay}
              </a>
            ) : (
              <span className={`truncate max-w-[100px] text-white/90 text-sm font-montserrat leading-tight ${align === 'center' ? 'text-center' : ''}`}>
                {nameDisplay}
              </span>
            )}
          </div>
          <span className={`truncate max-w-[100px] text-white/60 text-xs font-montserrat leading-tight ${align === 'center' ? 'text-center' : ''}`}>
            {player?.ign || '—'}
          </span>
        </div>
      </div>
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case '1st': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
      case '2nd': return 'bg-gray-400/20 text-gray-300 border border-gray-400/30';
      case '3rd': return 'bg-orange-700/20 text-orange-400 border border-orange-500/30';
      case 'participant': return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const getTeamConfirmation = (team) => {
    const players = Array.isArray(team?.players) ? team.players : [];
    const firstFive = players.slice(0, 5);
    const allAccepted = firstFive.length === 5 && firstFive.every((p) => Boolean(p?.accepted));

    if (allAccepted) {
      return {
        label: 'Confirmed',
        pillClassName: 'bg-green-500/20 text-green-200 border border-green-400/30',
      };
    }

    return {
      label: 'Pending',
      pillClassName: 'bg-red-500/20 text-red-200 border border-red-400/30',
    };
  };

  const handleSetResult = (tournamentId, teamId, newResult) => {
    setStaticTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          teams: t.teams.map(team =>
            team.id === teamId ? { ...team, result: newResult } : team
          )
        };
      }
      return t;
    }));
  };

  const handleSubmitResults = async (tournamentId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const tournament = staticTournaments.find(t => t.id === tournamentId);
      if (!tournament) return;

      const results = tournament.teams.map(team => ({
        team_id: team.id,
        result: team.result || 'participant'
      }));

      // For Regional Admin, we always use update-results since they are likely editing existing or finalizing
      // But if it was never submitted, we might need submit-results. 
      // However, the backend updateResults now allows Admins.
      // Let's use update-results if results_submitted is true, else submit-results if we supported that.
      // Ideally we use one endpoint or logic. Given the user context "Edit results", update-results applies.

      const endpoint = `/campus-tournaments/${tournamentId}/update-results`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({ results }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to mark results as submitted
        setStaticTournaments((prev) =>
          prev.map((t) =>
            t.id === tournamentId
              ? { ...t, results_submitted: true, results_submitted_at: new Date().toISOString() }
              : t
          )
        );
        setIsEditingResults(false);
        setSubmitModalData({
          type: 'success',
          title: 'Results Updated',
          message: 'Tournament results have been updated successfully.',
          showCancel: false
        });
        setShowSubmitModal(true);
      } else {
        setSubmitModalData({
          type: 'error',
          title: 'Update Failed',
          message: data.error || 'Unknown error occurred.',
          showCancel: false
        });
        setShowSubmitModal(true);
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      setSubmitModalData({
        type: 'error',
        title: 'Error',
        message: 'An error occurred while communicating with the server.',
        showCancel: false
      });
      setShowSubmitModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmitModalData(null);
  };

  const Pagination = ({ currentPage, totalItems, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6 space-x-2 font-montserrat">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-neutral-800/80 text-white rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-700/80 transition-colors text-xs"
        >
          Prev
        </button>
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === page
                ? "bg-[#F2C21A] text-black shadow-[0_0_10px_-3px_rgba(242,194,26,0.5)]"
                : "bg-neutral-800/80 text-white/70 hover:text-white border border-white/10"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-neutral-800/80 text-white rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-700/80 transition-colors text-xs"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <MainLayout>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
      >
        <div className="w-full min-h-screen bg-black/60">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-16">
            {/* Title + Logo (same as /Tournament/SL) */}
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src="/images/About Page/SL Logo.png"
                  alt="SL Logo"
                  className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
                />
                <div className="text-white font-montserrat font-extrabold text-[32px] md:text-[48px] lg:text-[56px] leading-tight">
                  CAMPUS TOURNAMENT
                </div>
              </div>
              {/* Generate Pre Reg — Super Admin only */}
              {user?.role === 'Super Admin' && (
                <button
                  type="button"
                  onClick={() => { setPreRegError(''); setShowPreRegModal(true); }}
                  className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2.5 shadow-[0_0_12px_-3px_rgba(242,194,26,0.8)] hover:bg-[#d4a817] transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Pre Reg
                </button>
              )}
            </div>
            {/* Tabs: Requests | Ongoing | Completed */}
            <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`pb-2 px-4 font-montserrat font-bold text-lg md:text-xl transition-colors relative ${activeTab === 'requests' ? 'text-[#F2C21A]' : 'text-white/50 hover:text-white/80'
                    }`}
                >
                  Requests ({localTournaments.length})
                  {activeTab === 'requests' && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F2C21A] rounded-t-full" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setFilterStatus('ongoing');
                    setActiveTab('ongoing');
                  }}
                  className={`pb-2 px-4 font-montserrat font-bold text-lg md:text-xl transition-colors relative ${activeTab === 'ongoing' ? 'text-[#F2C21A]' : 'text-white/50 hover:text-white/80'
                    }`}
                >
                  Ongoing ({activeTournaments.length})
                  {activeTab === 'ongoing' && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F2C21A] rounded-t-full" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setFilterStatus('completed');
                    setActiveTab('completed');
                  }}
                  className={`pb-2 px-4 font-montserrat font-bold text-lg md:text-xl transition-colors relative ${activeTab === 'completed' ? 'text-[#F2C21A]' : 'text-white/50 hover:text-white/80'
                    }`}
                >
                  Completed ({completedTournaments.length})
                  {activeTab === 'completed' && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F2C21A] rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Only show filters for Ongoing/Completed tabs */}
              {activeTab !== 'requests' && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-4 pb-2 md:pb-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search School..."
                      value={searchSchool}
                      onChange={(e) => setSearchSchool(e.target.value)}
                      className="bg-black/30 border border-white/20 text-white text-sm rounded-lg focus:ring-[#F2C21A] focus:border-[#F2C21A] block w-full px-3 py-1.5 font-montserrat placeholder-white/40"
                    />
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="bg-black/30 border border-white/20 text-white text-sm rounded-lg focus:ring-[#F2C21A] focus:border-[#F2C21A] block px-3 py-1.5 font-montserrat min-w-[110px]"
                    >
                      <option value="">Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="bg-black/30 border border-white/20 text-white text-sm rounded-lg focus:ring-[#F2C21A] focus:border-[#F2C21A] block px-3 py-1.5 font-montserrat min-w-[80px]"
                    >
                      <option value="">Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                    {(searchSchool || filterMonth || filterYear) && (
                      <button
                        onClick={() => { setSearchSchool(''); setFilterMonth(''); setFilterYear(''); }}
                        className="text-white/50 hover:text-white p-1"
                        title="Clear Filters"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={showOnline}
                          onChange={(e) => setShowOnline(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-[#F2C21A] peer-checked:border-[#F2C21A] transition-all duration-200 group-hover:border-[#F2C21A]/50"></div>
                        <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-sm text-white/80 group-hover:text-white transition-colors">Online</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={showOnsite}
                          onChange={(e) => setShowOnsite(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-[#F2C21A] peer-checked:border-[#F2C21A] transition-all duration-200 group-hover:border-[#F2C21A]/50"></div>
                        <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-sm text-white/80 group-hover:text-white transition-colors">Onsite</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            {/* Tournament Requests */}
            <div className={`mb-12 ${activeTab === 'requests' ? '' : 'hidden'}`}>
              <div className="text-white font-montserrat font-extrabold text-[22px] md:text-[28px] leading-tight">
                Tournament Requests
              </div>

              {/* Requests Table */}
              <div className="mt-2 md:mt-4">
                <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                  {/* Header Row (hidden on mobile) */}
                  <div className="hidden md:grid [grid-template-columns:minmax(220px,2.2fr)_repeat(4,minmax(140px,1fr))_minmax(200px,1.3fr)] items-center gap-3 px-5 md:px-8 py-3 bg-neutral-900/70 text-white/80 text-xs md:text-sm font-montserrat">
                    <div className="font-semibold">School name</div>
                    <div className="text-center font-semibold">Type</div>
                    <div className="text-center font-semibold">Start date</div>
                    <div className="text-center font-semibold">End date</div>
                    <div className="text-center font-semibold">SL name</div>
                    <div className="text-right font-semibold">Action</div>
                  </div>

                  {/* Body */}
                  <div className="divide-y divide-white/10 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {localTournaments.length === 0 && (
                      <div className="px-6 py-8 text-center text-white/60 font-montserrat">No requests.</div>
                    )}

                    {localTournaments
                      .slice((requestPage - 1) * itemsPerPage, requestPage * itemsPerPage)
                      .map((req) => {
                        const isProcessingThis = isProcessing[req.id];
                        return (
                          <div key={req.id}>
                            {/* Desktop row */}
                            <div className="hidden md:grid [grid-template-columns:minmax(220px,2.2fr)_repeat(4,minmax(140px,1fr))_minmax(200px,1.3fr)] items-center gap-3 px-5 md:px-8 py-3 hover:bg-white/5 transition-colors">
                              <div className="font-montserrat text-white/90 md:truncate">{req.school_name}</div>
                              <div className="text-center font-montserrat text-white/80">{req.tournament_type || 'Online'}</div>
                              <div className="text-center font-montserrat text-white/80">{formatDate(req.start_date)}</div>
                              <div className="text-center font-montserrat text-white/80">{formatDate(req.end_date)}</div>
                              <div className="text-center font-montserrat text-white/80">{req.sl_name}</div>
                              <div className="flex justify-end items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(req.id)}
                                  disabled={isProcessingThis}
                                  className={`bg-[#F2C21A] text-black font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessingThis ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(req.id)}
                                  disabled={isProcessingThis}
                                  className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] md:text-xs font-semibold rounded-lg px-3 py-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessingThis ? 'Processing...' : 'Reject'}
                                </button>
                              </div>
                            </div>

                            {/* Mobile row: show School, Action buttons, and View */}
                            <div className="md:hidden grid [grid-template-columns:minmax(180px,1fr)_minmax(140px,auto)_auto] items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                              <div className="font-montserrat text-white/90">
                                {req.school_name}
                                <span className="block text-[10px] text-white/60">{req.tournament_type || 'Online'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(req.id)}
                                  disabled={isProcessingThis}
                                  className={`bg-[#F2C21A] text-black font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessingThis ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(req.id)}
                                  disabled={isProcessingThis}
                                  className={`bg-red-500 hover:bg-red-600 text-white font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessingThis ? 'Processing...' : 'Reject'}
                                </button>
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setViewing(req); }}
                                  className="bg-white/10 hover:bg-white/20 text-white font-montserrat text-[11px] font-semibold rounded-lg px-3 py-1.5"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Pagination for Requests */}
                  {localTournaments.length > itemsPerPage && (
                    <div className="pb-4">
                      <Pagination
                        currentPage={requestPage}
                        totalItems={localTournaments.length}
                        onPageChange={setRequestPage}
                      />
                    </div>
                  )}
                </div>

                {/* Helper note */}
                <div className="mt-3 text-xs text-white/60 font-montserrat">
                  Approve or reject each request. Approved tournaments will appear on the Campus Tournament page.
                </div>
              </div>
            </div>

            {/* ONGOING VIEW */}
            {activeTab === 'ongoing' && (
              <>




                {/* Ongoing Tournaments (Active Only) */}
                <div className="mt-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="text-white font-montserrat font-extrabold text-[22px] md:text-[28px] leading-tight">
                        Ongoing Tournaments
                      </div>
                    </div>
                    {user?.role === 'Super Admin' && (
                      <button
                        onClick={handleBulkExtendClick}
                        className="px-6 py-2 rounded-full bg-[#F2C21A] hover:bg-[#d4a817] text-black font-bold text-sm font-montserrat transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 w-fit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Reschedule All
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-4 pr-2">
                    {activeTournaments.length > 0 ? (
                      activeTournaments
                        .slice((ongoingPage - 1) * itemsPerPage, ongoingPage * itemsPerPage)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50"
                          >
                            {/* Ongoing Tournament Card Content */}
                            {/* Header */}
                            <div className="relative z-10 w-full bg-neutral-900/70 px-4 md:px-6 py-3">
                              {/* Desktop Row (matches screenshot layout) */}
                              <div className="hidden md:grid grid-cols-[minmax(260px,2.2fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(160px,1.2fr)_auto] items-center gap-3">
                                {(() => {
                                  const verifiedCount = Array.isArray(item.teams) ? item.teams.filter(t => t.status === 'registered' && t.players.length >= 5 && t.players.slice(0, 5).every(p => p.accepted)).length : 0;
                                  const pendingCount = Array.isArray(item.teams) ? item.teams.filter(t => t.status === 'assembling' || t.players.length < 5 || t.players.slice(0, 5).some(p => !p.accepted)).length : 0;
                                  const totalRegistration = verifiedCount + pendingCount;

                                  return (
                                    <>
                                      <div className="text-left">
                                        <div className="text-[11px] font-montserrat text-white/60">School Name</div>
                                        <div className="font-montserrat text-lg tracking-wide uppercase text-white/95">
                                          {item.schoolName ? `${item.schoolName.toUpperCase()} TOURNAMENT` : 'TOURNAMENT'}
                                        </div>
                                        <div className="font-montserrat text-xs text-white/70">
                                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                        </div>
                                      </div>

                                      <div className="text-center font-montserrat">
                                        <div className="text-[11px] text-white/60">Verified Teams</div>
                                        <div className="text-base text-white/90">{verifiedCount}</div>
                                      </div>

                                      <div className="text-center font-montserrat">
                                        <div className="text-[11px] text-white/60">Pending Teams</div>
                                        <div className="text-base text-white/90">{pendingCount}</div>
                                      </div>

                                      <div className="text-center font-montserrat">
                                        <div className="text-[11px] text-white/60">Total Registration</div>
                                        <div className="text-base text-white/90">{totalRegistration}</div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setViewingTeamsTournament(item); setViewingTeamsTab('teams'); }}
                                          className="px-4 py-1.5 rounded-lg border border-white/20 bg-neutral-800/40 hover:bg-neutral-700/50 text-white/90 text-xs font-montserrat transition-colors"
                                        >
                                          View
                                        </button>

                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleExtendClick(item); }}
                                          className="px-4 py-1.5 rounded-lg border border-[#F2C21A]/60 bg-[#F2C21A]/90 hover:bg-[#d4a817] text-black text-xs font-montserrat transition-colors"
                                        >
                                          Resched
                                        </button>

                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleDeleteTournament(item); }}
                                          className="px-4 py-1.5 rounded-lg border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 text-white/90 text-xs font-montserrat transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>

                              {/* Mobile Row */}
                              <div className="md:hidden flex flex-col gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="font-montserrat text-base tracking-wide uppercase text-white/95 truncate">
                                    {item.schoolName ? `${item.schoolName.toUpperCase()} TOURNAMENT` : 'TOURNAMENT'}
                                  </div>
                                  <div className="font-montserrat text-xs text-white/70 mt-1">
                                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/70 font-montserrat">
                                    <span>Verified: {Array.isArray(item.teams) ? item.teams.length : 0}</span>
                                    <span>Pending: 0</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 justify-end flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => { setViewingTeamsTournament(item); setViewingTeamsTab('teams'); }}
                                    className="px-2 py-1.5 rounded-lg border border-white/20 bg-neutral-800/40 hover:bg-neutral-700/50 text-white/90 text-[11px] font-montserrat transition-colors"
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleExtendClick(item); }}
                                    className="px-2 py-1.5 rounded-lg border border-[#F2C21A]/60 bg-[#F2C21A]/90 hover:bg-[#d4a817] text-black text-[11px] font-montserrat transition-colors"
                                  >
                                    Resched
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTournament(item); }}
                                    className="px-2 py-1.5 rounded-lg border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 text-white/90 text-[11px] font-montserrat transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Dropdown Content */}
                            <div
                              className={`transition-all duration-700 ease-in-out ${expanded[item.id] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                            >
                              <div className="px-0 pb-0">
                                <div className="mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                                  {/* Table Header - Desktop */}
                                  <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                                    <div className="self-center">Team name</div>
                                    <div className="text-center">Player 1</div>
                                    <div className="text-center">Player 2</div>
                                    <div className="text-center">Player 3</div>
                                    <div className="text-center">Player 4</div>
                                    <div className="text-center">Player 5</div>
                                    <div className="grid place-items-center">Status</div>
                                  </div>
                                  {/* Table Header - Mobile (Team + Status) */}
                                  <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat">
                                    <div className="self-center">Team name</div>
                                    <div className="justify-self-start text-left">Status</div>
                                    <div className="text-right"></div>
                                  </div>

                                  {/* Team Rows */}
                                  {Array.isArray(item.teams) && item.teams.length > 0 ? (
                                    item.teams.map((team) => (
                                      <React.Fragment key={team.id}>
                                        {/* Desktop Row */}
                                        <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                          <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                                          {Array.from({ length: 5 }).map((_, idx) => {
                                            const player = team.players[idx];
                                            return (
                                              <div className="flex w-full min-w-0" key={idx}>
                                                {player ? <PlayerCell player={player} /> : <span className="text-white/20 text-xs italic font-montserrat">Empty</span>}
                                              </div>
                                            );
                                          })}
                                          <div className="flex justify-center">
                                            {(team.status === 'assembling' || team.players.length < 5 || team.players.slice(0, 5).some(p => !p.accepted)) ? (
                                              <span className="rounded-md px-2 py-1 text-xs md:text-sm min-w-[128px] text-center bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-montserrat font-semibold">
                                                Assembling
                                              </span>
                                            ) : (
                                              <span className={`rounded-md px-2 py-1 text-xs md:text-sm min-w-[128px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                                {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        {/* Mobile Row */}
                                        <div className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                          <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                          <div className="flex justify-start">
                                            {(team.status === 'assembling' || team.players.length < 5 || team.players.slice(0, 5).some(p => !p.accepted)) ? (
                                              <span className="rounded-md px-2 py-1 text-xs min-w-[112px] text-center bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-montserrat font-semibold">
                                                Assembling
                                              </span>
                                            ) : (
                                              <span className={`rounded-md px-2 py-1 text-xs min-w-[112px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                                {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex justify-end">
                                            <button
                                              type="button"
                                              onClick={() => setMobileViewTeam(team)}
                                              className="px-3 py-1 rounded-md border border-white/30 text-white/90 text-xs bg-white/10 hover:bg-white/20"
                                            >
                                              View
                                            </button>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ))
                                  ) : (
                                    <div className="px-4 py-6 text-center text-white/60 font-montserrat">No teams registered yet.</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-white/60 text-center py-8 font-montserrat italic">No ongoing tournaments.</div>
                    )}
                  </div>
                  {/* Pagination for Ongoing */}
                  <Pagination
                    currentPage={ongoingPage}
                    totalItems={activeTournaments.length}
                    onPageChange={setOngoingPage}
                  />
                </div>



                {/* Empty/pending indicator */}
                {!hasPending && (
                  <div className="mt-6 text-sm text-white/70 font-montserrat">No pending requests.</div>
                )}
              </>
            )}

            {/* COMPLETED VIEW */}
            {activeTab === 'completed' && (
              <>
                {/* Tournament Results Viewer (Completed Tournaments) */}
                {completedTournaments.length > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-6">
                      <div className="text-white font-montserrat font-extrabold text-[22px] md:text-[28px] leading-tight">
                        Tournament Results
                      </div>
                    </div>

                    {/* Dropdown Selector */}
                    <div className="relative w-full max-w-7xl mx-auto mb-6">
                      <div className="bg-neutral-800/80 rounded-2xl border border-neutral-700/50 p-4">
                        <label className="block text-white/80 font-montserrat text-sm mb-2">Select Tournament:</label>
                        <select
                          value={selectedTournamentId || ''}
                          onChange={(e) => handleTournamentChange(parseInt(e.target.value))}
                          className="w-full bg-neutral-700/50 border border-white/20 rounded-lg px-4 py-2 text-white font-montserrat focus:outline-none focus:border-[#F2C21A] focus:ring-1 focus:ring-[#F2C21A]"
                        >
                          {completedTournaments.map((tournament) => (
                            <option key={tournament.id} value={tournament.id}>
                              {(tournament.schoolName || '').toUpperCase()} TOURNAMENT ({tournament.tournament_type || 'Online'}) - {formatDate(tournament.startDate)} to {formatDate(tournament.endDate)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Single Result Viewer & Editor */}
                    {selectedTournamentId && (() => {
                      const item = completedTournaments.find(t => t.id === selectedTournamentId);
                      if (!item) return null;

                      return (
                        <div
                          key={item.id}
                          className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50"
                        >
                          {/* Header */}
                          <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                            <div className="flex-1 text-center">
                              <div className="font-montserrat text-lg md:text-2xl tracking-wide uppercase">{item.schoolName ? `${item.schoolName.toUpperCase()} TOURNAMENT` : 'TOURNAMENT'}</div>
                              <div className="font-montserrat text-xs md:text-sm text-white/70">
                                {formatDate(item.startDate)} - {formatDate(item.endDate)}
                              </div>
                            </div>
                          </div>

                          <div className="px-0 pb-0">
                            <div className="mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                              {/* Headers */}
                              <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                                <div className="self-center">Team name</div>
                                <div className="text-center">Player 1</div>
                                <div className="text-center">Player 2</div>
                                <div className="text-center">Player 3</div>
                                <div className="text-center">Player 4</div>
                                <div className="text-center">Player 5</div>
                                <div className="grid place-items-center">Status</div>
                              </div>
                              <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat">
                                <div className="self-center">Team name</div>
                                <div className="justify-self-start text-left">Status</div>
                                <div className="text-right"></div>
                              </div>

                              {/* Rows */}
                              {Array.isArray(item.teams) && item.teams.length > 0 ? (
                                item.teams.map((team) => (
                                  <React.Fragment key={team.id}>
                                    {/* Desktop Row */}
                                    <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                      <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                                      {Array.from({ length: 5 }).map((_, idx) => {
                                        const player = team.players[idx];
                                        return (
                                          <div className="flex justify-center w-full min-w-0" key={idx}>
                                            {player ? <PlayerCell player={player} /> : <span className="text-white/20 text-xs italic font-montserrat">Empty</span>}
                                          </div>
                                        );
                                      })}
                                      <div className="flex justify-center">
                                        {isEditingResults ? (
                                          <select
                                            value={team.result || 'participant'}
                                            onChange={(e) => handleSetResult(item.id, team.id, e.target.value)}
                                            className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[128px]`}
                                          >
                                            <option className="text-black" value="participant">Participant</option>
                                            <option className="text-black" value="1st">1st</option>
                                            <option className="text-black" value="2nd">2nd</option>
                                            <option className="text-black" value="3rd">3rd</option>
                                          </select>
                                        ) : (
                                          <span className={`rounded-md px-2 py-1 text-xs md:text-sm min-w-[128px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                            {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {/* Mobile Row */}
                                    <div className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition">
                                      <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                      <div className="flex justify-start">
                                        {isEditingResults ? (
                                          <select
                                            value={team.result || 'participant'}
                                            onChange={(e) => handleSetResult(item.id, team.id, e.target.value)}
                                            className={`rounded-md px-2 py-1 ${getStatusClasses(team.result || 'participant')} focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[112px]`}
                                          >
                                            <option className="text-black" value="participant">Participant</option>
                                            <option className="text-black" value="1st">1st</option>
                                            <option className="text-black" value="2nd">2nd</option>
                                            <option className="text-black" value="3rd">3rd</option>
                                          </select>
                                        ) : (
                                          <span className={`rounded-md px-2 py-1 text-xs min-w-[112px] text-center ${getStatusClasses(team.result || 'participant')}`}>
                                            {(team.result || 'participant').charAt(0).toUpperCase() + (team.result || 'participant').slice(1)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex justify-end">
                                        <button
                                          type="button"
                                          onClick={() => setMobileViewTeam(team)}
                                          className="px-3 py-1 rounded-md border border-white/30 text-white/90 text-xs bg-white/10 hover:bg-white/20"
                                        >
                                          View
                                        </button>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-white/60 font-montserrat">No results available.</div>
                              )}

                              {/* Footer */}
                              {item.results_submitted && (
                                <div className="px-4 md:px-10 py-2 md:py-3 border-t border-white/10 flex justify-center sticky bottom-0 bg-neutral-900/70">
                                  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                                    <div className="bg-green-500/20 text-green-400 font-montserrat text-sm px-4 py-2 rounded-lg border border-green-400/30">
                                      ✓ Results Submitted
                                    </div>
                                    {item.results_submitted_at && (
                                      <div className="text-white/60 font-montserrat text-xs">
                                        Submitted on {new Date(item.results_submitted_at).toLocaleDateString()}
                                      </div>
                                    )}
                                    <a
                                      href={`/campus-tournaments/${item.id}/export`}
                                      className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:bg-[#d4a817] transition-colors flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Export to Excel
                                    </a>
                                    {isEditingResults ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleSubmitResults(item.id)}
                                          disabled={isSubmitting}
                                          className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:bg-[#d4a817] transition-colors"
                                        >
                                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setIsEditingResults(false)}
                                          disabled={isSubmitting}
                                          className="bg-gray-600 text-white font-montserrat font-semibold rounded-lg px-5 py-2 hover:bg-gray-700 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setIsEditingResults(true)}
                                        className="bg-blue-600 text-white font-montserrat font-semibold rounded-lg px-5 py-2 shadow-md hover:bg-blue-700 transition-colors"
                                      >
                                        Edit Results
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="mt-16 text-center text-white/60 font-montserrat">
                    No completed tournaments.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pre-Reg Export Modal */}
      {showPreRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowPreRegModal(false)} />
          <div className="relative z-10 w-[92%] max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-sm p-6 text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-montserrat font-bold text-lg">Generate Pre Reg</div>
                <div className="font-montserrat text-xs text-white/60 mt-0.5">Downloads the latest tournament for the selected island &amp; date range</div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreRegModal(false)}
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 font-montserrat text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Island */}
            <div className="mb-4">
              <label className="block font-montserrat text-sm text-white/80 mb-1.5">Island</label>
              <select
                value={preRegIsland}
                onChange={(e) => setPreRegIsland(e.target.value)}
                className="w-full bg-neutral-700/60 border border-white/20 rounded-lg px-4 py-2.5 text-white font-montserrat text-sm focus:outline-none focus:border-[#F2C21A] focus:ring-1 focus:ring-[#F2C21A]"
              >
                <option value="All">All (Luzon, Visayas, Mindanao)</option>
                <option value="Luzon">Luzon</option>
                <option value="Visayas">Visayas</option>
                <option value="Mindanao">Mindanao</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="block font-montserrat text-sm text-white/80 mb-1.5">Start Date</label>
              <input
                type="date"
                value={preRegStart}
                onChange={(e) => setPreRegStart(e.target.value)}
                className="w-full bg-neutral-700/60 border border-white/20 rounded-lg px-4 py-2.5 text-white font-montserrat text-sm focus:outline-none focus:border-[#F2C21A] focus:ring-1 focus:ring-[#F2C21A] [color-scheme:dark]"
              />
            </div>

            {/* End Date */}
            <div className="mb-5">
              <label className="block font-montserrat text-sm text-white/80 mb-1.5">End Date</label>
              <input
                type="date"
                value={preRegEnd}
                onChange={(e) => setPreRegEnd(e.target.value)}
                className="w-full bg-neutral-700/60 border border-white/20 rounded-lg px-4 py-2.5 text-white font-montserrat text-sm focus:outline-none focus:border-[#F2C21A] focus:ring-1 focus:ring-[#F2C21A] [color-scheme:dark]"
              />
            </div>

            {/* Error */}
            {preRegError && (
              <div className="mb-4 bg-red-500/20 border border-red-400/30 text-red-300 font-montserrat text-xs rounded-lg px-3 py-2">
                {preRegError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPreRegModal(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-montserrat font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
              <a
                href={preRegStart && preRegEnd
                  ? `/campus-tournaments/export-prereg?island=${encodeURIComponent(preRegIsland)}&start_date=${preRegStart}&end_date=${preRegEnd}`
                  : '#'}
                onClick={(e) => {
                  if (!preRegStart || !preRegEnd) {
                    e.preventDefault();
                    setPreRegError('Please fill in both start and end dates.');
                    return;
                  }
                  if (preRegEnd < preRegStart) {
                    e.preventDefault();
                    setPreRegError('End date must be on or after start date.');
                    return;
                  }
                  setShowPreRegModal(false);
                }}
                className="flex-1 bg-[#F2C21A] hover:bg-[#d4a817] text-black font-montserrat font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors text-center shadow-[0_0_8px_-3px_rgba(242,194,26,0.8)]"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (Requests) */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewing(null)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-montserrat font-semibold text-lg">Request details</div>
                <div className="mt-0.5 text-white/70 font-montserrat text-sm">{viewing.school_name || viewing.schoolName}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 font-montserrat text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-2 font-montserrat text-sm">
              <div className="flex items-center justify-between">
                <div className="text-white/70">SL name</div>
                <div className="text-white/90">{viewing.sl_name || viewing.slName}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/70">Start date</div>
                <div className="text-white/90">{formatDate(viewing.start_date || viewing.startDate)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/70">End date</div>
                <div className="text-white/90">{formatDate(viewing.end_date || viewing.endDate)}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-4 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (Ongoing Teams) */}
      {viewingTeamsTournament && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewingTeamsTournament(null)} />

          <div className="relative z-10 w-full max-w-[1400px] rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 p-5 md:p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="font-montserrat font-semibold text-lg md:text-xl">
                  {(viewingTeamsTournament.schoolName || viewingTeamsTournament.school_name || '').toUpperCase() || 'TOURNAMENT'}
                </div>
                <div className="mt-0.5 text-white/70 font-montserrat text-sm">
                  {formatDate(viewingTeamsTournament.startDate || viewingTeamsTournament.start_date)} - {formatDate(viewingTeamsTournament.endDate || viewingTeamsTournament.end_date)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingTeamsTournament(null)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 font-montserrat text-sm"
              >
                Close
              </button>
            </div>

            {(() => {
              const all = Array.isArray(viewingTeamsTournament?.teams) ? viewingTeamsTournament.teams : [];
              const teamsOnly = all.filter(t => (t?.type || 'team') !== 'solo');
              const soloOnly = all.filter(t => (t?.type || 'team') === 'solo');

              const tabBtn = (id, label, count) => (
                <button
                  type="button"
                  onClick={() => setViewingTeamsTab(id)}
                  className={`px-3 py-1.5 rounded-md border font-montserrat text-xs md:text-sm transition ${viewingTeamsTab === id
                      ? 'border-white/30 bg-white/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {label} <span className="text-white/60">({count})</span>
                </button>
              );

              return (
                <>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {tabBtn('all', 'All', all.length)}
                    {tabBtn('teams', 'Teams', teamsOnly.length)}
                    {tabBtn('solo', 'Solo', soloOnly.length)}
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scrollbar pr-2">
                    {(() => {
                      const activeList =
                        viewingTeamsTab === 'teams'
                          ? teamsOnly
                          : viewingTeamsTab === 'solo'
                            ? soloOnly
                            : all.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                      return (
                        <>
                          {/* Table Header - Desktop */}
                          <div className="hidden md:grid [grid-template-columns:minmax(180px,1.3fr)_repeat(5,minmax(140px,1.2fr))_minmax(170px,1.2fr)] gap-2 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat bg-neutral-900/30 min-w-[1200px] justify-items-start">
                            <div className="self-center w-full">{viewingTeamsTab === 'solo' ? 'Solo pool' : 'Team name'}</div>
                            <div className="w-full">{viewingTeamsTab === 'solo' ? 'Jungler' : 'Captain'}</div>
                            <div className="w-full">{viewingTeamsTab === 'solo' ? 'Roam' : 'Player 2'}</div>
                            <div className="w-full">{viewingTeamsTab === 'solo' ? 'Gold Laner' : 'Player 3'}</div>
                            <div className="w-full">{viewingTeamsTab === 'solo' ? 'Exp Laner' : 'Player 4'}</div>
                            <div className="w-full">{viewingTeamsTab === 'solo' ? 'Mid Laner' : 'Player 5'}</div>
                            <div className="grid place-items-center w-full">Status</div>
                          </div>

                          {/* Table Header - Mobile */}
                          <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat bg-neutral-900/30">
                            <div className="self-center">{viewingTeamsTab === 'solo' ? 'Solo pool' : 'Team name'}</div>
                            <div className="justify-self-start text-left">Status</div>
                            <div className="text-right"></div>
                          </div>

                          {activeList.length > 0 ? (
                            activeList.map((team) => {
                              const isSolo = (team?.type || 'team') === 'solo';
                              const { label, pillClassName } = getTeamConfirmation(team);
                              
                              // Combine and sort players such that captain is at index 0
                              let players = Array.isArray(team?.players) ? [...team.players] : [];
                              if (team.captain_id) {
                                players.sort((a, b) => {
                                  if (a.id === team.captain_id) return -1;
                                  if (b.id === team.captain_id) return 1;
                                  return 0;
                                });
                              }

                              // Only use role-based mapping if we are specifically in the 'solo' tab
                              const useRoles = viewingTeamsTab === 'solo';
                              const byRole = (useRoles && isSolo) ? new Map(players.filter(p => p?.lane_role).map(p => [p.lane_role, p])) : null;

                              return (
                                <React.Fragment key={team.id}>
                                  {/* Desktop Row */}
                                  <div className="hidden md:grid [grid-template-columns:minmax(180px,1.3fr)_repeat(5,minmax(140px,1.2fr))_minmax(170px,1.2fr)] gap-2 items-center px-6 md:px-10 py-3 border-t border-white/10 bg-neutral-900/20 hover:bg-neutral-900/40 transition min-w-[1200px] justify-items-start">
                                    <div className="text-white/90 font-montserrat md:truncate whitespace-normal w-full text-left">
                                      {team.name}
                                    </div>

                                    {[0, 1, 2, 3, 4].map((idx) => {
                                      const role = SOLO_ROLES[idx];
                                      const player = useRoles ? byRole.get(role) : players[idx];

                                      return (
                                        <div className="flex justify-center w-full min-w-0" key={idx}>
                                          {player ? (
                                            <PlayerCellModal player={player} />
                                          ) : (
                                            <div className="flex items-center justify-center gap-2 opacity-30">
                                              {useRoles && <RoleIcon role={role} />}
                                              <span className="text-white/20 text-[10px] italic font-montserrat">
                                                {useRoles ? 'Vacant' : 'Empty'}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}

                                    <div className="flex justify-center w-full">
                                      <span className={`rounded-md px-2 py-1 text-xs md:text-sm min-w-[128px] text-center font-montserrat ${pillClassName}`}>
                                        {label}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Mobile Row */}
                                  <div className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 bg-neutral-900/20 hover:bg-neutral-900/40 transition">
                                    <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                                    <div className="flex justify-start">
                                      <span className={`rounded-md px-2 py-1 text-xs min-w-[112px] text-center font-montserrat ${pillClassName}`}>
                                        {label}
                                      </span>
                                    </div>
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setMobileViewTeam(team)}
                                        className="px-3 py-1 rounded-md border border-white/30 text-white/90 text-xs bg-white/10 hover:bg-white/20"
                                      >
                                        View
                                      </button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <div className="px-4 py-10 text-center text-white/60 font-montserrat">
                              No registrations found.
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Mobile Players Modal (Shared) */}
      {mobileViewTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setMobileViewTeam(null)} />
          <div className="relative z-20 w-[92%] md:max-w-lg bg-neutral-900/90 text-white border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-montserrat text-base md:text-lg font-semibold">{mobileViewTeam.name}</div>
              <button
                type="button"
                onClick={() => setMobileViewTeam(null)}
                className="w-8 h-8 grid place-items-center rounded-md border border-white/20 hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {(mobileViewTeam?.type || 'team') === 'solo'
                ? (() => {
                  const byRole = new Map(
                    (Array.isArray(mobileViewTeam?.players) ? mobileViewTeam.players : [])
                      .filter(p => p?.lane_role)
                      .map(p => [p.lane_role, p])
                  );

                  return SOLO_ROLES.map((role) => {
                    const player = byRole.get(role);
                    return (
                      <div key={role} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <RoleIcon role={role} />
                            <div className="font-montserrat text-xs text-white/60 shrink-0">{role}</div>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-montserrat text-sm leading-tight text-white/90 truncate">
                              {player?.name || 'Vacant'}
                            </div>
                            <div className="font-montserrat text-xs leading-tight text-white/60 truncate max-w-[18ch]">
                              {player?.ign || '—'}
                            </div>
                          </div>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${player?.verified ? 'bg-green-400' : 'bg-white/20'}`} />
                      </div>
                    );
                  });
                })()
                : mobileViewTeam.players.slice(0, 5).map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white/10">
                        <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        {player?.facebook_link ? (
                            <a
                              href={player.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-montserrat text-sm leading-tight text-white/90 truncate hover:text-blue-400 transition-colors"
                              title="View Facebook Profile"
                            >
                              {player.name}
                            </a>
                          ) : (
                            <div className="font-montserrat text-sm leading-tight text-white/90">
                              {player.name}
                            </div>
                          )}
                        {/* <div className="font-montserrat text-sm leading-tight text-white/90">
                        
                          {player.name}
                        </div> */}
                        <div className="font-montserrat text-xs leading-tight text-white/60 truncate max-w-[10ch]">
                          {player?.ign || '—'}
                        </div>
                      </div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${player.verified ? 'bg-green-400' : 'bg-red-500'}`} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit/Update Result Modal */}
      {
        showSubmitModal && submitModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleCloseSubmitModal} />
            <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-center">
                {submitModalData.type === 'success' ? (
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}

                <h3 className={`font-montserrat text-xl md:text-2xl font-semibold mb-3 ${submitModalData.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {submitModalData.title}
                </h3>

                <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                  {submitModalData.message}
                </p>

                <button
                  onClick={handleCloseSubmitModal}
                  className="w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[#F2C21A]/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Confirmation Modal */}
      {
        showConfirmModal && pendingAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleConfirmClose} />
            <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>

                {/* Confirmation Message */}
                <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-yellow-400">
                  Confirm Action
                </h3>

                <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                  Are you sure you want to <strong>{pendingAction.action}</strong> the tournament request from <strong>{pendingAction.tournament?.school_name}</strong>?
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmClose}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => executeApprove(pendingAction.tournament.id)}
                    disabled={isProcessing[pendingAction.tournament.id]}
                    className="flex-1 bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing[pendingAction.tournament.id] ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Success Modal */}
      {
        showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleSuccessClose} />
            <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Success Message */}
                <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-green-400">
                  Tournament Approved Successfully!
                </h3>

                <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                  The tournament request has been approved and is now available for student registration.
                </p>

                {/* Close Button */}
                <button
                  onClick={handleSuccessClose}
                  className="w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[#F2C21A]/90 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* Extension Modal */}
      {
        extendingTournament && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setExtendingTournament(null)} />
            <div className="relative z-20 w-full max-w-md bg-neutral-900 border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
              <h3 className="font-montserrat text-xl font-bold mb-1">{isBulkExtend ? 'Bulk Reschedule' : 'Extend Registration'}</h3>
              <p className="text-white/60 text-sm font-montserrat mb-6">
                Update the registration end date for <span className="text-white font-semibold">{isBulkExtend ? 'All Ongoing Tournaments' : extendingTournament.schoolName}</span>.
                <br />
                <span className="text-yellow-500 text-xs mt-1 block">Note: This will overwrite the current end date{isBulkExtend ? ` for ${activeTournaments.length} tournament(s)` : ''}.</span>
              </p>

              <div className="mb-6">
                <label className="block text-white/70 text-sm font-montserrat mb-2">New Deadline</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-montserrat focus:outline-none focus:border-[#F2C21A] transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setExtendingTournament(null)}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white font-montserrat text-sm transition-colors"
                  disabled={isExtending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendSubmit}
                  disabled={isExtending || !newEndDate}
                  className="px-4 py-2 rounded-lg bg-[#F2C21A] text-black font-bold font-montserrat text-sm hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExtending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </MainLayout >
  );
};

export default RegionalAdmin;


