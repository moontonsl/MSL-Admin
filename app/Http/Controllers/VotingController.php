<?php

namespace App\Http\Controllers;

use App\Models\Voting;
use App\Models\MlUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Bracket;

class VotingController extends Controller
{
    public function index()
    {
        $brackets = ['MINDANAO BRACKET', 'VISAYAS BRACKET', 'LUZON A BRACKET', 'LUZON B BRACKET'];
        $userVotes = [];

        // Fetch status for each bracket from the database
        $bracketStatusDb = Bracket::whereIn('name', $brackets)->pluck('status', 'name');

        $mlUser = session('ml_user');
        if (!$mlUser) {
            return redirect()->route('ml.login')->with('error', 'Please login with your ML account first.');
        }

        $bracketStatus = [];
        foreach ($brackets as $bracket) {
            $hasVoted = Voting::hasUserVotedForBracket($mlUser->ml_id, $bracket);
            $bracketStatus[$bracket] = [
                'voted' => $hasVoted,
                'status' => $bracketStatusDb[$bracket] ?? 'open', // fallback to 'open'
            ];

            if ($hasVoted) {
                $votes = Voting::getUserVotesForBracket($mlUser->ml_id, $bracket)
                    ->map(function ($vote) {
                        return [
                            'id' => $vote->id,
                            'team' => $vote->team,
                            'image' => $vote->image,
                            'created_at' => $vote->created_at
                        ];
                    });
                $userVotes[$bracket] = $votes;
            } else {
                $userVotes[$bracket] = [];
            }
        }

        return Inertia::render('MCC/Predictions/index', [
            'userVotes' => $userVotes,
            'bracketStatus' => $bracketStatus,
            'ml_user' => [
                'ml_id' => $mlUser->ml_id,
                'ign' => $mlUser->ign,
                'server_id' => $mlUser->server_id
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bracket' => 'required|string|in:MINDANAO BRACKET,VISAYAS BRACKET,LUZON A BRACKET,LUZON B BRACKET',
            'selectedTeams' => 'required|array|min:1|max:2',
            'selectedTeams.*.id' => 'required|integer',
            'selectedTeams.*.name' => 'required|string',
            'selectedTeams.*.image' => 'required|string'
        ]);

        // Get the ML user from session
        $mlUser = session('ml_user');
        
        if (!$mlUser) {
            return redirect()->route('ml.login')->with('error', 'Please login with your ML account first.');
        }

        try {
            // Use the transaction-based method to create votes
            $votes = Voting::createVotesForBracket(
                $mlUser->ml_id,
                $request->bracket,
                $request->selectedTeams
            );

            return back()->with('success', 'Votes submitted successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
} 