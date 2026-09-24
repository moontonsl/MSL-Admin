<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Voting extends Model
{
    protected $fillable = [
        'ml_id',
        'bracket',
        'team',
        'image',
        'status'
    ];

    /**
     * Get the ML user that owns the vote.
     */
    public function mlUser(): BelongsTo
    {
        return $this->belongsTo(MlUser::class, 'ml_id', 'ml_id');
    }

    /**
     * Check if a user has voted for a specific bracket
     */
    public static function hasUserVotedForBracket(string $mlId, string $bracket): bool
    {
        return self::where('ml_id', $mlId)
            ->where('bracket', $bracket)
            ->exists();
    }

    /**
     * Get all votes for a user in a specific bracket
     */
    public static function getUserVotesForBracket(string $mlId, string $bracket)
    {
        return self::where('ml_id', $mlId)
            ->where('bracket', $bracket)
            ->get();
    }

    /**
     * Get the number of teams a user has voted for in a bracket
     */
    public static function getUserVoteCountForBracket(string $mlId, string $bracket): int
    {
        return self::where('ml_id', $mlId)
            ->where('bracket', $bracket)
            ->count();
    }

    /**
     * Create votes for a bracket with transaction to ensure data consistency
     */
    public static function createVotesForBracket(string $mlId, string $bracket, array $teams): array
    {
        return DB::transaction(function () use ($mlId, $bracket, $teams) {
            // Check if user has already voted for this bracket
            if (self::hasUserVotedForBracket($mlId, $bracket)) {
                throw new \Exception('You have already voted for this bracket.');
            }

            // Validate number of teams (1 or 2)
            if (count($teams) < 1 || count($teams) > 2) {
                throw new \Exception('You must vote for 1 or 2 teams.');
            }

            $votes = [];
            foreach ($teams as $team) {
                $votes[] = self::create([
                    'ml_id' => $mlId,
                    'bracket' => $bracket,
                    'team' => $team['name'],
                    'image' => $team['image'],
                    'status' => 'open'
                ]);
            }

            return $votes;
        });
    }
} 