<?php

namespace App\Http\Controllers;

use App\Models\Bracket;
use App\Models\BracketTeam;
use Illuminate\Http\Request;

class BracketTeamController extends Controller
{
    public function getTeamsByBracket($bracketName)
    {
        $bracket = Bracket::where('name', $bracketName)->firstOrFail();
        
        $teams = $bracket->teams()
            ->orderBy('team_order')
            ->get()
            ->map(function ($team) use ($bracket) {
                return [
                    'id' => $team->id,
                    'name' => $team->team_name,
                    'image' => $team->image_path,
                    'status' => $bracket->status
                ];
            });

        return response()->json($teams);
    }

    public function getAllBrackets()
    {
        $brackets = Bracket::with('teams')->get();
        
        $result = [];
        foreach ($brackets as $bracket) {
            $result[$bracket->name] = [
                'status' => $bracket->status,
                'teams' => $bracket->teams->map(function ($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->team_name,
                        'image' => $team->image_path
                    ];
                })
            ];
        }

        return response()->json($result);
    }

    public function updateBracketStatus(Request $request, $bracketName)
    {
        $request->validate([
            'status' => ['required', 'string', 'in:open,closed,upcoming']
        ]);

        $bracket = Bracket::where('name', $bracketName)->firstOrFail();
        $bracket->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Bracket status updated successfully',
            'bracket' => [
                'name' => $bracket->name,
                'status' => $bracket->status
            ]
        ]);
    }
} 