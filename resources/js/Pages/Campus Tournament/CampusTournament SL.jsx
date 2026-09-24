import React, { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout.jsx";
import TournamentCard from '@/Components/CampusTournament/TournamentCard.jsx';

// Temporary mock data generator until backend is wired
const generateMockTeams = () => [
  {
    id: 1,
    name: 'Team Alpha',
    players: [
      { name: 'Player 1', verified: true },
      { name: 'Player 2', verified: true },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: true },
    ],
  },
  {
    id: 2,
    name: 'Team Bravo',
    players: [
      { name: 'Player 1', verified: true },
      { name: 'Player 2', verified: false },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: false },
    ],
  },
  {
    id: 3,
    name: 'Team Charlie',
    players: [
      { name: 'Player 1', verified: false },
      { name: 'Player 2', verified: false },
      { name: 'Player 3', verified: true },
      { name: 'Player 4', verified: true },
      { name: 'Player 5', verified: true },
    ],
  },
];

const CampusTournament = () => {
  const { tournaments, user } = usePage().props;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tournamentType, setTournamentType] = useState('Online');
  const [localTournaments, setLocalTournaments] = useState(tournaments || []);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null); // Currently selected tournament
  const [mobileViewTeam, setMobileViewTeam] = useState(null); // mobile-only player popup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null);
  const [isEditingResults, setIsEditingResults] = useState(false); // New state for edit mode
  const [filterStatus, setFilterStatus] = useState('ongoing'); // 'ongoing' or 'completed'
  const [showOnline, setShowOnline] = useState(true);
  const [showOnsite, setShowOnsite] = useState(true);
  const [searchSchool, setSearchSchool] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Pagination State
  const [pendingPage, setPendingPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [tournamentPage, setTournamentPage] = useState(1);
  const itemsPerPage = 5;

  // Expansion state for cards
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Transform real tournament data to match the expected format
  const transformedTournaments = useMemo(() => {
    if (!localTournaments || localTournaments.length === 0) return [];

    return localTournaments.map(tournament => ({
      ...tournament,
      teams: tournament.teams ? tournament.teams
        .filter(team => ['registered', 'assembling'].includes(team.status))
        .map(team => ({
          id: team.id,
          name: team.team_name,
          type: team.type || 'team',
          status: team.status,
          result: team.result || 'participant', // Include result field
          players: team.members ? team.members.map(member => ({
            id: member.player_id,
            name: member.player ? `${member.player.name || ''} ${member.player.surname || ''}`.trim() : 'Unknown Player',
            ign: member.player ? member.player.ml_ign : '',
            verified: member.player ? !!member.player.email_verified_at : false,
            accepted: member.status === 'accepted',
            role: member.role,
            lane_role: member.lane_role ?? null,
            facebook_link: member.player ? member.player.facebook_link : null
          })) : []
        })) : []
    }));
  }, [localTournaments]);

  // Filter approved tournaments based on selected tab
  const filteredActiveTournaments = useMemo(() => {
    return transformedTournaments.filter(t => {
      if (t.status !== 'approved') return false;

      // Status filter
      const matchesStatus = filterStatus === 'ongoing' ? !t.results_submitted : t.results_submitted;
      if (!matchesStatus) return false;

      // Type filter
      const type = (t.tournament_type || 'Online').toLowerCase();
      if (type === 'online' && !showOnline) return false;
      if (type === 'onsite' && !showOnsite) return false;

      // School search filter
      if (searchSchool && !t.school_name?.toLowerCase().includes(searchSchool.toLowerCase())) return false;

      // Date filter (month and year of start_date)
      if ((filterMonth || filterYear) && t.start_date) {
        const tDate = new Date(t.start_date);
        if (!isNaN(tDate.getTime())) {
          if (filterMonth && String(tDate.getMonth() + 1).padStart(2, '0') !== filterMonth) return false;
          if (filterYear && String(tDate.getFullYear()) !== filterYear) return false;
        }
      }

      return true;
    });
  }, [transformedTournaments, filterStatus, showOnline, showOnsite, searchSchool, filterMonth, filterYear]);

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

      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'Value:', value);
      return 'Invalid Date';
    }
  };

  const handleOpen = () => setIsCreateOpen(true);
  const handleClose = () => {
    setIsCreateOpen(false);
    setStartDate('');
    setEndDate('');
    setTournamentType('Online');
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // If end date is before or equal to start date, clear it
    if (endDate && new Date(date) >= new Date(endDate)) {
      setEndDate('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startDate || !endDate) return;

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if start date is today or earlier
    if (start <= today) {
      alert('Start date must be tomorrow or later.');
      return;
    }

    // Check if end date is today or earlier
    if (end <= today) {
      alert('End date must be tomorrow or later.');
      return;
    }

    // Check if start date is earlier than end date
    if (start >= end) {
      alert('Start date must be earlier than end date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/campus-tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          tournament_type: tournamentType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new tournament to local state
        setLocalTournaments((existing) => [
          ...existing,
          {
            id: data.tournament.id,
            start_date: data.tournament.start_date,
            end_date: data.tournament.end_date,
            tournament_type: data.tournament.tournament_type,
            status: data.tournament.status,
            school_name: data.tournament.school_name,
            sl_name: data.tournament.sl_name,
            // teams: [], // No teams yet for new tournaments
          },
        ]);
        handleClose();
        setIsSuccessOpen(true);
      } else {
        alert('Error creating tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error creating tournament. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (tournament) => {
    setDeleteTarget(tournament);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/campus-tournaments/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      const data = await response.json();

      if (data.success) {
        setLocalTournaments((existing) => existing.filter((t) => t.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        setShowDeleteModal(false);
        alert('Error deleting tournament: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setShowDeleteModal(false);
      alert('Error deleting tournament. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Set the first active approved tournament as selected by default or when filter changes
  React.useEffect(() => {
    if (filteredActiveTournaments.length > 0) {
      // If currently selected tournament is not in the filtered list, select the first one
      const isSelectedInList = filteredActiveTournaments.some(t => t.id === selectedTournamentId);
      if (!selectedTournamentId || !isSelectedInList) {
        setSelectedTournamentId(filteredActiveTournaments[0].id);
      }
    } else {
      setSelectedTournamentId(null);
    }
  }, [filteredActiveTournaments, selectedTournamentId]);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setIsEditingResults(false); // Reset edit mode when changing tournament
  };

  React.useEffect(() => {
    setPendingPage(1);
    setRejectedPage(1);
    setTournamentPage(1);
  }, [showOnline, showOnsite, filterStatus, searchSchool, filterMonth, filterYear]);

  const handleSetResult = (tournamentId, teamId, result) => {
    setLocalTournaments((prev) =>
      prev.map((tournament) => {
        if (tournament.id !== tournamentId) return tournament;
        return {
          ...tournament,
          teams: (tournament.teams || []).map((team) =>
            team.id === teamId ? { ...team, result } : team
          ),
        };
      })
    );
  };


  const getStatusClasses = (value) => {
    const v = value || 'participant';
    if (v === '1st') return 'bg-yellow-400/60 border border-yellow-300/80 text-white';
    if (v === '2nd') return 'bg-gray-400/60 border border-gray-300/80 text-white';
    if (v === '3rd') return 'bg-orange-400/60 border border-orange-300/80 text-white';
    return 'bg-green-500/30 border border-green-400/70 text-white';
  };

  const getBracketCounts = (registeredTeamsCount, tournamentType = 'Online') => {
    let maxFirst = 1, maxSecond = 1, maxThird = 0, maxFourth = 0;
    if (registeredTeamsCount <= 7) {
      maxFirst = 1; maxSecond = 1; maxThird = 0; maxFourth = 0;
    } else if (registeredTeamsCount >= 8 && registeredTeamsCount <= 15) {
      maxFirst = 1; maxSecond = 1; maxThird = 1; maxFourth = 0;
    } else if (registeredTeamsCount >= 16 && registeredTeamsCount <= 23) {
      maxFirst = 1; maxSecond = 1; maxThird = 1; maxFourth = 1;
    } else if (registeredTeamsCount >= 24 && registeredTeamsCount <= 31) {
      maxFirst = 2; maxSecond = 2; maxThird = 2; maxFourth = 1;
    } else if (registeredTeamsCount >= 32 && registeredTeamsCount <= 39) {
      maxFirst = 2; maxSecond = 2; maxThird = 2; maxFourth = 2;
    } else if (registeredTeamsCount >= 40 && registeredTeamsCount <= 47) {
      maxFirst = 3; maxSecond = 3; maxThird = 3; maxFourth = 2;
    } else if (registeredTeamsCount >= 48) {
      maxFirst = 3; maxSecond = 3; maxThird = 3; maxFourth = 3;
    }

    // Onsite tournaments always have at least 1st-4th if teams are available
    if (tournamentType === 'Onsite') {
      if (registeredTeamsCount >= 3) {
        maxThird = Math.max(maxThird, 1);
      }
      if (registeredTeamsCount >= 4) {
        maxFourth = Math.max(maxFourth, 1);
      }
    }

    return { maxFirst, maxSecond, maxThird, maxFourth };
  };

  const handleSubmitResults = async (tournamentId) => {
    const tournament = transformedTournaments.find((t) => t.id === tournamentId);

    if (!tournament || !tournament.teams || tournament.teams.length === 0) {
      setSubmitModalData({
        type: 'error',
        title: 'No Teams Found',
        message: 'No teams found for this tournament.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    const registeredTeams = tournament.teams.filter(t => t.status === 'registered');
    const registeredCount = registeredTeams.length;
    const { maxFirst, maxSecond, maxThird, maxFourth } = getBracketCounts(registeredCount, tournament.tournament_type);
    const show3rd = maxThird > 0;
    const show4th = maxFourth > 0;

    // Check 1st place
    const firstPlaceTeams = registeredTeams.filter(team => team.result === '1st');
    if (firstPlaceTeams.length !== maxFirst) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 1st Place Selection',
        message: `Based on ${registeredCount} registered teams, you must select exactly ${maxFirst} 1st place team(s).`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check 2nd place
    const secondPlaceTeams = registeredTeams.filter(team => team.result === '2nd');
    if (secondPlaceTeams.length !== maxSecond) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 2nd Place Selection',
        message: `Based on ${registeredCount} registered teams, you must select exactly ${maxSecond} 2nd place team(s).`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check 3rd place
    const thirdPlaceTeams = registeredTeams.filter(team => team.result === '3rd');
    if (show3rd && thirdPlaceTeams.length !== maxThird) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 3rd Place Selection',
        message: `Based on ${registeredCount} registered teams, you must select exactly ${maxThird} 3rd place team(s).`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    } else if (!show3rd && thirdPlaceTeams.length > 0) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 3rd Place Selection',
        message: `3rd place is not available for ${registeredCount} registered teams.`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check 4th place
    const fourthPlaceTeams = registeredTeams.filter(team => team.result === '4th');
    if (show4th && fourthPlaceTeams.length !== maxFourth) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 4th Place Selection',
        message: `Based on ${registeredCount} registered teams, you must select exactly ${maxFourth} 4th place team(s).`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    } else if (!show4th && fourthPlaceTeams.length > 0) {
      setSubmitModalData({
        type: 'error',
        title: 'Invalid 4th Place Selection',
        message: `4th place is not available for ${registeredCount} registered teams.`,
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Check if all teams have results set
    const teamsWithoutResults = registeredTeams.filter(team => !team.result || team.result === '');
    if (teamsWithoutResults.length > 0) {
      setSubmitModalData({
        type: 'error',
        title: 'Incomplete Results',
        message: 'Please set results for all teams before submitting.',
        showCancel: false
      });
      setShowSubmitModal(true);
      return;
    }

    // Show confirmation modal
    let messageStr = `Are you sure you want to ${isEditingResults ? 'update' : 'submit'} the results?\n`;
    messageStr += `\n1st Place: ${firstPlaceTeams.map(t => t.name).join(', ')}`;
    messageStr += `\n2nd Place: ${secondPlaceTeams.map(t => t.name).join(', ')}`;
    if (show3rd && thirdPlaceTeams.length > 0) messageStr += `\n3rd Place: ${thirdPlaceTeams.map(t => t.name).join(', ')}`;
    if (show4th && fourthPlaceTeams.length > 0) messageStr += `\n4th Place: ${fourthPlaceTeams.map(t => t.name).join(', ')}`;
    messageStr += `\n\n${isEditingResults ? 'This will update the existing rankings.' : 'This action cannot be undone.'}`;

    setSubmitModalData({
      type: 'confirm',
      title: isEditingResults ? 'Confirm Update Results' : 'Confirm Results Submission',
      message: messageStr,
      showCancel: true,
      tournamentId: tournamentId,
      tournament: tournament,
      registeredTeams: registeredTeams
    });
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submitModalData.tournamentId) return;

    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      // Prepare results data
      const results = submitModalData.registeredTeams.map(team => ({
        team_id: team.id,
        result: team.result || 'participant'
      }));

      // Determine endpoint based on whether we are editing or submitting new
      const endpoint = isEditingResults
        ? `/campus-tournaments/${submitModalData.tournamentId}/update-results`
        : `/campus-tournaments/${submitModalData.tournamentId}/submit-results`;

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
        setLocalTournaments((prev) =>
          prev.map((t) =>
            t.id === submitModalData.tournamentId
              ? { ...t, results_submitted: true, results_submitted_at: new Date().toISOString() }
              : t
          )
        );

        // Turn off edit mode
        setIsEditingResults(false);

        // Show success modal
        setSubmitModalData({
          type: 'success',
          title: isEditingResults ? 'Results Updated Successfully!' : 'Results Submitted Successfully!',
          message: isEditingResults ? 'Tournament results have been updated.' : 'Tournament results have been submitted and cannot be changed.',
          showCancel: false
        });
        setShowSubmitModal(true);
      } else {
        setSubmitModalData({
          type: 'error',
          title: 'Submission Failed',
          message: data.error || 'Unknown error occurred while submitting results.',
          showCancel: false
        });
        setShowSubmitModal(true);
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      setSubmitModalData({
        type: 'error',
        title: 'Submission Failed',
        message: 'Error submitting results. Please try again.',
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

  const PlayerCell = ({ player }) => {
    const verified = Boolean(player?.verified);
    const nameDisplay = player?.name || 'Player';
    return (
      <div className="w-full flex items-center gap-3 justify-start min-w-0 text-white/80 text-xs md:text-sm font-montserrat">
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0">
          {/* Image/icon clipped by the inner circle */}
          <div className="relative w-full h-full overflow-hidden rounded-full border border-white/20 bg-white/10">
            {!player?.avatarUrl && (
              <svg
                className="absolute inset-0 m-auto w-5 h-5 text-white/50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            {player?.avatarUrl && (
              <img
                src={player.avatarUrl}
                alt={nameDisplay}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Verification dot that can overflow outside the avatar */}
          <span
            className={`absolute bottom-[-3px] right-[-3px] z-20 w-4 h-4 rounded-full border border-black/60 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${player?.accepted ? 'bg-green-400' : 'bg-red-500'
              }`}
          />
        </div>

        <div className="flex flex-col min-w-0 items-start">
          {player?.facebook_link ? (
            <a
              href={player.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate max-w-[9ch] md:max-w-[10ch] text-white/90 text-sm leading-tight hover:text-blue-400 transition-colors"
              title="View Facebook Profile"
            >
              {nameDisplay}
            </a>
          ) : (
            <span className="block truncate max-w-[9ch] md:max-w-[10ch] text-white/90 text-sm leading-tight">
              {nameDisplay}
            </span>
          )}
          <span className="block truncate max-w-[9ch] md:max-w-[10ch] text-white/60 text-xs leading-tight">
            {player?.ign || '—'}
          </span>
        </div>
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
            <p className="mt-2 text-white/90 font-montserrat text-[12px] sm:text-[14px] md:text-base max-w-3xl">
              Campus Tournament is a local campus event where student players compete every two weeks for diamond rewards.
            </p>

            <div className="mt-6 md:mt-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-xl md:rounded-2xl px-6 md:px-8 py-2.5 md:py-3 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
                >
                  CREATE +
                </button>
              </div>

              {/* Pending Requests Section */}
              <div className="w-full max-w-7xl mx-auto bg-neutral-800/80 rounded-2xl border border-neutral-700/50 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-montserrat font-semibold text-lg md:text-xl">Pending Requests</h2>
                  <span className="text-white/70 text-sm">{localTournaments.filter(t => t.status === 'pending').length} pending</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {localTournaments.filter(t => t.status === 'pending').length > 0 ? (
                    localTournaments
                      .filter(t => t.status === 'pending')
                      .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
                      .slice((pendingPage - 1) * itemsPerPage, pendingPage * itemsPerPage)
                      .map((t) => (
                        <div key={t.id} className="flex items-center justify-between bg-neutral-900/40 border border-white/10 rounded-xl px-4 py-3">
                          <div className="flex flex-col">
                            <div className="text-white font-montserrat text-sm md:text-base">{(t.school_name || '').toUpperCase()} TOURNAMENT</div>
                            <div className="text-white/60 text-xs md:text-sm">{formatDate(t.start_date)} - {formatDate(t.end_date)} • {t.tournament_type || 'Online'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md text-xs font-montserrat bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">Pending</span>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(t)}
                              className="bg-red-600 hover:bg-red-700 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-white/60 text-sm">No pending tournament requests.</div>
                  )}
                </div>
                <Pagination
                  currentPage={pendingPage}
                  totalItems={localTournaments.filter(t => t.status === 'pending').length}
                  onPageChange={setPendingPage}
                />
              </div>

              {/* Rejected Requests Section */}
              <div className="w-full max-w-7xl mx-auto bg-neutral-800/80 rounded-2xl border border-red-900/30 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-montserrat font-semibold text-lg md:text-xl">Rejected Requests</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30">Not Entertained</span>
                  </div>
                  <span className="text-white/70 text-sm">{localTournaments.filter(t => t.status === 'rejected').length} rejected</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {localTournaments.filter(t => t.status === 'rejected').length > 0 ? (
                    localTournaments
                      .filter(t => t.status === 'rejected')
                      .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
                      .slice((rejectedPage - 1) * itemsPerPage, rejectedPage * itemsPerPage)
                      .map((t) => (
                        <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-900/40 border border-red-500/20 rounded-xl px-4 py-3 gap-3">
                          <div className="flex flex-col">
                            <div className="text-white font-montserrat text-sm md:text-base">{(t.school_name || '').toUpperCase()} TOURNAMENT</div>
                            <div className="text-white/60 text-xs md:text-sm">{formatDate(t.start_date)} - {formatDate(t.end_date)} • {t.tournament_type || 'Online'}</div>
                            {t.rejection_reason && (
                              <div className="text-red-300/80 text-xs mt-1 italic">Reason: {t.rejection_reason}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <span className="px-2 py-1 rounded-md text-xs font-montserrat bg-red-500/20 text-red-300 border border-red-400/30">Rejected</span>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(t)}
                              className="bg-red-600 hover:bg-red-700 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-white/60 text-sm">No rejected tournament requests.</div>
                  )}
                </div>
                <Pagination
                  currentPage={rejectedPage}
                  totalItems={localTournaments.filter(t => t.status === 'rejected').length}
                  onPageChange={setRejectedPage}
                />
              </div>

              <div className="flex flex-col gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFilterStatus('ongoing')}
                      className={`font-montserrat font-semibold text-sm md:text-base px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === 'ongoing'
                        ? 'bg-[#F2C21A] text-black shadow-[0_0_8px_-3px_rgba(242,194,26,1)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Ongoing ({transformedTournaments.filter(t => t.status === 'approved' && !t.results_submitted).length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('completed')}
                      className={`font-montserrat font-semibold text-sm md:text-base px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === 'completed'
                        ? 'bg-[#F2C21A] text-black shadow-[0_0_8px_-3px_rgba(242,194,26,1)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Completed ({transformedTournaments.filter(t => t.status === 'approved' && t.results_submitted).length})
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-2">
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
                </div>

                {/* Tournament List - Paginated Cards */}
                <div className="flex flex-col gap-6">
                  {filteredActiveTournaments.length > 0 ? (
                    filteredActiveTournaments
                      .slice((tournamentPage - 1) * itemsPerPage, tournamentPage * itemsPerPage)
                      .map((item) => (
                        <TournamentCard
                          key={item.id}
                          tournament={item}
                          isExpanded={!!expanded[item.id]}
                          onToggleExpand={toggleExpand}
                          formatDate={formatDate}
                          openDeleteModal={openDeleteModal}
                          PlayerCell={PlayerCell}
                          setMobileViewTeam={setMobileViewTeam}
                          getBracketCounts={getBracketCounts}
                          getStatusClasses={getStatusClasses}
                          handleSetResult={handleSetResult}
                          handleSubmitResults={handleSubmitResults}
                          isEditingResults={isEditingResults}
                          setIsEditingResults={setIsEditingResults}
                          onLockRegistration={() => {}}
                        />
                      ))
                  ) : (
                    <div className="text-white/60 text-center py-8 font-montserrat italic">
                      {filterStatus === 'ongoing' ? 'No ongoing tournaments.' : 'No completed tournaments.'}
                    </div>
                  )}

                  <Pagination
                    currentPage={tournamentPage}
                    totalItems={filteredActiveTournaments.length}
                    onPageChange={setTournamentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={handleClose} />
          <div className="relative z-20 w-full max-w-3xl bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-10 shadow-2xl">
            <div className="font-montserrat text-2xl md:text-3xl font-semibold mb-6">Create Tournament</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-lg md:text-xl">Start date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) { } } }}
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  className="bg-transparent border border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-lg md:text-xl">End date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onFocus={(e) => { if (e.target.showPicker) { try { e.target.showPicker(); } catch (_) { } } }}
                  min={(() => {
                    // If start date is selected, use start date + 1 day as minimum
                    if (startDate) {
                      const startDateObj = new Date(startDate);
                      startDateObj.setDate(startDateObj.getDate() + 1);
                      return startDateObj.toISOString().split('T')[0];
                    }
                    // Otherwise, use tomorrow as minimum
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  className="bg-transparent border border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F2C21A]"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-lg md:text-xl">Tournament Type</span>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTournamentType('Online')}
                    className={`flex-1 px-4 py-3 rounded-xl border font-montserrat transition-all ${tournamentType === 'Online'
                      ? 'bg-[#F2C21A] text-black border-[#F2C21A]'
                      : 'bg-transparent text-white border-white/50 hover:border-[#F2C21A]/50'
                      }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setTournamentType('Onsite')}
                    className={`flex-1 px-4 py-3 rounded-xl border font-montserrat transition-all ${tournamentType === 'Onsite'
                      ? 'bg-[#F2C21A] text-black border-[#F2C21A]'
                      : 'bg-transparent text-white border-white/50 hover:border-[#F2C21A]/50'
                      }`}
                  >
                    Onsite
                  </button>
                </div>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-xl px-8 py-3 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mobile Players Modal */}
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
              {mobileViewTeam.players.slice(0, 5).map((player, idx) => (
                <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full">
                      {/* Image/icon clipped by the inner circle */}
                      <div className="relative w-full h-full overflow-hidden rounded-full border border-white/20 bg-white/10">
                        {/* Default icon */}
                        <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>

                      {/* Verification dot that can overflow outside the avatar */}
                      <span
                        className={`absolute bottom-[-3px] right-[-3px] z-20 w-4 h-4 rounded-full border border-black/60 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${player?.verified ? 'bg-green-400' : 'bg-red-500'
                          }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-montserrat text-sm text-white/90 leading-tight truncate">
                        {player.name}
                      </div>
                      <div className="font-montserrat text-xs text-white/60 leading-tight truncate max-w-[12ch]">
                        {player?.ign || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* Success Modal */}
      {isSuccessOpen && (
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
                Tournament Created Successfully!
              </h3>

              <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                Your tournament request has been created successfully. Please wait for Regional Admin approval.
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
      )}

      {/* Submit Results Modal */}
      {showSubmitModal && submitModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" onClick={handleCloseSubmitModal} />
          <div className="relative z-20 w-full max-w-md bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Icon based on modal type */}
                {submitModalData.type === 'error' && (
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                )}
                {submitModalData.type === 'success' && (
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {submitModalData.type === 'confirm' && (
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <h3 className="font-montserrat text-lg md:text-xl font-semibold">
                  {submitModalData.title}
                </h3>
              </div>
              <button
                onClick={handleCloseSubmitModal}
                className="w-8 h-8 grid place-items-center rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="font-montserrat text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-line">
                {submitModalData.message}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end">
              {submitModalData.showCancel && (
                <button
                  onClick={handleCloseSubmitModal}
                  className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-white font-montserrat text-sm font-medium rounded-lg border border-white/20 transition-colors"
                >
                  Cancel
                </button>
              )}
              {submitModalData.type === 'confirm' ? (
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#F2C21A] hover:bg-[#F2C21A]/90 text-black font-montserrat text-sm font-semibold rounded-lg shadow-[0_0_8px_-3px_rgba(242,194,26,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                </button>
              ) : (
                <button
                  onClick={handleCloseSubmitModal}
                  className={`px-6 py-2 font-montserrat text-sm font-semibold rounded-lg transition-colors ${submitModalData.type === 'error'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" onClick={closeDeleteModal} />
          <div className="relative z-20 w-full max-w-md bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-montserrat text-lg md:text-xl font-semibold">Delete Tournament</h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="w-8 h-8 grid place-items-center rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="font-montserrat text-sm md:text-base text-white/80 leading-relaxed">
                Are you sure you want to permanently delete
                {" "}
                <span className="text-white font-semibold">{(deleteTarget.school_name || '').toUpperCase()} Tournament</span>
                ? This action cannot be undone.
              </p>
              <div className="mt-2 text-white/60 text-sm">
                {formatDate(deleteTarget.start_date)} - {formatDate(deleteTarget.end_date)}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-white font-montserrat text-sm font-medium rounded-lg border border-white/20 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-montserrat text-sm font-semibold rounded-lg border border-red-400/20 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CampusTournament;
