<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampusTournamentTeam extends Model
{
    protected $fillable = [
        'tournament_id', 'team_name', 'discord_id', 'captain_id', 'invite_code', 'result', 'status', 'type'
    ];

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class);
    }

    public function captain(): BelongsTo
    {
        return $this->belongsTo(User::class, 'captain_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(CampusTournamentTeamMember::class, 'team_id');
    }
}
