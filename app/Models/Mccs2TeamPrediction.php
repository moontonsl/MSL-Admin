<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mccs2TeamPrediction extends Model
{
    protected $fillable = [
        'ml_id',
        'selected_teams',
    ];

    protected $casts = [
        'selected_teams' => 'array',
    ];
} 