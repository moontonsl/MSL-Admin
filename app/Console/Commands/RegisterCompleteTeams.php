<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CampusTournamentTeam;
use App\Models\CampusTournamentTeamMember;
use Illuminate\Support\Facades\DB;

class RegisterCompleteTeams extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:register-complete {--dry-run : Only show teams that would be updated}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically update status from assembling to registered for teams with 5 accepted members';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Scanning for complete teams in 'assembling' status...");

        $teams = CampusTournamentTeam::where('status', 'assembling')->get();
        
        if ($teams->isEmpty()) {
            $this->info("No teams found with status 'assembling'.");
            return 0;
        }

        $updateCount = 0;
        $dryRun = $this->option('dry-run');

        DB::beginTransaction();
        try {
            foreach ($teams as $team) {
                $acceptedCount = CampusTournamentTeamMember::where('team_id', $team->id)
                    ->where('status', 'accepted')
                    ->count();

                if ($acceptedCount === 5) {
                    if ($dryRun) {
                        $this->line("Dry-run: Team ID: {$team->id} ({$team->team_name}) would be registered.");
                    } else {
                        $team->update(['status' => 'registered']);
                        $this->info("Team ID: {$team->id} ({$team->team_name}) updated to 'registered'.");
                        $updateCount++;
                    }
                }
            }

            if ($dryRun) {
                $this->info("Dry-run complete. No changes were made.");
                DB::rollBack();
            } else {
                DB::commit();
                $this->success("Successfully updated $updateCount teams to 'registered'.");
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    /**
     * Helper to show green success message as info() doesn't always show color in all shells
     */
    protected function success($message)
    {
        $this->output->writeln("<info>$message</info>");
    }
}
