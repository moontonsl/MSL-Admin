
import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout.jsx';
import RosterLockNotice from '@/Components/RosterLockNotice.jsx';
import { ChevronDown, User, Plus } from 'lucide-react';

const ROLE_IMAGE_MAP = {
  Jungler: 'zxq_icon_jgl.png',
  Roam: 'zxq_icon_roam.png',
  'Gold Laner': 'zxq_icon_gold.png',
  'Exp Laner': 'zxq_icon_exp.png',
  'Mid Laner': 'zxq_icon_mid.png',
};

const SOLO_ROLES = ['Jungler', 'Roam', 'Gold Laner', 'Exp Laner', 'Mid Laner'];

function getVacantRoleLabel(role) {
  if (role === 'Gold Laner') return 'Gold';
  if (role === 'Exp Laner') return 'Exp';
  if (role === 'Mid Laner') return 'Mid';
  return role;
}

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

function SlotCell({ slot, onEmptyClick, isUserOnTeam, isUserOnThisTeam, teamStatus, isLocked }) {
  if (slot.isFilled) {
    const showFbLink = slot.facebook_link && (isUserOnThisTeam || teamStatus === 'registered');

    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative h-8 w-8 rounded-full border border-neutral-600 bg-neutral-800 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#111111]" />
        </div>

        <div className="flex flex-col items-start min-w-0">
          {showFbLink ? (
            <a
              href={slot.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${slot.isYou ? 'text-[#FFC107] font-bold' : 'text-white font-medium'} truncate w-full hover:underline`}
              title={slot.playerName}
            >
              {slot.playerName}
            </a>
          ) : (
            <span
              className={`text-sm ${slot.isYou ? 'text-[#FFC107] font-bold' : 'text-white font-medium'} truncate w-full`}
              title={slot.playerName}
            >
              {slot.playerName}
            </span>
          )}
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-tight shrink-0">
              {getVacantRoleLabel(slot.role)}
            </span>
            <span className="text-white/20 text-[10px] shrink-0">|</span>
            <span className="text-[10px] text-gray-500 truncate" title={slot.ign}>
              {slot.ign || '-'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const roleName = getVacantRoleLabel(slot.role);
  const isDisabled = isUserOnTeam || isLocked;
  return (
    <button
      type="button"
      onClick={() => !isDisabled && onEmptyClick?.(slot.role)}
      disabled={isDisabled}
      className={`min-w-0 flex items-center gap-2 ${isDisabled ? 'cursor-default opacity-80' : 'hover:opacity-80 transition-opacity'}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
          <RoleIcon role={slot.role} />
        </div>
        <div className="flex flex-col items-start leading-tight min-w-0">
          <span className="text-[11px] md:text-xs text-white/40 font-medium uppercase tracking-wider truncate">{roleName}</span>
          <span className="text-[10px] text-gray-500 truncate">Vacant</span>
        </div>
      </div>
    </button>
  );
}

function ModalRoleSelect({ value, onChange, options, isOpen, onToggle, triggerRef, menuRef }) {
  const [pos, setPos] = useState(null);

  const update = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left, width: r.width });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return;
    const down = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      onToggle(false);
    };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [isOpen, onToggle, triggerRef, menuRef]);

  return (
    <>
      <div className="relative z-[1000] w-full" ref={triggerRef}>
        <button
          type="button"
          onClick={() => onToggle(!isOpen)}
          className="w-full rounded-xl border border-neutral-700 bg-[#222] px-4 py-3 flex items-center justify-between text-left text-white"
        >
          <span className={value ? 'text-white' : 'text-gray-500'}>
            {value || 'Select Role'}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 10001,
            }}
            className="bg-[#2a2a2a] border border-neutral-700 rounded-xl max-h-[220px] overflow-y-auto shadow-2xl custom-scrollbar"
          >
            {options.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange(role);
                  onToggle(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-800 ${value === role ? 'text-[#FFC107] font-semibold' : 'text-white/90'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export default function TournamentJoinDashboard({ tournament, teams = [], user }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [modalRole, setModalRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const modalRoleTriggerRef = useRef(null);
  const modalRoleMenuRef = useRef(null);

  const isLocked = useMemo(() => {
    if (!tournament) return false;
    if (tournament.registration_locked) return true;
    const end = new Date(tournament.end_date);
    end.setHours(23, 59, 59, 999);
    return new Date() > end;
  }, [tournament]);

  const processedTeams = useMemo(() => {
    return teams.map(team => {
      const slots = SOLO_ROLES.map(role => {
        const member = team.members.find(m => m.lane_role === role);
        return {
          role,
          isFilled: !!member,
          playerName: member ? member.player.username : null,
          ign: member ? member.player.ml_ign : null,
          facebook_link: member ? member.player.facebook_link : null,
          isYou: member ? member.player.id === user.id : false
        };
      });
      const userOnTeam = slots.some(s => s.isYou);
      return { ...team, slots, userOnTeam };
    });
  }, [teams, user.id]);

  const isUserOnAnyTeam = useMemo(() => {
    return processedTeams.some(t => t.userOnTeam);
  }, [processedTeams]);

  const openJoinModal = (team, role) => {
    if (isUserOnAnyTeam || isLocked) return;

    // If a role was clicked directly, use it. Otherwise let them pick.
    const selectedRole = role || '';

    // If a specific slot was clicked that doesn't match their selection (though here we don't have intended role anymore)
    // We just set what they clicked.

    const isRoleTaken = selectedRole ? team.members.some(m => m.lane_role === selectedRole) : false;
    if (selectedRole && isRoleTaken) {
      setError(`The role '${selectedRole}' is already taken in this team. Please pick another role or team.`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedTeam(team);
    setModalRole(selectedRole);
    setActiveModal('join');
  };

  const openCreateModal = () => {
    if (isUserOnAnyTeam) return;

    setModalRole('');
    setActiveModal('create');
  };

  const openLeaveModal = (team) => {
    setSelectedTeam(team);
    setActiveModal('leave');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTeam(null);
    setError('');
    setIsLoading(false);
  };


  const handleCreateTeam = async () => {
    if (!newTeamName || !modalRole) {
      setError('Please provide a team name and select your role.');
      return;
    }
    setIsLoading(true);
    setError('');

    axios.post('/api/solo/create', {
      team_name: newTeamName,
      role: modalRole,
      tournament_id: tournament.id
    })
      .then(() => {
        closeModal();
        router.reload();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to create team.';
        setError(errorMsg);
      })
      .finally(() => setIsLoading(false));
  };

  const handleJoinTeam = async () => {
    if (!modalRole || !selectedTeam) return;
    setIsLoading(true);
    setError('');

    axios.post('/api/solo/join', {
      team_id: selectedTeam.id,
      role: modalRole
    })
      .then(() => {
        closeModal();
        router.reload();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to join team.';
        setError(errorMsg);
      })
      .finally(() => setIsLoading(false));
  };

  const handleLeaveTeam = async () => {
    setIsLoading(true);
    setError('');

    axios.post('/api/solo/leave')
      .then(() => {
        closeModal();
        router.reload();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to leave team.';
        setError(errorMsg);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <MainLayout>
      <Head title="Solo Matchmaking Dashboard" />
      <section
        className="relative min-h-[calc(100vh-120px)] py-8 md:py-12 overflow-visible"
        style={{
          backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 w-[95%] max-w-[1600px] mx-auto px-4 font-['Montserrat']">
          <div className="bg-[#111111] rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-[#FFC107] font-bold text-lg md:text-2xl tracking-tight uppercase leading-snug">
                  Solo Matchmaking - {tournament?.school_name || 'My Campus'}
                </h1>
                {isLocked ? (
                  <p className="mt-2 text-red-500 font-bold text-sm uppercase tracking-wider animate-pulse">
                    Registration is now CLOSED and Roster is LOCKED.
                  </p>
                ) : (
                  <p className="mt-2 text-white/70 text-sm">
                    Teams will be formally registered once all 5 roles are locked. Until then, the status remains <span className="text-yellow-400 font-bold">Assembling</span>.
                  </p>
                )}
              </div>
              <div className="flex justify-center md:justify-end shrink-0">
                <RosterLockNotice
                  title={tournament?.end_date ? `Roster Lock: ${new Date(tournament.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : undefined}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Join an active team</h2>
                  <p className="text-white/40 text-sm mt-1">Look for teams needing your specific role.</p>
                </div>

                {!isUserOnAnyTeam && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openCreateModal}
                      disabled={isLocked}
                      className={`bg-[#FFC107] ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d9ae17] transform hover:scale-[1.02] active:scale-95'} text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/10`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create New Team</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-2 md:p-4 min-h-[400px]">
                {processedTeams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-white/40 mb-2">No teams assembling yet.</p>
                    <p className="text-xs text-white/20">Be the first to start a team for your school!</p>
                  </div>
                ) : (
                  processedTeams.map((team) => (
                    <div
                      key={team.id}
                      className={`w-full bg-[#1A1A1A] border ${team.userOnTeam ? 'border-yellow-500/50' : 'border-neutral-800'} rounded-xl p-4 mb-4 flex flex-col gap-4 lg:grid lg:grid-cols-[160px_repeat(5,minmax(0,1fr))_120px] lg:gap-4 lg:items-center hover:bg-[#222222] transition-colors`}
                    >
                      <div className="shrink-0 flex flex-col lg:items-start">
                        <span className="text-white font-bold truncate text-sm md:text-base mb-1" title={team.team_name}>
                          {team.team_name}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${team.status === 'registered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {team.status === 'registered' ? 'Registered' : 'Assembling'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:contents gap-4">
                        {team.slots.map((slot, idx) => (
                          <SlotCell
                            key={idx}
                            slot={slot}
                            isUserOnTeam={isUserOnAnyTeam}
                            isUserOnThisTeam={team.userOnTeam}
                            teamStatus={team.status}
                            isLocked={isLocked}
                            onEmptyClick={(role) => openJoinModal(team, role)}
                          />
                        ))}
                      </div>

                      <div className="flex justify-center lg:justify-end shrink-0 pt-3 lg:pt-0 border-t border-white/5 lg:border-t-0">
                        {team.userOnTeam && (
                          <button
                            type="button"
                            onClick={() => openLeaveModal(team)}
                            disabled={isLocked}
                            className={`bg-red-600 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'} text-white px-5 py-1.5 rounded-full text-xs font-bold transition-colors`}
                          >
                            Leave
                          </button>
                        )}
                        {!team.userOnTeam && team.status !== 'registered' && !isUserOnAnyTeam && (
                          <button
                            type="button"
                            onClick={() => openJoinModal(team)}
                            disabled={isLocked}
                            className={`bg-[#FFC107] ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d9ae17]'} text-black px-5 py-1.5 rounded-full text-xs font-bold transition-colors`}
                          >
                            Join Team
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeModal !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm p-4 bg-black/80">
          <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/50 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ×
            </button>

            {activeModal === 'create' && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <h2 className="text-white font-bold text-xl uppercase tracking-tight">Create Solo Team</h2>
                  <p className="text-xs text-white/40 mt-1">Start a new matchmaking team for your school</p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-xs">{error}</div>}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/60 ml-2 font-medium">Team Name</label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter a cool team name"
                      className="w-full bg-[#222] border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFC107]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/50 uppercase font-bold ml-1">Select Your Role</label>
                    <ModalRoleSelect
                      value={modalRole}
                      onChange={setModalRole}
                      options={SOLO_ROLES}
                      isOpen={roleMenuOpen}
                      onToggle={setRoleMenuOpen}
                      triggerRef={modalRoleTriggerRef}
                      menuRef={modalRoleMenuRef}
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 mt-2">
                    <p className="text-[10px] text-yellow-400/80 italic leading-relaxed">
                      Note: Incomplete rosters will be merged, and roles will be randomly assigned once registration locks.
                    </p>
                  </div>
                </div>

                <button
                  disabled={isLoading || !newTeamName || !modalRole}
                  onClick={handleCreateTeam}
                  className="w-full bg-[#FFC107] hover:bg-[#d9ae17] text-black font-bold py-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            )}

            {activeModal === 'join' && selectedTeam && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-white font-bold text-base leading-relaxed">
                    Lock role in <span className="text-[#FFC107]">&apos;{selectedTeam.team_name}&apos;</span>
                  </h2>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-xs">{error}</div>}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/50 uppercase font-bold ml-1">Select Your Role</label>
                    <ModalRoleSelect
                      value={modalRole}
                      onChange={setModalRole}
                      options={SOLO_ROLES.filter(role => !selectedTeam?.members.some(m => m.lane_role === role))}
                      isOpen={roleMenuOpen}
                      onToggle={setRoleMenuOpen}
                      triggerRef={modalRoleTriggerRef}
                      menuRef={modalRoleMenuRef}
                    />
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                    <p className="text-[10px] text-white/40 italic leading-relaxed">
                      Note: You cannot change your role once locked.
                    </p>
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-yellow-400/80 italic leading-relaxed">
                        Warning: Incomplete rosters will be merged, and roles will be randomly assigned once registration locks.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isLoading || !modalRole}
                  onClick={handleJoinTeam}
                  className="w-full bg-[#FFC107] hover:bg-[#d9ae17] text-black font-bold py-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Joining...' : 'Lock Role & Join'}
                </button>
              </div>
            )}

            {activeModal === 'leave' && selectedTeam && (
              <div className="flex flex-col gap-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-white font-bold text-lg">Leave Team?</h2>
                  <p className="text-sm text-white/50 px-4 leading-relaxed">
                    You are currently locked as <span className="text-yellow-400 font-bold">{processedTeams.find(t => t.id === selectedTeam.id)?.slots.find(s => s.isYou)?.role}</span> in &apos;{selectedTeam.team_name}&apos;.
                  </p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-xs">{error}</div>}

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    disabled={isLoading}
                    onClick={handleLeaveTeam}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-colors"
                  >
                    {isLoading ? 'Leaving...' : 'Confirm Leave'}
                  </button>
                  <button onClick={closeModal} className="text-white/40 hover:text-white text-xs font-medium py-2">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
