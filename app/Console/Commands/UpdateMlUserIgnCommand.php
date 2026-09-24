<?php

namespace App\Console\Commands;

use App\Models\MlUser;
use App\Services\CodashopService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateMlUserIgnCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ml-users:update-ign 
                            {--limit= : Limit the number of users to process}
                            {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update IGN (In-Game Name) for ML users from Codashop API';

    protected $codashopService;

    /**
     * Create a new command instance.
     */
    public function __construct(CodashopService $codashopService)
    {
        parent::__construct();
        $this->codashopService = $codashopService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting IGN update process...');
        
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }

        // Get all ML users with ml_id and server_id
        $query = MlUser::whereNotNull('ml_id')
            ->whereNotNull('server_id')
            ->where('ml_id', '!=', '')
            ->where('server_id', '!=', '');
        
        if ($limit) {
            $query->limit($limit);
        }
        
        $users = $query->get();
        $totalUsers = $users->count();
        
        $this->info("Found {$totalUsers} users to process");
        
        if ($totalUsers === 0) {
            $this->warn('No users found to process');
            return Command::SUCCESS;
        }

        $updated = 0;
        $skipped = 0;
        $errors = 0;
        $progressBar = $this->output->createProgressBar($totalUsers);
        $progressBar->start();

        foreach ($users as $user) {
            try {
                // Get username from Codashop
                $result = $this->codashopService->getUsername($user->ml_id, $user->server_id);
                
                if (!$result || !isset($result['username'])) {
                    $errors++;
                    $this->newLine();
                    $this->error("Failed to get username for ml_id: {$user->ml_id}, server_id: {$user->server_id}");
                    $progressBar->advance();
                    continue;
                }

                $codashopUsername = $result['username'];
                
                // Compare with current IGN
                if ($user->ign === $codashopUsername) {
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }

                // Update IGN if different
                if (!$dryRun) {
                    $oldIgn = $user->ign;
                    $user->ign = $codashopUsername;
                    $user->save();
                    
                    Log::info('Updated ML User IGN', [
                        'ml_id' => $user->ml_id,
                        'server_id' => $user->server_id,
                        'old_ign' => $oldIgn,
                        'new_ign' => $codashopUsername
                    ]);
                } else {
                    $this->newLine();
                    $this->line("Would update ml_id {$user->ml_id}: '{$user->ign}' -> '{$codashopUsername}'");
                }
                
                $updated++;
                
            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Error processing ml_id {$user->ml_id}: " . $e->getMessage());
                
                Log::error('Error updating ML User IGN', [
                    'ml_id' => $user->ml_id,
                    'server_id' => $user->server_id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
            
            $progressBar->advance();
            
            // Add a small delay to avoid rate limiting
            usleep(500000); // 0.5 seconds
        }

        $progressBar->finish();
        $this->newLine(2);
        
        // Summary
        $this->info('=== Summary ===');
        $this->info("Total processed: {$totalUsers}");
        $this->info("Updated: {$updated}");
        $this->info("Skipped (no change): {$skipped}");
        $this->info("Errors: {$errors}");
        
        if ($dryRun) {
            $this->warn('This was a DRY RUN - No changes were saved');
        }

        return Command::SUCCESS;
    }
}

