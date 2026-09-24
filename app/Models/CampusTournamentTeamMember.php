<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampusTournamentTeamMember extends Model
{
    protected $fillable = [
        'team_id', 'player_id', 'role', 'lane_role', 'status'
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(CampusTournamentTeam::class, 'team_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player_id');
    }
}
