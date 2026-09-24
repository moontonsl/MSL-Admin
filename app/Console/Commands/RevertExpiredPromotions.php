<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RevertExpiredPromotions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promotions:revert-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Revert expired promotions back to regular student role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredUsers = \App\Models\User::where('promotion_expires_at', '<=', now())
            ->whereIn('role', ['SL', 'Regional Admin'])
            ->get();

        $count = $expiredUsers->count();

        foreach ($expiredUsers as $user) {
            $user->update([
                'role' => 'user',
                'promotion_expires_at' => null
            ]);
            
            $this->info("Reverted user {$user->username} (ID: {$user->id}) to student.");
        }

        if ($count > 0) {
            $this->info("Successfully reverted {$count} expired promotions.");
        } else {
            $this->info("No expired promotions found.");
        }
    }
}
