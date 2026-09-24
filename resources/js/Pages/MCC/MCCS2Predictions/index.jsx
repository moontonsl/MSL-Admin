import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { CheckCircle } from 'lucide-react';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const baseTeams = [
  { name: 'DLSU GREEN ACES', image: '/images/MCC/MCCS2Predictions/FINAL 8/LA_UR1.png' },
  { name: 'NOVUS BRAVEHEARTS', image: '/images/MCC/MCCS2Predictions/FINAL 8/LB_UR2.png' },
  { name: 'DEEA - AGILA', image: '/images/MCC/MCCS2Predictions/FINAL 8/M_WIL.png' },
  { name: 'SVX FIDES', image: '/images/MCC/MCCS2Predictions/FINAL 8/V_WIL.png' },
  { name: 'REKTIKANO ASTERIA', image: '/images/MCC/MCCS2Predictions/FINAL 8/V_MA.png' },
  { name: 'ALANGILAN RED SPARTANS', image: '/images/MCC/MCCS2Predictions/FINAL 8/LB_FEB.png' },
  { name: 'NU Bulldogs', image: '/images/MCC/MCCS2Predictions/FINAL 8/LA_MA.png' },
  { name: 'ATENEO ESPORTS', image: '/images/MCC/MCCS2Predictions/FINAL 8/M_MA.png' },
];

