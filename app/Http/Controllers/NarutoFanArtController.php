<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NarutoFanArt;
use Illuminate\Support\Facades\Log;

class NarutoFanArtController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'school' => 'required|string|max:255',
                'uid' => 'required|string|max:255',
                'server' => 'required|string|max:255',
                'facebookProfileLink' => 'required|url|max:500',
                'postLink' => 'required|url|max:500',
            ]);

            $naruto = NarutoFanArt::create([
                'name' => $validated['name'],
                'school' => $validated['school'],
                'ml_id' => $validated['uid'],
                'server_id' => $validated['server'],
                'facebook_profile_link' => $validated['facebookProfileLink'],
                'post_link' => $validated['postLink'],
            ]);

            // Automatically append directly to Google Sheets
            try {
                $client = new \Google_Client();
                $client->setApplicationName('Laravel Google Sheets Export');
                $client->setScopes([\Google_Service_Sheets::SPREADSHEETS]);
                $client->setAuthConfig(storage_path('app/google/credentials.json'));
                $client->setAccessType('offline');

                $service = new \Google_Service_Sheets($client);
                $spreadsheetId = '1OVZzR7M9ljt0FA0Iw2-SaEPr00v0fyeI2EmxqRQvYvU';
                $range = 'Sheet1';

                $values = [
                    [
                        $naruto->id,
                        $naruto->name,
                        $naruto->school,
                        $naruto->ml_id,
                        $naruto->server_id,
                        $naruto->facebook_profile_link,
                        $naruto->post_link,
                        $naruto->created_at->format('Y-m-d H:i:s')
                    ]
                ];

                $body = new \Google_Service_Sheets_ValueRange([
                    'values' => $values
                ]);

                $params = [
                    'valueInputOption' => 'RAW',
                    'insertDataOption' => 'INSERT_ROWS'
                ];

                $service->spreadsheets_values->append(
                    $spreadsheetId,
                    $range,
                    $body,
                    $params
                );
            } catch (\Exception $sheetError) {
                Log::error('Google Sheet Append Error: ' . $sheetError->getMessage());
                // Still return success to user since DB insert worked
            }

            return response()->json(['success' => true, 'message' => 'Entry submitted successfully!']);
        } catch (\Exception $e) {
            Log::error('Naruto Fan Art Submission Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error submitting entry'], 500);
        }
    }
}
