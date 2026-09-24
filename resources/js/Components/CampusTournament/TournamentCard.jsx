import React, { useMemo, useState } from 'react';
import MatchManager from './tournamentTabs/MatchManager.jsx';
import RosterManager from './tournamentTabs/RosterManager.jsx';

export default function TournamentCard({
  tournament,
  isExpanded,
  onToggleExpand,
  formatDate,
  openDeleteModal,
  PlayerCell,
  setMobileViewTeam,
  getBracketCounts,
  getStatusClasses,
  handleSetResult,
  handleSubmitResults,
  isEditingResults,
  setIsEditingResults,
}) {
  const [activeTab, setActiveTab] = useState('match_management');

  const tabs = useMemo(
    () => [
      { id: 'match_management', label: 'Match Management' },
      { id: 'roster_manager', label: 'Roster & Solo Players' },
    ],
    []
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50">
      <div className="relative z-10 w-full h-16 md:h-20 flex items-center justify-between bg-neutral-900/70 px-4 md:px-6">
        <div className="flex-1 text-center">
          <div className="font-montserrat text-lg md:text-2xl tracking-wide uppercase">
            {(tournament.school_name || '').toUpperCase()} TOURNAMENT
          </div>
          <div className="font-montserrat text-xs md:text-sm text-white/70">
            {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)} •{' '}
            {tournament.tournament_type || 'Online'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tournament.status === 'pending' && (
            <button
              type="button"
              onClick={() => openDeleteModal?.(tournament)}
              className="bg-red-500 hover:bg-red-600 text-white font-montserrat text-xs font-semibold rounded-lg px-3 py-1.5"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggleExpand?.(tournament.id)}
            className="grid place-items-center w-9 h-9 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-0 pb-0">
          <div className="mt-0 rounded-b-2xl bg-neutral-800/70 backdrop-blur-sm border-t border-neutral-700/40">
            <div className="flex items-center gap-4 border-b border-neutral-800 mb-6 pb-2 px-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={
                    activeTab === t.id
                      ? 'text-[#FFC107] border-b-2 border-[#FFC107] pb-2 font-semibold text-sm transition-colors'
                      : 'text-gray-400 hover:text-white pb-2 font-medium text-sm transition-colors cursor-pointer'
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="px-0 pb-4 transition-all duration-300">
              {activeTab === 'match_management' ? (
                <MatchManager
                  tournament={tournament}
                  PlayerCell={PlayerCell}
                  setMobileViewTeam={setMobileViewTeam}
                  getBracketCounts={getBracketCounts}
                  getStatusClasses={getStatusClasses}
                  handleSetResult={handleSetResult}
                  handleSubmitResults={handleSubmitResults}
                  isEditingResults={isEditingResults}
                  setIsEditingResults={setIsEditingResults}
                />
              ) : (
                <RosterManager 
                  tournament={tournament} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

