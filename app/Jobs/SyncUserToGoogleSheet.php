<?php

namespace App\Jobs;

use App\Models\User;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncUserToGoogleSheet implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $role = strtolower($this->user->role ?? '');
            $excludedRoles = ['student', 'user'];
            
            if (empty($role) || in_array($role, $excludedRoles)) {
                return; // Silently skip
            }

            $client = new Google_Client();
            $client->setApplicationName('Laravel Google Sheets User Sync');
            $client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/google/credentials.json'));
            $client->setAccessType('offline');

            $service = new Google_Service_Sheets($client);
            $spreadsheetId = '1Q-rCwxccHiQClbROJkRzg5XK6_mtKm_5AwQDdaHAPBI';
            $sheetName = 'Role Monitoring';

            // 1. Search for existing user row by Email (Column D)
            // Fetching all emails in column D
            $rangeEmail = "{$sheetName}!D:D";
            $response = $service->spreadsheets_values->get($spreadsheetId, $rangeEmail);
            $existingEmails = $response->getValues() ?? [];

            $rowIndex = -1;
            $emailToFind = $this->user->email;

            foreach ($existingEmails as $index => $row) {
                if (isset($row[0]) && strcasecmp($row[0], $emailToFind) === 0) {
                    $rowIndex = $index + 1; // Google Sheets is 1-indexed
                    break;
                }
            }

            $values = [
                [
                    $this->user->username,
                    $this->user->name, // First Name
                    $this->user->surname, // Last Name
                    $this->user->email,
                    $this->user->role,
                    now()->format('Y-m-d H:i:s')
                ]
            ];

            $body = new \Google_Service_Sheets_ValueRange([
                'values' => $values
            ]);

            if ($rowIndex > 0) {
                // 2. UPDATE existing row
                $updateRange = "{$sheetName}!A{$rowIndex}";
                $service->spreadsheets_values->update(
                    $spreadsheetId,
                    $updateRange,
                    $body,
                    ['valueInputOption' => 'RAW']
                );
            } else {
                // 3. APPEND new row
                $service->spreadsheets_values->append(
                    $spreadsheetId,
                    $sheetName,
                    $body,
                    [
                        'valueInputOption' => 'RAW',
                        'insertDataOption' => 'INSERT_ROWS'
                    ]
                );
            }

        } catch (\Exception $e) {
            Log::error('Google Sheet User Sync Error: ' . $e->getMessage());
            throw $e; // Retry the job if it fails
        }
    }
}
