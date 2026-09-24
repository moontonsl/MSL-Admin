<?php

namespace App\Http\Controllers;

use App\Models\Mccs2TeamPrediction;
use App\Models\Mccs2PlayerPrediction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Mccs2PredictionsController extends Controller
{
    public function show(Request $request)
    {
        $mlUser = session('ml_user');
        if (!$mlUser) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Please login with your ML account first.'], 401);
            }
            return redirect()->route('ml.login')->with('error', 'Please login with your ML account first.');
        }

        // Get team prediction
        $teamPrediction = Mccs2TeamPrediction::where('ml_id', $mlUser->ml_id)->first();
        
        // Get player predictions for each role
        $playerPredictions = Mccs2PlayerPrediction::where('ml_id', $mlUser->ml_id)->get()->keyBy('role');
        
        $roles = ['GOLD', 'JUNGLER', 'EXP', 'MIDDLE', 'ROAMER'];
        $roleVotes = [];
        foreach ($roles as $role) {
            $roleVotes[$role] = $playerPredictions->get($role);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'teamPrediction' => $teamPrediction,
                'roleVotes' => $roleVotes,
                'ml_user' => [
                    'ml_id' => $mlUser->ml_id,
                    'ign' => $mlUser->ign,
                    'server_id' => $mlUser->server_id
                ],
            ]);
        }

        return Inertia::render('MCC/MCCS2Predictions/index', [
            'teamPrediction' => $teamPrediction,
            'roleVotes' => $roleVotes,
            'ml_user' => [
                'ml_id' => $mlUser->ml_id,
                'ign' => $mlUser->ign,
                'server_id' => $mlUser->server_id
            ],
        ]);
    }

    public function storeTeams(Request $request)
    {
        $mlUser = session('ml_user');
        if (!$mlUser) {
            return response()->json(['error' => 'Please login with your ML account first.'], 401);
        }

        // Check if user has already voted for teams
        if (Mccs2TeamPrediction::where('ml_id', $mlUser->ml_id)->exists()) {
            return response()->json(['error' => 'You have already voted for teams.'], 400);
        }

        $validated = $request->validate([
            'selected_teams' => 'required|array|min:1|max:2',
            'selected_teams.*.image' => 'required|string',
            'selected_teams.*.name' => 'required|string',
        ]);

        $prediction = Mccs2TeamPrediction::create([
            'ml_id' => $mlUser->ml_id,
            'selected_teams' => $request->selected_teams,
        ]);

        // Auto-export to Google Sheets after successful vote
        try {
            $googleSheetController = new \App\Http\Controllers\GoogleSheetMCCS2Controller();
            $googleSheetController->exportMCCS2PredictionsToGoogleSheet();
        } catch (\Exception $e) {
            \Log::error('Google Sheets export failed after team vote: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Your team vote has been submitted!']);
    }

    public function storePlayers(Request $request)
    {
        $mlUser = session('ml_user');
        if (!$mlUser) {
            return response()->json(['error' => 'Please login with your ML account first.'], 401);
        }

        $request->validate([
            'role' => 'required|string|in:GOLD,JUNGLER,EXP,MIDDLE,ROAMER',
            'selected_players' => 'required|array|min:1|max:3',
            'selected_players.*.name' => 'required|string',
            'selected_players.*.image' => 'required|string',
        ]);

        // Check if user has already voted for this role
        if (Mccs2PlayerPrediction::where('ml_id', $mlUser->ml_id)->where('role', $request->role)->exists()) {
            return response()->json(['error' => "You have already voted for {$request->role} players."], 400);
        }

        $prediction = Mccs2PlayerPrediction::create([
            'ml_id' => $mlUser->ml_id,
            'role' => $request->role,
            'selected_players' => $request->selected_players,
        ]);

        // Auto-export to Google Sheets after successful vote
        try {
            $googleSheetController = new \App\Http\Controllers\GoogleSheetMCCS2Controller();
            $googleSheetController->exportMCCS2PredictionsToGoogleSheet();
        } catch (\Exception $e) {
            \Log::error('Google Sheets export failed after player vote: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => "Your {$request->role} player vote has been submitted!"]);
    }
} 