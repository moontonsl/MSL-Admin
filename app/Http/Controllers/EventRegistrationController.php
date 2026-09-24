<?php

namespace App\Http\Controllers;

use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\Log;

class EventRegistrationController extends Controller
{
    /**
     * Store a new event registration and sync with Google Sheets.
     */
    public function store(Request $request)
    {
        $eventName = $request->input('event_name');

        $rules = [
            'event_name' => 'required|string',
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mlbbId' => 'required|string|max:255',
            'mlbbServer' => 'required|string|max:255',
        ];

        // Conditional validation based on event_name
        if ($eventName === 'GM26Network') {
            $rules['facebookLink'] = 'required|string|max:255';
            $rules['community'] = 'required|string|max:255';
            $rules['school'] = 'required|string|max:255';
            $rules['postLink'] = 'required|string|max:255';
        } elseif ($eventName === 'GM26Comm') {
            $rules['facebookLink'] = 'required|string|max:255';
            $rules['community'] = 'required|string|max:255';
            $rules['school'] = 'required|string|max:255';
            $rules['proofLink'] = 'required|string|max:255';
        } else {
            // Default rules for other events
            $rules['region'] = 'required|string|max:255';
            $rules['venue'] = 'required|string|max:255';
            $rules['eventDate'] = 'required|date';
            $rules['attendanceMode'] = 'required|string|max:255';
        }

        $data = $request->validate($rules);

        // Map frontend keys to database columns
        $dbData = [
            'event_name' => $data['event_name'],
            'full_name' => $data['fullName'],
            'email' => $data['email'],
            'mlbb_id' => $data['mlbbId'],
            'mlbb_server' => $data['mlbbServer'],
        ];

        if (in_array($eventName, ['GM26Network', 'GM26Comm'])) {
            $dbData['facebook_link'] = $data['facebookLink'];
            $dbData['community'] = $data['community'];
            $dbData['school'] = $data['school'];
            $dbData['post_link'] = $data['postLink'] ?? null;
            $dbData['proof_link'] = $data['proofLink'] ?? null;
        } else {
            $dbData['region'] = $data['region'];
            $dbData['venue'] = $data['venue'];
            $dbData['event_date'] = $data['eventDate'];
            $dbData['attendance_mode'] = $data['attendanceMode'];
        }

        // Check for duplicate registration for the same event
        // Logic: if the user submit same MLBB UID but different MLBB Server ID this is a valid
        // but if the user submit MLBB UID and MLBB Server ID that has already recorded this is not valid
        $existing = EventRegistration::where('mlbb_id', $dbData['mlbb_id'])
            ->where('mlbb_server', $dbData['mlbb_server'])
            ->where('event_name', $dbData['event_name'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already registered for this event with this MLBB ID and Server.'
            ], 422);
        }

        try {
            // 1. Save to Database
            $registration = EventRegistration::create($dbData);

            // 2. Sync with Google Sheets
            $this->syncToGoogleSheet($registration);

            return response()->json([
                'success' => true,
                'message' => 'Registration submitted successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Event registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed. ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Append registration data to Google Sheets.
     */
    private function syncToGoogleSheet(EventRegistration $registration)
    {
        try {
            $spreadsheetId = '1vyfPrcm3hBa1B7vjIv8jmLBp5aDqYJ9pycAs-alQdU0';
            
            $isGM26 = str_starts_with($registration->event_name, 'GM26');

            if ($isGM26) {
                $spreadsheetId = '1BzMODSka3FWilUZimSYhQvDDCNlftE3bL91YnIjAerc';
                // Specialized column layout for GM26 (Removes empty columns for Region, Venue, etc.)
                $rowValues = [
                    (string)($registration->event_name ?? ''),
                    (string)($registration->full_name ?? ''),
                    (string)($registration->email ?? ''),
                    (string)($registration->mlbb_id ?? ''),
                    (string)($registration->mlbb_server ?? ''),
                    (string)($registration->created_at ? $registration->created_at->toDateTimeString() : ''),
                    (string)($registration->facebook_link ?? ''),
                    (string)($registration->community ?? ''),
                    (string)($registration->school ?? ''),
                    (string)($registration->post_link ?? $registration->proof_link ?? ''),
                ];
            } else {
                // Standard layout for other events
                $rowValues = [
                    (string)($registration->event_name ?? ''),
                    (string)($registration->full_name ?? ''),
                    (string)($registration->region ?? ''),
                    (string)($registration->venue ?? ''),
                    (string)($registration->event_date ?? ''),
                    (string)($registration->email ?? ''),
                    (string)($registration->mlbb_id ?? ''),
                    (string)($registration->mlbb_server ?? ''),
                    (string)($registration->created_at ? $registration->created_at->toDateTimeString() : ''),
                    (string)($registration->attendance_mode ?? ''),
                ];
            }

            $values = [$rowValues];

            // Restoring missing initialization
            $range = 'A1'; 
            $client = new Google_Client();
            $client->setApplicationName('MSL Event Registration');
            $client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/google/credentials.json'));
            $client->setAccessType('offline');
            $service = new Google_Service_Sheets($client);

            Log::info('Attempting Google Sheets sync', [
                'event' => $registration->event_name,
                'is_gm26' => $isGM26,
                'spreadsheet' => $spreadsheetId,
                'values_count' => count($rowValues)
            ]);

            $body = new \Google_Service_Sheets_ValueRange();
            $body->setValues($values);

            $params = ['valueInputOption' => 'RAW'];

            $service->spreadsheets_values->append(
                $spreadsheetId,
                $range,
                $body,
                $params
            );

            Log::info('Google Sheets sync successful');

        } catch (\Exception $e) {
            Log::error('Google Sheets sync error: ' . $e->getMessage());
            // We don't fail the whole request if sheet sync fails, but we log it.
        }
    }
}
