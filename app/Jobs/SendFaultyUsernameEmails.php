<?php

namespace App\Jobs;

use App\Mail\FaultyUsernameMail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendFaultyUsernameEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userIds;
    public $batchNumber;
    public $totalBatches;

    /**
     * Create a new job instance.
     */
    public function __construct(array $userIds, int $batchNumber = 1, int $totalBatches = 1)
    {
        $this->userIds = $userIds;
        $this->batchNumber = $batchNumber;
        $this->totalBatches = $totalBatches;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting batch {$this->batchNumber}/{$this->totalBatches} with " . count($this->userIds) . " users");

        $users = User::whereIn('id', $this->userIds)->get();
        $successCount = 0;
        $errorCount = 0;

        foreach ($users as $user) {
            try {
                $issueType = $this->determineIssueType($user);
                
                if ($issueType) {
                    Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                    $successCount++;
                    
                    Log::info("Email sent to user {$user->id} ({$user->email}) for issue: {$issueType}");
                    
                    // Add a small delay to avoid overwhelming the mail server
                    usleep(100000); // 0.1 seconds
                }
            } catch (\Exception $e) {
                $errorCount++;
                Log::error("Failed to send email to user {$user->id} ({$user->email}): " . $e->getMessage());
            }
        }

        Log::info("Batch {$this->batchNumber}/{$this->totalBatches} completed. Success: {$successCount}, Errors: {$errorCount}");
    }

    /**
     * Determine the type of username issue
     */
    private function determineIssueType(User $user): ?string
    {
        $username = $user->username;

        if (is_null($username) || trim($username) === '') {
            return 'Empty/NULL username';
        }

        if (strlen($username) <= 3) {
            return 'Too short (≤3 chars)';
        }

        if (strpos($username, ' ') !== false) {
            return 'Contains spaces';
        }

        if (strlen($username) > 15) {
            return 'Too long (>15 chars)';
        }

        return null; // No issue found
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Batch {$this->batchNumber}/{$this->totalBatches} failed: " . $exception->getMessage());
    }
} 