<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
class DeleteExpiredProofOfEnrollments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:delete-expired-proofs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete proof of enrollment files for users verified more than 3 months ago';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find users with proof of enrollment who were verified more than 3 months ago
        $users = User::whereNotNull('proofOfEnrollment')
            ->whereNotNull('verified_date')
            ->where('verified_date', '<=', Carbon::now()->subMonths(3))
            ->get();

        $count = 0;

        foreach ($users as $user) {
            $filePath = $user->proofOfEnrollment;
            
            // Delete from local disk
            if (Storage::disk('local')->exists($filePath)) {
                Storage::disk('local')->delete($filePath);
            }
            
            // Just in case it was stored/moved to public, also check/delete there
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            
            // Clear the database record
            $user->update([
                'proofOfEnrollment' => null
            ]);
            
            $this->info("Deleted expired proof of enrollment for user {$user->username} (ID: {$user->id}).");
            $count++;
        }

        if ($count > 0) {
            $this->info("Successfully deleted {$count} expired proof of enrollment files.");
        } else {
            $this->info("No expired proof of enrollment files found.");
        }
    }
}
