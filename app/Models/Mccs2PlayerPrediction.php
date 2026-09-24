<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mccs2PlayerPrediction extends Model
{
    protected $fillable = [
        'ml_id',
        'role',
        'selected_players',
    ];

    protected $casts = [
        'selected_players' => 'array',
    ];
} 