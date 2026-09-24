<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class GoogleSheetAwardNominationsController extends Controller
{
    public function exportToGoogleSheet()
    {
        // 1. Load Google Client
        $client = new Google_Client();
        $client->setApplicationName('Laravel Google Sheets Export - Award Nominations');
        $client->setScopes([
            Google_Service_Sheets::SPREADSHEETS,
            Google_Service_Sheets::DRIVE
        ]);
        $client->setAuthConfig(storage_path('app/google/credentials.json'));
        $client->setAccessType('offline');

        $service = new Google_Service_Sheets($client);

        // 2. Spreadsheet ID and Sheet Name
        $spreadsheetId = '1TjW9fY8dNxNkJULmKl9wVb4Yv9Z46ZTe-D27aXTvtIA'; 
        $range = 'Sheet1'; 

        // 3. Run SQL Query
        $results = DB::table('award_nominations')
            ->select('id', 'ml_id', 'award_id', 'award_type', 'nominator_name', 'nominee_name', 'reason', 'created_at')
            ->get();

        // 4. Prepare values for Google Sheets
        $values = [];

        // Add header row
        $values[] = [
            'ID', 
            'ML ID', 
            'Award Category', 
            'Award Type', 
            'Nominator Name', 
            'Nominee Name', 
            'Reason', 
            'Submitted At'
        ];

        foreach ($results as $row) {
            $mappedAwardCategory = match($row->award_type) {
                'organization' => 'Organization Award',
                'individual', 'student' => 'Individual Award',
                default => $row->award_type,
            };

            $mappedAwardType = match($row->award_id) {
                'org-year' => 'Organization of the Year',
                'best-event' => 'Best Event of the Year',
                'rising-org' => 'Rising Organization Award',
                'student-impact' => 'Student Community Impact Award',
                'collaboration' => 'Collaboration of the Year',
                'service-esports' => 'Service Through Esports Award',
                'org-partner' => 'Organization Partner of the Year',
                'esports-advocate' => 'Esports Advocate of the Year',
                'student-talent' => 'Student Talent of the Year',
                'student-creator' => 'Student Creator of the Year',
                default => $row->award_id,
            };

            $values[] = [
                $row->id,
                $row->ml_id,
                $mappedAwardCategory,
                $mappedAwardType,
                $row->nominator_name,
                $row->nominee_name,
                $row->reason,
                $row->created_at
            ];
        }

        $service->spreadsheets_values->clear($spreadsheetId, $range, new \Google_Service_Sheets_ClearValuesRequest());

        // 5. Push to Google Sheets
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);

        $params = ['valueInputOption' => 'RAW'];

        $service->spreadsheets_values->update(
            $spreadsheetId,
            $range,
            $body,
            $params
        );

        return "✅ Award Nominations data exported to Google Sheets!";
    }
}
