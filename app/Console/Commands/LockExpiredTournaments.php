<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CampusTournament;
use App\Models\CampusTournamentTeam;
use App\Models\CampusTournamentTeamMember;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LockExpiredTournaments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:lock-expired-tournaments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically lock registration and fuse incomplete rosters for expired tournaments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Scanning for expired tournaments that need locking...");

        // Find approved tournaments that have passed their end_date and are not yet locked
        $expiredTournaments = CampusTournament::where('status', 'approved')
            ->where('registration_locked', false)
            ->whereDate('end_date', '<', Carbon::now())
            ->get();

        if ($expiredTournaments->isEmpty()) {
            $this->info("No expired tournaments found.");
            return 0;
        }

        foreach ($expiredTournaments as $tournament) {
            $this->info("Processing tournament: {$tournament->school_name} (ID: {$tournament->id})");
            $this->performLockAndFusion($tournament);
        }

        $this->info("All expired tournaments processed.");
        return 0;
    }

    /**
     * Core logic for locking registration and fusing rosters
     */
    protected function performLockAndFusion($tournament)
    {
        // Reload tournament with assembling teams
        $tournament->load(['teams' => function($q) {
            $q->where('status', 'assembling');
        }, 'teams.members']);

        DB::beginTransaction();
        try {
            // 1. Mark as locked
            $tournament->update(['registration_locked' => true]);

            // 2. Collect solo player pool BEFORE archiving (prioritise larger groups staying together)
            $assemblingTeams = $tournament->teams;

            $sortedTeams = $assemblingTeams->filter(fn($t) => $t->type === 'solo')
                ->sortByDesc(fn($t) => $t->members->count());

            $playerPool = [];
            foreach ($sortedTeams as $team) {
                foreach ($team->members as $member) {
                    $playerPool[] = $member->player_id;
                }
            }

            // Deduplicate player pool (prevents players appearing in multiple fused teams)
            $playerPool = array_unique($playerPool);
            $playerPool = array_values($playerPool); // Re-index array after unique

            // 3. Archive all assembling teams instead of deleting them.
            //    They will be restored to 'assembling' if the tournament is extended.
            foreach ($assemblingTeams as $team) {
                $team->update(['status' => 'archived']);
            }

            // 4. Form teams of 5 from the pool (already sorted to keep groups together)
            $chunks = array_chunk($playerPool, 5);
            $fusedCount = 0;
            $standardRoles = ['Jungler', 'Roam', 'Gold Laner', 'Exp Laner', 'Mid Laner'];

            foreach ($chunks as $index => $chunk) {
                $teamName = "Fused Team " . ($index + 1) . " - " . date('md');
                
                $newTeam = CampusTournamentTeam::create([
                    'tournament_id' => $tournament->id,
                    'team_name' => $teamName,
                    'captain_id' => $chunk[0], // First player in chunk is captain
                    'status' => count($chunk) >= 5 ? 'registered' : 'assembling',
                    'type' => 'solo'
                ]);

                // Randomly assign roles for this team
                $teamRoles = $standardRoles;
                shuffle($teamRoles);

                foreach ($chunk as $cIndex => $playerId) {
                    CampusTournamentTeamMember::create([
                        'team_id' => $newTeam->id,
                        'player_id' => $playerId,
                        'role' => $cIndex === 0 ? 'captain' : 'member',
                        'lane_role' => $teamRoles[$cIndex] ?? 'Member', // Assign a random role
                        'status' => 'accepted'
                    ]);
                }
                $fusedCount++;
            }

            DB::commit();
            $this->info("Successfully locked and fused {$fusedCount} teams for {$tournament->school_name}.");
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Failed to lock/fuse tournament {$tournament->id}: " . $e->getMessage());
            \Log::error("Scheduled Lock Error (TID: {$tournament->id}): " . $e->getMessage());
        }
    }
}
