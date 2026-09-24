<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\DB;
use App\Models\NarutoFanArt;
use App\Http\Controllers\Controller;

class GoogleSheetNarutoController extends Controller
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
        $spreadsheetId = '1OVZzR7M9ljt0FA0Iw2-SaEPr00v0fyeI2EmxqRQvYvU';
        $range = 'Sheet1';

        // 3. Get Data from DB
        $results = NarutoFanArt::all();

        // 4. Prepare values for Google Sheets
        $values = [];

        // Add header row
        $values[] = ['id', 'name', 'school', 'ml_id', 'server_id', 'facebook_profile_link', 'post_link', 'created_at'];

        foreach ($results as $row) {
            $values[] = [
                $row->id,
                $row->name,
                $row->school,
                $row->ml_id,
                $row->server_id,
                $row->facebook_profile_link,
                $row->post_link,
                $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : ''
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

        return response()->json([
            'success' => true,
            'message' => '✅ NarutoFanArt data exported to Google Sheets!',
            'total_rows' => count($results)
        ]);
    }
}
