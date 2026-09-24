import React from 'react';

export default function MatchManager({
  tournament,
  PlayerCell,
  setMobileViewTeam,
  getBracketCounts,
  getStatusClasses,
  handleSetResult,
  handleSubmitResults,
  isEditingResults,
  setIsEditingResults,
}) {
  const allTeams = Array.isArray(tournament?.teams) ? tournament.teams : [];
  const teams = allTeams.filter((t) => t.status === 'registered');
  const registeredCount = teams.filter((t) => t.status === 'registered').length;
  const counts = getBracketCounts?.(registeredCount, tournament?.tournament_type);
  const show3rd = (counts?.maxThird ?? 0) > 0;
  const show4th = (counts?.maxFourth ?? 0) > 0;

  return (
    <div>
      <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 px-6 md:px-10 py-2 text-white/70 text-xs md:text-sm border-b border-white/10 font-montserrat">
        <div className="self-center">Team name</div>
        <div className="text-left">Player 1</div>
        <div className="text-left">Player 2</div>
        <div className="text-left">Player 3</div>
        <div className="text-left">Player 4</div>
        <div className="text-left">Player 5</div>
        <div className="grid place-items-center">Status</div>
      </div>

      <div className="md:hidden grid [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-5 px-4 py-2 text-white/70 text-xs border-b border-white/10 font-montserrat">
        <div className="self-center">Team name</div>
        <div className="justify-self-start text-left">Status</div>
        <div className="text-right"></div>
      </div>

      <div>
        {teams.length > 0 ? (
          teams.map((team) => (
            <React.Fragment key={team.id}>
              <div className="hidden md:grid [grid-template-columns:minmax(160px,1.3fr)_repeat(5,minmax(100px,1fr))_minmax(120px,1fr)] gap-3 items-center px-6 md:px-10 py-3 border-t border-white/10 hover:bg-white/5 transition">
                <div className="text-white/90 font-montserrat md:truncate">{team.name}</div>
                {Array.from({ length: 5 }).map((_, idx) => {
                  const player = team.players[idx];
                  return (
                    <div className="flex items-center justify-start w-full min-w-0" key={idx}>
                      {player ? <PlayerCell player={player} /> : <span className="text-white/20 text-xs italic font-montserrat">Empty</span>}
                    </div>
                  );
                })}
                <div className="flex justify-center">
                  <select
                    value={team.result || 'participant'}
                    onChange={(e) => handleSetResult?.(tournament.id, team.id, e.target.value)}
                    disabled={tournament.results_submitted && !isEditingResults}
                    className={`rounded-md px-2 py-1 ${getStatusClasses?.(team.result || 'participant')} focus:text-black text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[128px] ${tournament.results_submitted && !isEditingResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option className="text-black" value="participant">
                      Participant
                    </option>
                    <option className="text-black" value="1st">
                      1st
                    </option>
                    <option className="text-black" value="2nd">
                      2nd
                    </option>
                    {show3rd && (
                      <option className="text-black" value="3rd">
                        3rd
                      </option>
                    )}
                    {show4th && (
                      <option className="text-black" value="4th">
                        4th
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid md:hidden [grid-template-columns:minmax(120px,1fr)_112px_auto] gap-2 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5 transition">
                <div className="text-white/90 font-montserrat truncate">{team.name}</div>
                <div className="flex justify-start">
                  <select
                    value={team.result || 'participant'}
                    onChange={(e) => handleSetResult?.(tournament.id, team.id, e.target.value)}
                    disabled={tournament.results_submitted && !isEditingResults}
                    className={`rounded-md px-2 py-1 ${getStatusClasses?.(team.result || 'participant')} focus:text-black text-xs focus:outline-none focus:ring-2 focus:ring-[#F2C21A] min-w-[112px] ${tournament.results_submitted && !isEditingResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option className="text-black" value="participant">
                      Participant
                    </option>
                    <option className="text-black" value="1st">
                      1st
                    </option>
                    <option className="text-black" value="2nd">
                      2nd
                    </option>
                    {show3rd && (
                      <option className="text-black" value="3rd">
                        3rd
                      </option>
                    )}
                    {show4th && (
                      <option className="text-black" value="4th">
                        4th
                      </option>
                    )}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMobileViewTeam?.(team)}
                    className="px-3 py-1 rounded-md border border-white/30 text-white/90 text-xs bg-white/10 hover:bg-white/20"
                  >
                    View
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-white/60 font-montserrat">
            No teams registered yet.
          </div>
        )}
      </div>

      <div className="px-4 md:px-10 py-4 border-t border-white/10 flex flex-wrap justify-center gap-4 bg-neutral-900/70">
        {tournament.results_submitted ? (
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="bg-green-500/20 text-green-400 font-montserrat text-sm px-4 py-2 rounded-lg border border-green-400/30">
              ✓ Results Submitted
            </div>
            {tournament.results_submitted_at && (
              <div className="text-white/60 font-montserrat text-xs">
                Submitted on {new Date(tournament.results_submitted_at).toLocaleDateString()}
              </div>
            )}
            <a
              href={`/campus-tournaments/${tournament.id}/export`}
              className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-5 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)] hover:bg-[#d4a817] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Excel
            </a>
            {isEditingResults ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmitResults?.(tournament.id)}
                  className="bg-[#F2C21A] text-black font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingResults?.(false)}
                  className="bg-neutral-700 text-white font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingResults?.(true)}
                className="bg-blue-600 text-white font-montserrat text-xs font-semibold rounded-lg px-4 py-2"
              >
                Edit
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleSubmitResults?.(tournament.id)}
            className="bg-[#F2C21A] text-black font-montserrat font-semibold rounded-lg px-6 py-2 shadow-[0_0_8px_-3px_rgba(242,194,26,1)]"
          >
            Submit Results
          </button>
        )}
      </div>
    </div>
  );
}

