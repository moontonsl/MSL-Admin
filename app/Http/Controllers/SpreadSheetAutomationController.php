<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SpreadSheetAutomationController extends Controller
{
    /**
     * Export users data to Google Spreadsheet
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportUsersToSpreadsheet(Request $request)
    {
        // Increase memory limit and execution time
        ini_set('memory_limit', '512M');
        set_time_limit(300); // 5 minutes
        
        Log::info('Starting spreadsheet export process');
        
        try {
           
            $spreadsheetId = "1216kHWU6fpbb_zDz6d2SKh9SZJjUqt0ObvxsdIDGQg0";
            $range = "MainDB!A1";
            $clearRange = "MainDB!A:AH"; // Clear all columns from A to AH

            // 2. Prepare data for spreadsheet
            $data = [];
            
            // Add header row with all user fields
            $data[] = [
                'ID',
                'Name',
                'Surname',
                'Suffix',
                'Email',
                'Username',
                'ML ID',
                'ML Server',
                'ML IGN',
                'Status',
                'Facebook Link',
                'Birthday',
                'Age',
                'Gender',
                'Contact Number',
                'Course',
                'University',
                'Year Level',
                'Region',
                'Island',
                'Squad Abbreviation',
                'Squad Name',
                'In Game Role',
                'Main Hero',
                'Rank',
                'Student ID',
                'Proof of Enrollment',
                'Role',
                'State',
                'Email Verified At',
                'Created At',
                'Updated At',
                'verified_by',
                'verified_date',
            ];
            
            // 1. Get users data in chunks to avoid memory issues
            $userCount = User::count();
            Log::info("Found {$userCount} users to export");

            if ($userCount === 0) {
                Log::warning('No users found in database to export');
            }

            User::chunk(100, function($userChunk) use (&$data) {
                // Process each chunk
                foreach ($userChunk as $user) {
                    $data[] = [
                        $user->id ?? 'N/A',
                        $user->name ?? 'N/A',
                        $user->surname ?? 'N/A',
                        $user->suffix ?? 'N/A',
                        $user->email ?? 'N/A',
                        $user->username ?? 'N/A',
                        $user->ml_id ?? 'N/A',
                        $user->ml_server ?? 'N/A',
                        $user->ml_ign ?? 'N/A',
                        $user->status ?? 'N/A',
                        $user->facebook_link ?? 'N/A',
                        $user->birthday ?? 'N/A',
                        $user->age ?? 'N/A',
                        $user->gender ?? 'N/A',
                        $user->contact_number ?? 'N/A',
                        $user->course ?? 'N/A',
                        $user->university ?? 'N/A',
                        $user->year_level ?? 'N/A',
                        $user->region ?? 'N/A',
                        $user->island ?? 'N/A',
                        $user->squadAbbreviation ?? 'N/A',
                        $user->squadName ?? 'N/A',
                        $user->inGameRole ?? 'N/A',
                        $user->mainHero ?? 'N/A',
                        $user->rank ?? 'N/A',
                        $user->studentId ?? 'N/A',
                        $user->proofOfEnrollment ?? 'N/A',
                        $user->role ?? 'N/A',
                        $user->state ?? 'N/A',
                        $user->email_verified_at ?? 'N/A',
                        $user->created_at ?? 'N/A',
                        $user->updated_at ?? 'N/A',
                        $user->verified_by ?? 'N/A',
                        $user->verified_date ?? 'N/A'
                    ];
                }
            });

            // 3. Load Google Client
            $client = new Google_Client();
            $client->setApplicationName('Laravel Google Sheets Export');
            $client->setScopes([
                Google_Service_Sheets::SPREADSHEETS,
                Google_Service_Sheets::DRIVE
            ]);
            $client->setAuthConfig(storage_path('app/googlecred/laravel-sheet-key.json'));
            $client->setAccessType('offline');

            $service = new Google_Service_Sheets($client);

            // 4. Clear existing data
            Log::info("Clearing spreadsheet range: {$clearRange}");
            $service->spreadsheets_values->clear($spreadsheetId, $clearRange, new \Google_Service_Sheets_ClearValuesRequest());

            // 5. Write data
            $body = new \Google_Service_Sheets_ValueRange([
                'values' => $data
            ]);

            $params = ['valueInputOption' => 'RAW'];

            $result = $service->spreadsheets_values->update(
                $spreadsheetId,
                $range,
                $body,
                $params
            );
            
            Log::info("Spreadsheet updated successfully. Updated cells: " . $result->getUpdatedCells());
                                                

            return response()->json([
                'success' => true,
                'message' => 'Users data exported successfully',
                'total_users_in_db' => $userCount,
                'total_rows_written' => count($data),
                'total_columns' => count($data[0]),
                'updated_cells' => $result->getUpdatedCells(),
                'spreadsheet_id' => $spreadsheetId
            ]);

        } catch (\Exception $e) {
            Log::error('Error exporting users data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error exporting users data',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
