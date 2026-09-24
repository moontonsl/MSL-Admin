import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout.jsx";

// Temporary: replace with real fetch from backend when available
const generateMockTeamForUser = (user) => {
  const captainId = (user && user.id) ? user.id : 1;
  return {
    id: 101,
    name: 'My Campus Team',
    captainId,
    players: [
      { id: captainId, name: `${(user && user.name) || 'You'} ${((user && user.surname) || '')}`.trim() || 'You', verified: true },
      { id: 2, name: 'Teammate 2', verified: true },
      { id: 3, name: 'Teammate 3', verified: true },
      { id: 4, name: 'Teammate 4', verified: false },
      { id: 5, name: 'Teammate 5', verified: true },
    ],
  };
};

const CampusTournamentTeam = () => {
  const { user, team: teamFromProps, isCaptain: isCaptainFromProps, message, flash } = usePage().props || {};


  // If there's a message (error), show it
  if (message) {
    return (
      <MainLayout>
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
        >
          <div className="w-full min-h-screen bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Campus Tournament</h1>
              <p className="text-lg">{message}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If no team data, show loading or error
  if (!teamFromProps) {
    return (
      <MainLayout>
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
        >
          <div className="w-full min-h-screen bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Campus Tournament</h1>
              <p className="text-lg">Loading team data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const formatPlayer = (player) => {
    if (!player) return 'Player';
    return `${player.name || ''} ${player.surname || ''}`.trim() || player.username || 'Player';
  };

  const PlayerCell = ({ member, isCurrentUserMember }) => {
    const player = member?.player;
    const status = member?.status || 'accepted'; // Default for existing data

    let statusColor = 'bg-green-400';
    let statusText = 'Accepted';

    if (status === 'pending') {
      statusColor = 'bg-yellow-400';
      statusText = 'Pending';
    } else if (status === 'rejected') {
      statusColor = 'bg-red-500';
      statusText = 'Rejected';
    } else if (!member) {
      statusColor = 'bg-white/10';
      statusText = 'Empty';
    }

    const showFbLink = player?.facebook_link && (isCurrentUserMember || teamFromProps?.status === 'registered');

    const nameElement = showFbLink ? (
      <a
        href={player.facebook_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="truncate max-w-[8ch] md:max-w-[12ch] hover:text-blue-400 transition-colors"
        title="View Facebook Profile"
      >
        {formatPlayer(player)}
      </a>
    ) : (
      <span className="truncate max-w-[8ch] md:max-w-[12ch]">{formatPlayer(player)}</span>
    );

    return (
      <div
        onClick={() => player && setSelectedPlayer(player)}
        className={`w-full md:w-auto flex flex-col items-center gap-1 text-white/80 text-xs md:text-sm font-montserrat hover:opacity-80 transition-opacity ${player ? 'cursor-pointer' : ''} relative group`}
      >
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {player?.avatarUrl && (
            <img src={player.avatarUrl} alt={formatPlayer(player)} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {nameElement}
          {member && <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} title={statusText} />}
        </div>
        {status !== 'accepted' && member && (
          <span className={`text-[10px] uppercase font-bold ${status === 'pending' ? 'text-yellow-400' : 'text-red-500'}`}>
            {statusText}
          </span>
        )}


      </div>
    );
  };

  // Team is always mocked for now; backend can replace via props later

  // Check if current user has a pending invite
  const currentUserMember = useMemo(() => {
    if (!user || !teamFromProps || !teamFromProps.members) return null;
    return teamFromProps.members.find(m => m.player_id === user.id);
  }, [user, teamFromProps]);

  const sortedMembers = useMemo(() => {
    if (!teamFromProps?.members) return [];
    return [...teamFromProps.members].sort((a, b) => {
      if (a.role === 'captain') return -1;
      if (b.role === 'captain') return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }, [teamFromProps?.members]);

  const canEdit = useMemo(() => {
    if (!isCaptainFromProps) return false;
    if (!teamFromProps?.tournament) return false;

    const now = new Date();
    const start = new Date(teamFromProps.tournament.start_date);
    const end = new Date(teamFromProps.tournament.end_date);
    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end;
  }, [isCaptainFromProps, teamFromProps]);

  const hasPendingInvite = currentUserMember?.status === 'pending';
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  React.useEffect(() => {
    if (flash?.message) {
      setModalMessage(flash.message);
      setShowSuccessModal(true);
    }
  }, [flash]);

  const handleAcceptInvite = () => {
    setIsProcessingInvite(true);

    // Get user_id from URL if present (for unauthenticated access context)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    router.post(`/team-invite/${teamFromProps.id}/accept`, {
      user_id: userId
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowAcceptModal(false);
        // Data automatically refreshes via Inertia
      },
      onError: (errors) => {
        console.error('Accept invite failed:', errors);
        alert(errors.message || 'Failed to accept invite. Please try again.');
      },
      onFinish: () => setIsProcessingInvite(false)
    });
  };

  const handleGenerateInviteCode = (e) => {
    e.stopPropagation();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    router.post(`/team-generate-code/${teamFromProps.id}`, {
      user_id: userId
    }, {
      onSuccess: (page) => {
        // Inertia success handles the response through props, but we can access flash messages 
        // if the controller is updated to flash, or we can just show success since the prop will have the new code.
        setModalMessage(`Team Invite Code generated successfully!\n\nSend this code to your team members so they can join!`);
        setShowSuccessModal(true);
      },
      onError: (errors) => {
        console.error('Error generating code:', errors);
        const errorMsg = errors.error || errors.message || 'Failed to generate invite code.';
        setModalMessage(errorMsg);
        setShowErrorModal(true);
      }
    });
  };

  const handleRejectInvite = () => {
    if (!confirm('Are you sure you want to decline this team invite? You will be removed from the team.')) return;

    setIsProcessingInvite(true);

    // Get user_id from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    router.post(`/team-invite/${teamFromProps.id}/reject`, {
      user_id: userId
    }, {
      onSuccess: () => {
        window.location.href = '/campus-tournament'; // Redirect to main page
      },
      onError: (errors) => {
        console.error('Error rejecting invite:', errors);
        alert(errors.message || 'Failed to reject invite.');
      },
      onFinish: () => setIsProcessingInvite(false)
    });
  };

  // Team is always mocked for now; backend can replace via props later




  return (
    <MainLayout>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat pb-20"
        style={{ backgroundImage: "url('/images/Campus Tournament/MainBG.png')" }}
      >
        <div className="w-full min-h-screen bg-black/60">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-16">
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <img src="/images/About Page/SL Logo.png" alt="SL Logo" className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain" />
              <div className="text-white text-center font-montserrat font-extrabold text-[32px] md:text-[48px] lg:text-[56px] leading-tight">
                CAMPUS TOURNAMENT
              </div>
            </div>
            <p className="mt-2 text-white/90 font-montserrat text-[12px] sm:text-[14px] md:text-base max-w-3xl text-center mx-auto">
              Your registered team for the ongoing Campus Tournament.
            </p>

            {hasPendingInvite && (
              <div className="mt-6 w-full max-w-3xl mx-auto bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="text-white text-sm font-montserrat">
                    <span className="font-bold text-yellow-400">Action Required:</span> You have been invited to join this team.
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleRejectInvite}
                    disabled={isProcessingInvite}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setShowAcceptModal(true)}
                    disabled={isProcessingInvite}
                    className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    Accept Invite
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 md:mt-10">
              <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
                {/* Header */}
                <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
                  <div className="flex-1 relative flex flex-col items-center justify-center">
                    <h2 className="text-lg md:text-2xl text-white font-montserrat tracking-wide">
                      {teamFromProps?.team_name || 'Team Name'}
                    </h2>
                    <span className="text-white/70 text-xs md:text-sm mt-1 font-montserrat">
                      {teamFromProps?.tournament?.school_name || 'School Name'}
                    </span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 md:right-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${teamFromProps.status === 'registered'
                      ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }`}>
                      {teamFromProps.status === 'registered' ? 'Registered' : 'Assembling'}
                    </span>
                  </div>
                </div>

                {/* Roster */}
                <div className="px-0 pb-4">
                  {/* Desktop grid */}
                  <div className="hidden md:block mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
                    <div className="grid [grid-template-columns:repeat(5,minmax(140px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
                      <div className="text-center">Player 1</div>
                      <div className="text-center">Player 2</div>
                      <div className="text-center">Player 3</div>
                      <div className="text-center">Player 4</div>
                      <div className="text-center">Player 5</div>
                      <div className="text-center">Action</div>
                    </div>

                    <div className="grid [grid-template-columns:repeat(5,minmax(140px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const member = sortedMembers[idx];
                        return (
                          <div className="flex justify-center" key={idx}>
                            <PlayerCell member={member} isCurrentUserMember={!!currentUserMember} />
                          </div>
                        );
                      })}
                      <div className="flex flex-col items-center gap-2">
                        {/* Generate Code Section */}
                        {isCaptainFromProps && (
                          <div className="flex flex-col flex-1 items-center justify-center w-full mb-2">
                            {teamFromProps.invite_code ? (
                              <div className="bg-neutral-900 border border-[#F2C21A]/30 rounded-lg px-4 py-1.5 w-full max-w-[120px] text-center shadow-inner cursor-pointer hover:bg-neutral-800 transition-colors"
                                onClick={() => {
                                  navigator.clipboard.writeText(teamFromProps.invite_code);
                                  setModalMessage('Invite code copied to clipboard!');
                                  setShowSuccessModal(true);
                                }}
                                title="Click to copy code"
                              >
                                <div className="text-[9px] text-white/50 uppercase tracking-wide">Invite Code</div>
                                <div className="text-sm md:text-base text-[#F2C21A] font-mono font-bold tracking-[0.2em] leading-tight mt-0.5">{teamFromProps.invite_code}</div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="bg-[#F2C21A]/10 hover:bg-[#F2C21A]/20 text-[#F2C21A] font-montserrat text-xs font-semibold rounded-lg px-3 py-2 border border-[#F2C21A]/30 w-full max-w-[120px] text-center transition-colors"
                                onClick={handleGenerateInviteCode}
                              >
                                Generate Code
                              </button>
                            )}
                          </div>
                        )}
                          <button
                          type="button"
                          disabled={!canEdit}
                          className={`bg-[#F2C21A] text-black font-montserrat text-xs md:text-sm font-semibold rounded-lg px-6 md:px-7 py-1.5 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] min-w-[88px] justify-center ${!canEdit ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110'}`}
                          onClick={() => {
                            if (canEdit) {
                              // Find the captain from sorted members
                              const captainMember = sortedMembers.find(member => member.role === 'captain');
                              const captainData = captainMember?.player;

                              // Store team data for editing
                              sessionStorage.setItem('campusTournamentEditTeam', JSON.stringify(teamFromProps));

                              // Store captain data separately
                              if (captainData) {
                                sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(captainData));
                              }

                              // Include user_id if present (for admin/debug access), plus edit=true to bypass redirect
                              const urlParams = new URLSearchParams(window.location.search);
                              const userId = urlParams.get('user_id');
                              const targetUrl = userId
                                ? `/Tournament/CampusTournamentReg?user_id=${userId}&edit=true`
                                : '/Tournament/CampusTournamentReg?edit=true';

                              router.visit(targetUrl);
                            }
                          }}
                          title={canEdit ? "Edit team details" : "Editing is only allowed during the registration period."}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile vertical list */}
                  <div className="md:hidden mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40 px-4 py-3">
                    <div className="space-y-3">
                      {sortedMembers.slice(0, 5).map((member, idx) => {
                        const status = member.status || 'accepted';
                        let statusColor = 'bg-green-400';
                        if (status === 'pending') statusColor = 'bg-yellow-400';
                        if (status === 'rejected') statusColor = 'bg-red-500';

                        return (
                          <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2 bg-white/5" onClick={() => member.player && setSelectedPlayer(member.player)}>
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white/10">
                                <svg className="absolute inset-0 m-auto w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {member.player?.avatarUrl && (
                                  <img src={member.player.avatarUrl} alt={formatPlayer(member.player)} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="font-montserrat text-sm">{formatPlayer(member.player)}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
                              {status !== 'accepted' && (
                                <span className={`text-[9px] uppercase font-bold ${status === 'pending' ? 'text-yellow-400' : 'text-red-500'}`}>
                                  {status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 mt-3">
                      {/* Mobile Generate Code Section */}
                      {isCaptainFromProps && (
                        <div className="w-full mb-3">
                          {teamFromProps.invite_code ? (
                            <div className="w-full bg-neutral-900 border border-[#F2C21A]/30 rounded-lg p-3 text-center shadow-inner flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(teamFromProps.invite_code);
                                setModalMessage('Invite code copied to clipboard!');
                                setShowSuccessModal(true);
                              }}
                            >
                              <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Team Invite Code (Tap to Copy)</div>
                              <div className="text-xl text-[#F2C21A] font-mono font-bold tracking-[0.3em]">{teamFromProps.invite_code}</div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="w-full bg-[#F2C21A]/10 hover:bg-[#F2C21A]/20 text-[#F2C21A] font-montserrat text-sm font-semibold rounded-lg px-5 py-2.5 border border-[#F2C21A]/30 transition-colors"
                              onClick={handleGenerateInviteCode}
                            >
                              Generate Invite Code
                            </button>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={!canEdit}
                        className={`w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] ${!canEdit ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 transition-transform'}`}
                        onClick={() => {
                          if (canEdit) {
                            // Find the captain from sorted members
                            const captainMember = sortedMembers.find(member => member.role === 'captain');
                            const captainData = captainMember?.player;

                            // Store team data for editing
                            sessionStorage.setItem('campusTournamentEditTeam', JSON.stringify(teamFromProps));

                            // Store captain data separately
                            if (captainData) {
                              sessionStorage.setItem('campusTournamentCaptain', JSON.stringify(captainData));
                            }

                            // Get user_id if present
                            const urlParams = new URLSearchParams(window.location.search);
                            const userId = urlParams.get('user_id');

                            const targetUrl = userId
                              ? `/Tournament/CampusTournamentReg?user_id=${userId}&edit=true`
                              : '/Tournament/CampusTournamentReg?edit=true';

                            router.visit(targetUrl);
                          }
                        }}
                        title={canEdit ? "Edit team details" : "Editing is only allowed during the registration period."}
                      >
                        Edit team
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              {!isCaptainFromProps && (
                <div className="mt-3 text-xs text-white/60 font-montserrat">
                  You can view your team roster here. Only a Captain can edit details so ask your captain to update details if needed.
                </div>
              )}
            </div>
            <div className="flex justify-center mt-10">
              {/* Placeholder for center content if needed */}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10" onClick={() => {
                  setShowSuccessModal(false);
                  router.reload({ only: ['team'] });
                }} />
                <div className="relative z-20 w-full max-w-md bg-neutral-900 border border-green-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_-5px_rgba(74,222,128,0.15)] text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/50">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-montserrat mb-2">
                    Success!
                  </h3>
                  <p className="text-white/70 font-montserrat text-sm mb-6 max-w-[90%] whitespace-pre-line">
                    {modalMessage}
                  </p>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.reload({ only: ['team'] });
                    }}
                    className="w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[#F2C21A]/90 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10" onClick={() => setShowErrorModal(false)} />
                <div className="relative z-20 w-full max-w-md bg-neutral-900 border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)] text-center flex flex-col items-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-montserrat mb-2">
                    Error
                  </h3>
                  <p className="text-white/70 font-montserrat text-sm mb-6 max-w-[90%]">
                    {modalMessage}
                  </p>
                  <button
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-montserrat text-sm font-semibold rounded-lg px-6 py-3 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}


            {/* Player Details Modal */}
            {showAcceptModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10" onClick={isProcessingInvite ? null : () => setShowAcceptModal(false)} />
                <div className="relative z-20 w-full max-w-md bg-neutral-900 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_30px_-5px_rgba(74,222,128,0.15)] flex flex-col items-center text-center">

                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/50">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-white font-montserrat mb-2">
                    Accept Invite?
                  </h3>

                  <p className="text-white/70 font-montserrat text-sm mb-6 max-w-[80%]">
                    Are you sure you want to join this team? Your status will be updated to Accepted.
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowAcceptModal(false)}
                      disabled={isProcessingInvite}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-montserrat font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAcceptInvite}
                      disabled={isProcessingInvite}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-montserrat font-bold rounded-xl shadow-lg transition-transform transform active:scale-95 disabled:opacity-50 disabled:transform-none"
                    >
                      {isProcessingInvite ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Yes, Accept'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Player Details Modal */}
            {
              selectedPlayer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setSelectedPlayer(null)} />
                  <div className="relative z-20 w-full max-w-sm bg-neutral-900 border border-white/20 rounded-2xl p-6 shadow-2xl">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400 mb-3 bg-neutral-800 relative">
                        <svg className="absolute inset-0 m-auto w-10 h-10 text-white/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 22c0-3.866 5.373-6 9-6s9 2.134 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {selectedPlayer.avatarUrl && (
                          <img src={selectedPlayer.avatarUrl} alt={formatPlayer(selectedPlayer)} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <h3 className="text-white text-xl font-bold font-montserrat">{formatPlayer(selectedPlayer)}</h3>
                      <p className="text-white/60 text-sm font-montserrat">{selectedPlayer.email}</p>
                    </div>

                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-white/50 text-xs uppercase font-semibold">MLBB Data</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">IGN</span>
                        <span className="text-white font-mono text-sm">{selectedPlayer.ml_ign || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Server ID</span>
                        <span className="text-white font-mono text-sm">{selectedPlayer.ml_server || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">User ID</span>
                        <span className="text-white font-mono text-sm">{selectedPlayer.ml_id || 'N/A'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-montserrat text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )
            }
            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" onClick={() => setShowSuccessModal(false)} />
                <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-montserrat text-xl md:text-2xl font-semibold mb-3 text-green-400">
                      Success!
                    </h3>
                    <p className="font-montserrat text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                      {modalMessage}
                    </p>
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full bg-[#F2C21A] text-black font-montserrat text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[#F2C21A]/90 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CampusTournamentTeam;


