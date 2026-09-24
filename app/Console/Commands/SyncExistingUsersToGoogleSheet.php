<?php

namespace App\Console\Commands;

use App\Models\User;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncExistingUsersToGoogleSheet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:sync-to-sheets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all existing non-student users to Google Sheets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting bulk user sync to Google Sheets...');

        try {
            set_time_limit(0); // Ensure the script doesn't timeout for large datasets

            $client = new Google_Client();
            $client->setApplicationName('Laravel Google Sheets Bulk Sync');
            $client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/google/credentials.json'));
            $client->setAccessType('offline');

            $service = new Google_Service_Sheets($client);
            $spreadsheetId = '1Q-rCwxccHiQClbROJkRzg5XK6_mtKm_5AwQDdaHAPBI';
            $range = 'Role Monitoring';

            // 1. Clear existing data and EVERYTHING (Values + Formatting)
            $this->info('🧹 Clearing existing data and formatting...');
            $service->spreadsheets_values->clear($spreadsheetId, $range, new \Google_Service_Sheets_ClearValuesRequest());
            
            // Batch update to clear all formatting from the sheet
            $clearFormatRequest = new \Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
                'requests' => [
                    new \Google_Service_Sheets_Request([
                        'updateCells' => [
                            'range' => ['sheetId' => 425549993],
                            'fields' => 'userEnteredFormat'
                        ]
                    ])
                ]
            ]);
            $service->spreadsheets->batchUpdate($spreadsheetId, $clearFormatRequest);

            // 2. Add headers
            $headers = [['Username', 'First Name', 'Last Name', 'Email', 'Role', 'Date Created']];
            $headerBody = new \Google_Service_Sheets_ValueRange(['values' => $headers]);
            $service->spreadsheets_values->update($spreadsheetId, $range . '!A1', $headerBody, ['valueInputOption' => 'RAW']);

            $excludedRoles = ['student', 'user'];
            $query = User::whereNotNull('role')
                ->where('role', '!=', '')
                ->whereRaw('LOWER(role) NOT IN ("' . implode('", "', $excludedRoles) . '")')
                ->orderByRaw("CASE 
                    WHEN role = 'Super Admin' THEN 1 
                    WHEN role = 'Regional Admin' THEN 2 
                    WHEN role = 'SL' THEN 3 
                    ELSE 4 
                END")
                ->orderBy('role', 'asc');

            $total = $query->count();
            $this->info("Total users to sync: {$total}");

            $bar = $this->output->createProgressBar($total);
            $bar->start();

            $currentRow = 2; // Data starts at row 2

            // Increased chunk size to 1000 for better performance with 30k+ records
            $query->chunk(1000, function ($users) use ($service, $spreadsheetId, $range, &$currentRow, $bar) {
                $values = [];
                foreach ($users as $user) {
                    $values[] = [
                        $user->username,
                        $user->name,
                        $user->surname,
                        $user->email,
                        $user->role,
                        $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s')
                    ];
                    $bar->advance();
                }

                if (!empty($values)) {
                    $rowCount = count($values);
                    $endRow = $currentRow + $rowCount - 1;
                    $updateRange = "{$range}!A{$currentRow}:F{$endRow}";
                    
                    $body = new \Google_Service_Sheets_ValueRange(['values' => $values]);
                    $service->spreadsheets_values->update(
                        $spreadsheetId,
                        $updateRange,
                        $body,
                        ['valueInputOption' => 'RAW']
                    );
                    
                    $currentRow += $rowCount;
                }
            });

            $bar->finish();
            $this->newLine();

            // 3. APPLY STYLING LAST (To prevent inheritance)
            $this->info('🎨 Applying header styling...');
            $styleRequests = [
                new \Google_Service_Sheets_Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => 425549993,
                            'startRowIndex' => 0,
                            'endRowIndex' => 1,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 6
                        ],
                        'cell' => [
                            'userEnteredFormat' => [
                                'backgroundColor' => ['red' => 0.149, 'green' => 0.149, 'blue' => 0.149],
                                'textFormat' => [
                                    'foregroundColor' => ['red' => 1.0, 'green' => 1.0, 'blue' => 1.0],
                                    'bold' => true,
                                    'fontSize' => 11
                                ],
                                'horizontalAlignment' => 'CENTER'
                            ]
                        ],
                        'fields' => 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
                    ]
                ])
            ];

            $batchStyleRequest = new \Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
                'requests' => $styleRequests
            ]);
            $service->spreadsheets->batchUpdate($spreadsheetId, $batchStyleRequest);

            $this->info('✅ Bulk sync completed successfully!');

        } catch (\Exception $e) {
            $this->error('❌ Sync Error: ' . $e->getMessage());
            Log::error('Bulk Google Sheet Sync Error: ' . $e->getMessage());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
