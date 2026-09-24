<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class GoogleSheetController extends Controller
{
    public function exportToGoogleSheet()
    {
        // 1. Load Google Client
        $client = new Google_Client();
        $client->setApplicationName('Laravel Google Sheets Export');
        $client->setScopes([
            Google_Service_Sheets::SPREADSHEETS,
            Google_Service_Sheets::DRIVE
        ]);
        $client->setAuthConfig(storage_path('app/google/credentials.json'));
        $client->setAccessType('offline');

        $service = new Google_Service_Sheets($client);

        // 2. Spreadsheet ID and Sheet Name
        $spreadsheetId = '1VPljZyDWARCBKaqyYARjqZ4BT022kRwUgAE9kvK_zBk'; 
        $range = 'Sheet1'; 

        // 3. Run SQL Query
        $results = DB::table('votings')
            ->join('ml_users', 'votings.ml_id', '=', 'ml_users.ml_id')
            ->select('votings.ml_id', 'ml_users.server_id', 'votings.bracket', 'votings.team')
            ->get();

        // 4. Prepare values for Google Sheets
        $values = [];

        // Add header row
        $values[] = ['ml_id', 'server_id', 'bracket', 'team'];

        foreach ($results as $row) {
            $values[] = [
                $row->ml_id,
                $row->server_id,
                $row->bracket,
                $row->team
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

        return "✅ Data exported to Google Sheets!";
    }
}
