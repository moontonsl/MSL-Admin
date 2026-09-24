<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mccs2Prediction extends Model
{
    protected $fillable = [
        'ml_id',
        'selected_teams',
        'selected_players',
    ];

    protected $casts = [
        'selected_teams' => 'array',
        'selected_players' => 'array',
    ];
} 