// Player data organized by role
const playersByRole = {
  GOLD: [
    { name: 'SINFUL', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_SINFUL.png' },
    { name: 'VanixLl', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_VanixLl.png' },
    { name: 'SANCHEZ', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_SANCHEZ.png' },
    { name: 'AOG1RI', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_AOG1RI.png' },
    { name: 'KIRR', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_KIRR.png' },
    { name: 'Shaun', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_Shaun.png' },
    { name: 'Reoshi', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_Reoshi.png' },
    { name: 'KlutZ', image: '/images/MCC/MCCS2Predictions/Players/Gold/G_KlutZ.png' },
  ],
  JUNGLER: [
    { name: 'TATING', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_TATING.png' },
    { name: 'Mijizy', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Mijizy.png' },
    { name: 'ESTACIO', image: '/images/MCC/MCCS2Predictions/Players/Jungler/JG_ESTACIO.png' },
    { name: 'nari', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_nari.png' },
    { name: 'Daledalus', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Daledalus.png' },
    { name: 'JANCY-BOY', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_JANCY-BOY.png' },
    { name: 'Saikiii', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Saikiii.png' },
    { name: 'Oying', image: '/images/MCC/MCCS2Predictions/Players/Jungler/J_Oying.png' },
  ],
  EXP: [
    { name: 'SEAJEY', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_SEAJEY.png' },
    { name: 'Emjayy', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Emjayy.png' },
    { name: 'Ren', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Ren.png' },
    { name: 'Pann', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Pann.png' },
    { name: 'Jinx', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Jinx.png' },
    { name: 'MIRACLEE', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_MIRACLEE.png' },
    { name: 'Flackkooo', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Flackkooo.png' },
    { name: 'Soren-Khent', image: '/images/MCC/MCCS2Predictions/Players/EXP/E_Soren-Khent.png' },
  ],
  MIDDLE: [
    { name: 'lmpostor', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_lmpostor.png' },
    { name: 'Cinderella', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Cinderella.png' },
    { name: 'LIM', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_LIM.png' },
    { name: 'Qorki-Levels', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Qorki-Levels.png' },
    { name: 'Xinchi', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Xinchi.png' },
    { name: 'VICT-JAVELLANA', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_VICT-JAVELLANA.png' },
    { name: 'ZYWIN', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_ZYWIN.png' },
    { name: 'Mirena', image: '/images/MCC/MCCS2Predictions/Players/Mid/M_Mirena.png' },
  ],
  ROAMER: [
    { name: 'laytutu', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_laytutu.png' },
    { name: 'Lawrencio', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Lawrencio.png' },
    { name: 'Alaskador', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Alaskador.png' },
    { name: 'PACULAN', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_PACULAN.png' },
    { name: 'Jamyyyx', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Jamyyyx.png' },
    { name: 'Clarencezzx', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Clarencezzx.png' },
    { name: 'Syong', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Syong.png' },
    { name: 'Ch4kwawa', image: '/images/MCC/MCCS2Predictions/Players/Roam/R_Ch4kwawa.png' },
  ],
};

const roles = ['GOLD', 'JUNGLER', 'EXP', 'MIDDLE', 'ROAMER'];

const CARD_WIDTH = typeof window !== 'undefined' && window.innerWidth >= 768 ? 110 : 115;
const CARD_HEIGHT = 290;

function TeamVoting({ selectedTeams, setSelectedTeams, hasVoted, shuffledTeams }) {
  const toggleSelect = (idx) => {
    if (hasVoted) return; // Disable selection if already voted
    if (selectedTeams.includes(idx)) {
      setSelectedTeams(selectedTeams.filter(i => i !== idx));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, idx]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <img src="/images/MCC/MCCS2Predictions/SOTS.png" alt="Squad of the Season" className="h-8 sm:h-10 md:h-20 mx-auto mb-0 mt-1 md:mt-8"/>
      <p className="text-base md:text-lg font-semibold text-center text-white -mt-1 mb-2">
        {hasVoted ? 'Your Selected Teams' : 'Choose Up to 2 Teams'}
      </p>
      <div className="rounded-2xl p-4 md:p-6 bg-black/40" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {shuffledTeams.map((team, idx) => {
            const isSelected = selectedTeams.includes(idx);
            const isDimmed = (!hasVoted && selectedTeams.length === 2 && !isSelected) || (hasVoted && !isSelected);
            return (
              <div
                key={idx}
                className={`relative bg-black/80 rounded-xl overflow-hidden flex flex-col items-center group transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-400' : ''} ${!hasVoted ? 'cursor-pointer' : ''}`}
                onClick={() => toggleSelect(idx)}
                style={{ opacity: isDimmed ? 0.3 : 1 }}
              >
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                  <CheckCircle size={32} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                </div>
                <img src={team.image} alt={`Team ${idx + 1}`} className="w-full h-32 md:h-56 object-cover" />
                {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayerVoting({ selectedPlayers, setSelectedPlayers, hasVotedRoles, onSubmitRole, shuffledPlayers }) {
  const selectPlayer = (roleIdx, playerIdx) => {
    if (hasVotedRoles[roles[roleIdx]]) return; // Disable selection if already voted
    const currentSelections = selectedPlayers[roleIdx] || [];

    if (currentSelections.includes(playerIdx)) {
      const newSelections = currentSelections.filter(idx => idx !== playerIdx);
      setSelectedPlayers({ ...selectedPlayers, [roleIdx]: newSelections.length > 0 ? newSelections : undefined });
    } else if (currentSelections.length < 3) {
      const newSelections = [...currentSelections, playerIdx];
      setSelectedPlayers({ ...selectedPlayers, [roleIdx]: newSelections });
    }
  };

  const canSubmitRole = (role) => {
    const roleIdx = roles.indexOf(role);
    const currentSelections = selectedPlayers[roleIdx] || [];
    return currentSelections.length >= 1 && currentSelections.length <= 3 && !hasVotedRoles[role];
  };

  return (
    <div className="w-full flex flex-col items-center mb-18 mt-10">
      <img src="/images/MCC/MCCS2Predictions/POTS.png" alt="Players of the Season" className="h-8 sm:h-10 md:h-20 mx-auto mb-0 mt-1 md:mt-8"/>
      <p className="text-center text-white text-lg font-semibold mb-6 md:mb-12">Choose Up to 3 Players per Role</p>
      <div className="flex flex-col gap-4 md:gap-12 w-full max-w-[95%] md:max-w-[1400px]">
      {roles.map((role, roleIdx) => (
        <div key={role} className="flex flex-col">
          <div className="flex items-start w-full justify-start md:justify-center relative gap-1 md:gap-0 pl-2 md:pl-0">
            <div
              className="flex items-center justify-center bg-stone-900 flex-shrink-0 relative z-10 mr-2 md:mr-3"
              style={{
                width: typeof window !== 'undefined' && window.innerWidth >= 768 ? 56 : 35,
                height: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_HEIGHT * 0.9 : CARD_HEIGHT * 0.65,
                borderRadius: '12px',
                marginRight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '0.75rem' : '0.75rem'
              }}
            >
              <span
                className="text-yellow-400 font-bold font-montserrat tracking-widest uppercase"
                style={{
                  transform: 'rotate(-90deg)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.15em',
                  fontSize: typeof window !== 'undefined' && window.innerWidth >= 768 ? '1.875rem' : '0.875rem'
                }}
              >
                {role}
              </span>
            </div>

            <div className="w-full max-w-[90vw] md:max-w-none overflow-x-auto relative z-0 py-2 custom-scrollbar">
              <div className="flex flex-row gap-2 md:gap-4 md:justify-start pl-1 md:pl-0 md:mx-auto" style={{
                maxWidth: typeof window !== 'undefined' && window.innerWidth >= 768 ? '1200px' : 'none'
              }}>
                {shuffledPlayers[roleIdx] && shuffledPlayers[roleIdx].map((player, playerIdx) => {
                  const currentSelections = selectedPlayers[roleIdx] || [];
                  const isSelected = currentSelections.includes(playerIdx);
                  const isDimmed = (!hasVotedRoles[role] && currentSelections.length === 3 && !isSelected) || (hasVotedRoles[role] && !isSelected);
                  return (
                    <div
                      key={playerIdx}
                      className={`relative rounded-2xl flex flex-col items-center transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-400' : ''} ${!hasVotedRoles[role] ? 'cursor-pointer' : ''}`}
                      style={{
                        width: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_WIDTH : CARD_WIDTH * 0.73,
                        height: typeof window !== 'undefined' && window.innerWidth >= 768 ? CARD_HEIGHT * 0.9 : CARD_HEIGHT * 0.65,
                        transform: 'scale(1)',
                        opacity: isDimmed ? 0.3 : 1,
                        flexShrink: 0,
                        background: '#18181b',
                        padding: '2px',
                      }}
                      onClick={() => selectPlayer(roleIdx, playerIdx)}
                    >
                                     <div className="w-full h-full rounded-xl overflow-hidden">
                       <div className="absolute top-2 right-2 z-10">
                         <CheckCircle size={typeof window !== 'undefined' && window.innerWidth >= 768 ? 32 : 20} className={`transition-opacity duration-300 ${isSelected ? 'opacity-100 text-yellow-400' : 'opacity-0'}`} />
                       </div>
                       <img
                         src={player.image}
                         alt={player.name}
                         style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover',
                         }}
                       />
                       {isDimmed && <div className="absolute inset-0 bg-black/60 z-10" />}
                     </div>
                   </div>
                  );
                })}
              </div>
            </div>

            {/* White horizontal line (only in desktop view) */}
            <div className="absolute left-0 right-0 -bottom-4 h-1 bg-white rounded-full w-full hidden md:block" style={{ maxWidth: '90%', margin: '0 auto' }} />
          </div>

          {/* Submit button for this role */}
          <div className="flex justify-center mt-4 md:mt-10">
            {canSubmitRole(role) && (
              <button
                onClick={() => onSubmitRole(role)}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-md shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Submit {role} Vote
              </button>
            )}

            {hasVotedRoles[role] && (
              <div className="px-6 py-2 bg-green-500 text-white font-bold text-sm rounded-md">
                {role} Vote Submitted ✓
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default function MCCS2PredictionsPage({ teamPrediction, roleVotes, ml_user }) {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [hasVotedTeams, setHasVotedTeams] = useState(false);
  const [hasVotedRoles, setHasVotedRoles] = useState({});
  const [notification, setNotification] = useState(null);
  const [shuffledTeams, setShuffledTeams] = useState([]);
  const [shuffledPlayers, setShuffledPlayers] = useState([]);
  const [tournamentClosed, setTournamentClosed] = useState(true); // Set to true to close tournament

  // Initialize shuffled arrays once
  useEffect(() => {
    setShuffledTeams(shuffleArray(baseTeams));
    setShuffledPlayers(roles.map(role => shuffleArray(playersByRole[role])));
  }, []);

  // Initialize with user's previous votes
  useEffect(() => {
    if (shuffledTeams.length === 0 || shuffledPlayers.length === 0) return;

    // Check team votes
    if (teamPrediction) {
      setHasVotedTeams(true);
      if (teamPrediction.selected_teams) {
        const teamIndices = teamPrediction.selected_teams.map(team => 
          shuffledTeams.findIndex(t => t.name === team.name)
        ).filter(idx => idx !== -1);
        setSelectedTeams(teamIndices);
      }
    }
    
    // Check player votes for each role
    const roleVoteStatus = {};
    const playerSelections = {};
    roles.forEach((role, roleIdx) => {
      const roleVote = roleVotes[role];
      if (roleVote) {
        roleVoteStatus[role] = true;
        if (roleVote.selected_players) {
          const playerIndices = roleVote.selected_players.map(player => 
            shuffledPlayers[roleIdx].findIndex(p => p.name === player.name)
          ).filter(idx => idx !== -1);
          if (playerIndices.length > 0) {
            playerSelections[roleIdx] = playerIndices;
          }
        }
      } else {
        roleVoteStatus[role] = false;
      }
    });
    setHasVotedRoles(roleVoteStatus);
    setSelectedPlayers(playerSelections);
  }, [teamPrediction, roleVotes, shuffledTeams, shuffledPlayers]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const allRolesSelected = roles.every((_, idx) => selectedPlayers[idx] && selectedPlayers[idx].length >= 1);
  const canSubmitTeams = selectedTeams.length >= 1 && selectedTeams.length <= 2 && !hasVotedTeams;

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const submitTeamVote = async () => {
    const selectedTeamsData = selectedTeams.map(idx => shuffledTeams[idx]);
    
    try {
      const response = await fetch('/mcc/MCCFavourites/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          selected_teams: selectedTeamsData,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        showNotification('success', '🎉 Your team vote has been submitted successfully!');
        setHasVotedTeams(true);
      } else {
        showNotification('error', result.error || '❌ Team vote submission failed. Please try again.');
      }
    } catch (err) {
      showNotification('error', '❌ Network error. Please check your connection and try again.');
    }
  };

  const submitRoleVote = async (role) => {
    const roleIdx = roles.indexOf(role);
    const currentSelections = selectedPlayers[roleIdx] || [];
    
    if (currentSelections.length === 0) {
      showNotification('error', `❌ Please select at least 1 ${role} player.`);
      return;
    }

    const selectedPlayersData = currentSelections.map(playerIdx => shuffledPlayers[roleIdx][playerIdx]);
    
    try {
      const response = await fetch('/mcc/MCCFavourites/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          role: role,
          selected_players: selectedPlayersData,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        showNotification('success', `🎉 Your ${role} player vote has been submitted successfully!`);
        setHasVotedRoles(prev => ({ ...prev, [role]: true }));
      } else {
        showNotification('error', result.error || `❌ ${role} vote submission failed. Please try again.`);
      }
    } catch (err) {
      showNotification('error', '❌ Network error. Please check your connection and try again.');
    }
  };

  return (
    <MainLayout>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }
        .notification-enter {
          opacity: 0;
          transform: translateY(-20px);
        }
        .notification-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease-out;
        }
        .notification-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .notification-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s ease-in;
        }
        .voting-closed-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          border-radius: inherit;
        }
      `}</style>
      
      {/* Notification Component */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[9999] max-w-sm w-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg shadow-lg p-4 transform transition-all duration-300`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="h-6 w-6 text-green-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </p>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen bg-no-repeat bg-cover bg-center bg-fixed w-full pb-32"
        style={{ backgroundImage: "url('/images/MCC/MCCS2Predictions/PredictionsBG.png')" }}
      >
        <div className="flex-1 w-full flex flex-col items-center justify-start pt-0 gap-4">
          <div className="text-center">
            <img src="/images/MCC/MCC_HLOGO.png" alt="Pamantasan Lakas" className="h-70 md:h-50" />
            <h1 className="text-xl md:text-3xl font-bold text-white uppercase tracking-wide">
              Public Choice Awards
            </h1>
          </div>

          {ml_user && (
            <div className="bg-gray-500/20 border border-yellow-500 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-semibold">
                👤 Voting as: {ml_user.ign} (ID: {ml_user.ml_id})
              </p>
            </div>
          )}

          {/* Teams Section */}
          <div className="w-full relative">
            <TeamVoting 
              selectedTeams={selectedTeams} 
              setSelectedTeams={setSelectedTeams} 
              hasVoted={hasVotedTeams || tournamentClosed} 
              shuffledTeams={shuffledTeams}
            />
            
            {canSubmitTeams && !tournamentClosed && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={submitTeamVote}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-md shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Submit Team Vote
                </button>
              </div>
            )}

            {hasVotedTeams && (
              <div className="flex justify-center mt-6">
                <div className="px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-md">
                  Team Vote Submitted ✓
                </div>
              </div>
            )}

            {/* Voting Closed Overlay for Teams */}
            {tournamentClosed && (
              <div className="voting-closed-overlay">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🔒</div>
                  <h3 className="text-xl font-bold mb-2">Voting Closed</h3>
                  <p className="text-sm opacity-80">Team voting has been closed for this tournament</p>
                </div>
              </div>
            )}
          </div>

          {/* Players Section */}
          <div className="w-full relative">
            <PlayerVoting 
              selectedPlayers={selectedPlayers} 
              setSelectedPlayers={setSelectedPlayers} 
              hasVotedRoles={tournamentClosed ? roles.reduce((acc, role) => ({ ...acc, [role]: true }), {}) : hasVotedRoles}
              onSubmitRole={submitRoleVote}
              shuffledPlayers={shuffledPlayers}
            />

            {/* Voting Closed Overlay for Players */}
            {tournamentClosed && (
              <div className="voting-closed-overlay">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🔒</div>
                  <h3 className="text-xl font-bold mb-2">Voting Closed</h3>
                  <p className="text-sm opacity-80">Player voting has been closed for this tournament</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
