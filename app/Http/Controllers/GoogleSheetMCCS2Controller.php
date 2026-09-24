<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class GoogleSheetMCCS2Controller extends Controller
{
    public function exportMCCS2PredictionsToGoogleSheet()
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
        $spreadsheetId = '1vbR9YcFm-wobfzsf8sgBbUnivHpb4SPMaYN-Bhr4MV0'; 
        $range = 'MCCS2Predictions'; 

        // 3. Run SQL Query
        $teamResults = DB::table('mccs2_team_predictions')
            ->join('ml_users', 'mccs2_team_predictions.ml_id', '=', 'ml_users.ml_id')
            ->select(
                'mccs2_team_predictions.ml_id', 
                'ml_users.server_id', 
                'ml_users.ign',
                'mccs2_team_predictions.selected_teams',
                'mccs2_team_predictions.created_at as team_vote_date'
            )
            ->get();

        $playerResults = DB::table('mccs2_player_predictions')
            ->join('ml_users', 'mccs2_player_predictions.ml_id', '=', 'ml_users.ml_id')
            ->select(
                'mccs2_player_predictions.ml_id',
                'ml_users.server_id',
                'ml_users.ign',
                'mccs2_player_predictions.role',
                'mccs2_player_predictions.selected_players',
                'mccs2_player_predictions.created_at as player_vote_date'
            )
            ->get();

        // Group player results by ml_id
        $playerResultsByUser = $playerResults->groupBy('ml_id');

        // 4. Prepare values for Google Sheets
        $values = [];

        // Add header row
        $values[] = [
            'ML ID', 
            'Server ID', 
            'IGN', 
            'Selected Teams', 
            'Selected Players (GOLD)', 
            'Selected Players (JUNGLER)', 
            'Selected Players (EXP)', 
            'Selected Players (MIDDLE)', 
            'Selected Players (ROAMER)', 
            'Team Vote Date',
            'Player Vote Date'
        ];

        foreach ($teamResults as $teamRow) {
            // Decode team data
            $selectedTeams = json_decode($teamRow->selected_teams, true);
            $teamsString = '';
            if ($selectedTeams) {
                $teamNames = array_map(function($team) {
                    return $team['name'] ?? 'Unknown';
                }, $selectedTeams);
                $teamsString = implode(', ', $teamNames);
            }

            // Get player data for this user
            $userPlayerResults = $playerResultsByUser->get($teamRow->ml_id, collect());
            
            // Format players by role
            $goldPlayers = '';
            $junglerPlayers = '';
            $expPlayers = '';
            $middlePlayers = '';
            $roamerPlayers = '';

            foreach ($userPlayerResults as $playerRow) {
                $selectedPlayers = json_decode($playerRow->selected_players, true);
                if ($selectedPlayers) {
                    $playerNames = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers));
                    
                    switch ($playerRow->role) {
                        case 'GOLD':
                            $goldPlayers = $playerNames;
                            break;
                        case 'JUNGLER':
                            $junglerPlayers = $playerNames;
                            break;
                        case 'EXP':
                            $expPlayers = $playerNames;
                            break;
                        case 'MIDDLE':
                            $middlePlayers = $playerNames;
                            break;
                        case 'ROAMER':
                            $roamerPlayers = $playerNames;
                            break;
                    }
                }
            }

            $values[] = [
                $teamRow->ml_id,
                $teamRow->server_id,
                $teamRow->ign,
                $teamsString,
                $goldPlayers,
                $junglerPlayers,
                $expPlayers,
                $middlePlayers,
                $roamerPlayers,
                $teamRow->team_vote_date,
                $userPlayerResults->first() ? $userPlayerResults->first()->player_vote_date : ''
            ];
        }

        // Clear existing data
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
            'message' => '✅ MCCS2Predictions data exported to Google Sheets!',
            'total_votes' => count($teamResults)
        ]);
    }
}
